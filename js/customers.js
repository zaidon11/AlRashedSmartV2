// ==========================================
// AlRashed Smart V2
// Customers Manager
// Version: 2.0.0-beta1
// ==========================================

// إضافة زبون جديد
async function addCustomer(customerData) {

    try {

        // إنشاء رقم تلقائي للزبون
        const customerRef = db.ref(`${DATABASE}/customers`).push();

        const customerId = customerRef.key;

        // حساب المتبقي
        const remaining =
            customerData.totalPrice - customerData.downPayment;

        // حساب عدد الأشهر
        const monthsCount = Math.ceil(
            remaining / customerData.monthlyInstallment
        );

        // إنشاء الأشهر
        const months = generateMonths(
            customerData.purchaseDate,
            monthsCount,
            customerData.monthlyInstallment
        );

        // بيانات الزبون
        const customer = {

            id: customerId,

            name: customerData.name,

            phone: customerData.phone,

            model: customerData.model,

            totalPrice: customerData.totalPrice,

            downPayment: customerData.downPayment,

            remaining: remaining,

            monthlyInstallment:
                customerData.monthlyInstallment,

            fixedDay:
                customerData.fixedDay,

            purchaseDate:
                customerData.purchaseDate,

            status: "active",

            createdAt: Date.now(),

            months: months,

            payments: {}

        };

        await customerRef.set(customer);

        alert("✅ تم إضافة الزبون");

        return customerId;

    } catch (e) {

        console.error(e);

        alert("حدث خطأ أثناء الحفظ");

    }

}


// إنشاء جدول الأشهر
function generateMonths(startDate, count, installment) {

    const months = {};

    const date = new Date(startDate);

    for (let i = 0; i < count; i++) {

        const year = date.getFullYear();

        const month =
            String(date.getMonth() + 1).padStart(2, "0");

        const key = `${year}-${month}`;

        months[key] = {

            month: key,

            required: installment,

            paid: 0,

            remaining: installment,

            status: "unpaid",

            payments: []

        };

        date.setMonth(date.getMonth() + 1);

    }

    return months;

}
