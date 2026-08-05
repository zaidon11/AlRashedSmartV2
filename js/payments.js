import { db, ref, get, update, push, ROOT_NODE } from "./firebase.js";

export async function processManualPayment(customerId, monthIndex, amount, employee = "Admin") {
    try {
        const customerRef = ref(db, `${ROOT_NODE}/customers/${customerId}`);
        const snapshot = await get(customerRef);
        if (!snapshot.exists()) throw new Error("الزبون غير موجود");

        const customer = snapshot.val();
        let month = customer.months[monthIndex];

        if (month.status === "Paid") throw new Error("هذا الشهر مدفوع بالكامل بالفعل");

        const paymentAmount = Number(amount);
        if (paymentAmount <= 0) throw new Error("أدخل مبلغ دفع صحيح");

        const dateNow = new Date().toISOString();
        const receiptNumber = "REC-" + Date.now().toString().slice(-6);

        const paymentRecord = {
            amount: paymentAmount,
            date: dateNow,
            type: "Manual",
            month: month.monthNumber,
            employee: employee,
            receiptNumber: receiptNumber
        };

        month.paid += paymentAmount;
        month.remaining = Math.max(0, month.required - month.paid);

        if (month.remaining === 0) {
            month.status = "Paid";
            month.paidDate = dateNow;
        } else {
            month.status = "Partial";
        }

        if (!month.payments) month.payments = [];
        month.payments.push(paymentRecord);

        customer.remaining = Math.max(0, customer.remaining - paymentAmount);
        if (customer.remaining === 0) customer.status = "Completed";

        await update(customerRef, {
            months: customer.months,
            remaining: customer.remaining,
            status: customer.status
        });

        const globalPaymentRef = push(ref(db, `${ROOT_NODE}/payments`));
        await update(globalPaymentRef, { ...paymentRecord, customerId: customerId, customerName: customer.name });

        return { success: true, receipt: paymentRecord };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function processAutoPayment(customerId, totalAmount, employee = "Admin") {
    try {
        const customerRef = ref(db, `${ROOT_NODE}/customers/${customerId}`);
        const snapshot = await get(customerRef);
        if (!snapshot.exists()) throw new Error("الزبون غير موجود");

        const customer = snapshot.val();
        let remainingToDistribute = Number(totalAmount);

        if (remainingToDistribute <= 0) throw new Error("أدخل مبلغ دفع صحيح");
        if (customer.remaining === 0) throw new Error("جميع أقساط الزبون مسددة بالكامل");

        const dateNow = new Date().toISOString();
        const receiptNumber = "AUTO-" + Date.now().toString().slice(-6);
        let totalPaidInThisTx = remainingToDistribute;

        for (let i = 0; i < customer.months.length; i++) {
            if (remainingToDistribute <= 0) break;

            let month = customer.months[i];
            if (month.status === "Paid") continue;

            let neededToComplete = month.required - month.paid;
            let amountForThisMonth = Math.min(remainingToDistribute, neededToComplete);

            month.paid += amountForThisMonth;
            month.remaining = month.required - month.paid;
            remainingToDistribute -= amountForThisMonth;

            if (month.remaining === 0) {
                month.status = "Paid";
                month.paidDate = dateNow;
            } else {
                month.status = "Partial";
            }

            const paymentRecord = {
                amount: amountForThisMonth,
                date: dateNow,
                type: "Auto",
                month: month.monthNumber,
                employee: employee,
                receiptNumber: receiptNumber
            };

            if (!month.payments) month.payments = [];
            month.payments.push(paymentRecord);
        }

        const actualPaid = totalPaidInThisTx - remainingToDistribute;
        customer.remaining = Math.max(0, customer.remaining - actualPaid);
        if (customer.remaining === 0) customer.status = "Completed";

        await update(customerRef, {
            months: customer.months,
            remaining: customer.remaining,
            status: customer.status
        });

        const mainReceipt = {
            amount: actualPaid,
            date: dateNow,
            type: "Auto",
            employee: employee,
            receiptNumber: receiptNumber,
            customerId: customerId,
            customerName: customer.name
        };

        const globalPaymentRef = push(ref(db, `${ROOT_NODE}/payments`));
        await update(globalPaymentRef, mainReceipt);

        return { success: true, receipt: mainReceipt };
    } catch (error) {
        return { success: false, message: error.message };
    }
}