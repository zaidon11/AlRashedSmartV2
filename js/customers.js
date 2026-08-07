import { db, ref, push, set, ROOT_NODE } from "./firebase.js";

export function generateInstallmentsSchedule(remainingAmount, monthlyInstallment, fixedPayDay, startDateStr) {
    const monthsCount = Math.ceil(remainingAmount / monthlyInstallment);
    const months = [];
    let currentBalance = remainingAmount;
    let baseDate = new Date(startDateStr);

    for (let i = 1; i <= monthsCount; i++) {
        let required = Math.min(monthlyInstallment, currentBalance);
        
        let dueDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, fixedPayDay);
        if (dueDate.getDate() !== Number(fixedPayDay)) {
            dueDate.setDate(0); 
        }

        months.push({
            monthNumber: i,
            required: required,
            paid: 0,
            remaining: required,
            status: "Unpaid",
            dueDate: dueDate.toISOString().split("T")[0],
            paidDate: null,
            payments: []
        });

        currentBalance -= required;
    }

    return { monthsCount, months };
}

export async function addCustomer(customerData) {
    try {
        const totalPrice = Number(customerData.totalPrice);
        const downPayment = Number(customerData.downPayment);
        const monthlyInstallment = Number(customerData.monthlyInstallment);
        const fixedPayDay = Number(customerData.fixedPayDay);
        const remaining = totalPrice - downPayment;

        if (remaining <= 0) {
            throw new Error("المبلغ المتبقي يجب أن يكون أكبر من صفر");
        }

        const { monthsCount, months } = generateInstallmentsSchedule(
            remaining,
            monthlyInstallment,
            fixedPayDay,
            customerData.purchaseDate
        );

        const newCustomerRef = push(ref(db, `${ROOT_NODE}/customers`));
        const customerId = newCustomerRef.key;

        // بناء البيانات الصافية بأمان تام ومنع خطأ trim الحاصل سابقاً
        const payload = {
            customerId: customerId,
            name: customerData.name ? customerData.name.trim() : "",
            phone: customerData.phone ? customerData.phone.trim() : "",
            device: customerData.device ? customerData.device.trim() : "",
            notes: customerData.notes ? customerData.notes.trim() : "",
            totalPrice: totalPrice,
            downPayment: downPayment,
            remaining: remaining,
            monthlyInstallment: monthlyInstallment,
            fixedPayDay: fixedPayDay,
            purchaseDate: customerData.purchaseDate,
            status: "Active",
            createdAt: new Date().toISOString(),
            monthsCount: monthsCount,
            months: months
        };

        await set(newCustomerRef, payload);
        return { success: true, customerId };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
