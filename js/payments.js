// ==========================================
// AlRashed Smart V2
// payments.js
// Version: 2.0.0-beta4
// ==========================================



async function manualPayment(customerId, monthKey, amount){


    const customer = customers[customerId];


    if(!customer){

        alert("الزبون غير موجود");

        return;

    }



    const month = customer.months[monthKey];


    if(!month){

        alert("القسط غير موجود");

        return;

    }



    amount = Number(amount);



    if(amount <= 0){

        alert("المبلغ غير صحيح");

        return;

    }



    if(!month.payments){

        month.payments = [];

    }



    month.paid = Number(month.paid || 0) + amount;



    month.remaining = Math.max(

        0,

        Number(month.required) - Number(month.paid)

    );



    month.status =

    month.remaining === 0

    ? "paid"

    : "partial";



    const payment = {

        amount: amount,

        date: new Date().toISOString(),

        type:"manual"

    };



    month.payments.push(payment);



    month.paidDate = payment.date;



    customer.remaining = calculateCustomerRemaining(customer);



    await customersRef.child(customerId).update({

        months: customer.months,

        remaining: customer.remaining

    });



    alert("تم تسجيل الدفع ✅");



}





async function automaticPayment(customerId, amount){


    const customer = customers[customerId];


    if(!customer){

        alert("الزبون غير موجود");

        return;

    }



    let money = Number(amount);



    if(money <= 0){

        alert("المبلغ غير صحيح");

        return;

    }



    const months = Object.values(customer.months)

    .sort((a,b)=>a.id-b.id);



    for(const month of months){



        if(money <= 0)

            break;



        if(month.remaining <= 0)

            continue;



        const pay = Math.min(

            money,

            month.remaining

        );



        if(!month.payments){

            month.payments=[];

        }



        month.paid += pay;


        month.remaining -= pay;



        month.status =

        month.remaining === 0

        ? "paid"

        : "partial";



        month.paidDate =

        new Date().toISOString();



        month.payments.push({

            amount:pay,

            date:month.paidDate,

            type:"automatic"

        });



        money -= pay;



    }



    customer.remaining = calculateCustomerRemaining(customer);



    await customersRef.child(customerId).update({

        months:customer.months,

        remaining:customer.remaining

    });



    alert("تم توزيع الدفعة تلقائياً ✅");


}





function calculateCustomerRemaining(customer){


    let total = 0;



    Object.values(customer.months || {})

    .forEach(month=>{


        total += Number(month.remaining || 0);


    });



    return total;


}
