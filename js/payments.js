// ==========================================
// AlRashed Smart V2
// payments.js
// Version: 2.0.0-beta1
// ==========================================

async function payMonth(

    customerId,

    monthKey,

    amount

){

    if(amount<=0) return;

    const customer=customers[customerId];

    if(!customer) return;

    const month=customer.months[monthKey];

    if(!month) return;

    const value=Number(amount);

    month.paid+=value;

    month.remaining=Math.max(

        0,

        month.required-month.paid

    );

    month.status=

        month.remaining===0

        ? "paid"

        : "partial";

    month.paidDate=new Date().toISOString();

    month.payments.push({

        amount:value,

        date:new Date().toISOString()

    });

    customer.remaining=

        calculateRemaining(customer);

    await customersRef

        .child(customerId)

        .update({

            months:customer.months,

            remaining:customer.remaining

        });

}

async function autoDistributePayment(

    customerId,

    amount

){

    let balance=Number(amount);

    const customer=customers[customerId];

    if(!customer) return;

    const months=getUnpaidMonths(customer);

    for(const month of months){

        if(balance<=0) break;

        const need=month.remaining;

        const pay=Math.min(

            need,

            balance

        );

        month.paid+=pay;

        month.remaining-=pay;

        month.status=

            month.remaining===0

            ? "paid"
            : "partial";

        month.paidDate=

            new Date().toISOString();

        month.payments.push({

            amount:pay,

            date:new Date().toISOString()

        });

        balance-=pay;

    }

    customer.remaining=

        calculateRemaining(customer);

    await customersRef

        .child(customerId)

        .update({

            months:customer.months,

            remaining:customer.remaining

        });

}
