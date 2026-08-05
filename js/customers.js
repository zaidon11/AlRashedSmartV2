// js/customers.js
import { db, ref, push, set, ROOT_NODE } from "./firebase.js";

/**
 * حساب وإنشاء مصفوفة الأقساط بناءً على البيانات المدخلة
 */
export function generateInstallmentsSchedule(remainingAmount, monthlyInstallment, fixedPayDay, startDateStr) {
    const monthsCount = Math.ceil(remainingAmount / monthlyInstallment);
    const months = [];
    let currentBalance = remainingAmount;
    let baseDate = new Date(startDateStr);

    for (let i = 1; i <= monthsCount; i++) {
        let required = Math.min(monthlyInstallment, currentBalance);
        
        // حساب تاريخ الاستحقاق لكل شهر مع تثبيت يوم الدفع
        let dueDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, fixedPayDay);
        // التعامل مع الفروق في أطول الأشهر (مثلاً فبراير)
        if (dueDate.getDate() !== fixedPayDay) {
            dueDate.setDate(0); 
        }

        months.push({
            monthNumber: i,
            required: required,
            paid: 0,
            remaining: required,
            status: "Unpaid", // Unpaid | Partial | Paid
            dueDate: dueDate.toISOString().split("T")[0],
            paidDate: null,
            payments: []
        });

        currentBalance -= required;
    }

    return { monthsCount, months };
}

/**
 * إضافة زبون جديد إلى قاعدة البيانات
 */
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

        const payload = {
            customerId: customerId,
            name: customerData.name.trim(),
            phone: customerData.phone.trim(),
            device: customerData.device.trim(),
            imei: customerData.imei.trim(),
            color: customerData.color.trim(),
            notes: customerData.notes ? customerData.notes.trim() : "",
            totalPrice: totalPrice,
            downPayment: downPayment,
            remaining: remaining,
            monthlyInstallment: monthlyInstallment,
            fixedPayDay: fixedPayDay,
            purchaseDate: customerData.purchaseDate,
            status: "Active", // Active | Completed
            createdAt: new Date().toISOString(),
            monthsCount: monthsCount,
            months: months
        };

        await set(newCustomerRef, payload);
        return { success: true, customerId };
    } catch (error) {
        console.error("خطأ أثناء إضافة الزبون:", error);
        return { success: false, message: error.message };
    }
}
