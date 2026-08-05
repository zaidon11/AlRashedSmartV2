// ==========================================
// AlRashed Smart V2
// payments.js
// Version: 2.0.0-beta3
// نظام الدفع اليدوي + التلقائي
// ==========================================



// ==========================================
// 1) الدفع اليدوي
// تختار الشهر وتدفع له
// ==========================================

async function manualPayment(customerId, monthKey, amount){


    const customer = customers[customerId];


    if(!customer) return;



    const month = customer.months[monthKey];


    if(!month){

        alert("الشهر غير موجود");

        return;

    }



    amount = Number(amount);



    if(amount <= 0){

        alert("المبلغ غير صحيح");

        return;

    }



    month.paid += amount;



    month.remaining = Math.max(

        0,

        month.required - month.paid

    );



    month.status =

    month.remaining === 0

    ?

    "paid"

    :

    "partial";



    const payment = {

        amount: amount,

        date: new Date().toISOString(),

        type:"manual"

    };



    month.payments.push(payment);



    month.paidDate = payment.date;



    customer.remaining =

    calculateRemaining(customer);



    await customersRef

    .child(customerId)

    .update({

        months:customer.months,

        remaining:customer.remaining

    });



    alert("تم تسجيل الدفع للشهر المحدد ✅");


}





// ==========================================
// 2) الدفع التلقائي
// يبدأ من أقدم شهر غير مدفوع
// ==========================================


async function automaticPayment(customerId, amount){


    const customer = customers[customerId];


    if(!customer) return;



    let money = Number(amount);



    if(money <= 0){

        alert("المبلغ غير صحيح");

        return;

    }



    const unpaidMonths =

    getUnpaidMonths(customer);



    for(const month of unpaidMonths){



        if(money <= 0)

            break;



        const needed = month.remaining;



        const pay = Math.min(

            needed,

            money

        );



        month.paid += pay;



        month.remaining -= pay;



        month.status =

        month.remaining === 0

        ?

        "paid"

        :

        "partial";



        const payment = {


            amount:pay,


            date:new Date().toISOString(),


            type:"automatic"


        };



        month.payments.push(payment);



        month.paidDate = payment.date;



        money -= pay;


    }



    customer.remaining =

    calculateRemaining(customer);



    await customersRef

    .child(customerId)

    .update({

        months:customer.months,

        remaining:customer.remaining

    });



    alert("تم توزيع الدفعة تلقائياً ✅");


}






// ==========================================
// سجل كل الدفعات للزبون
// ==========================================


function getPaymentsHistory(customer){


    let list=[];



    if(!customer.months)

        return list;



    Object.values(customer.months)

    .forEach(month=>{


        month.payments.forEach(p=>{


            list.push({


                month:month.key,


                monthNumber:month.id,


                amount:p.amount,


                date:p.date,


                type:p.type


            });


        });



    });



    return list;


}
