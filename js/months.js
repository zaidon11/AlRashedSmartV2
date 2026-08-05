// ==========================================
// AlRashed Smart V2
// months.js
// Version: 2.0.0-beta1
// ==========================================

function generateMonths(

    purchaseDate,

    count,

    installment,

    fixedDay

){

    const months = {};

    const date = new Date(purchaseDate);

    for(let i=0;i<count;i++){

        const year = date.getFullYear();

        const month = date.getMonth()+1;

        const monthKey =
            `${year}-${String(month).padStart(2,"0")}`;

        const dueDate =
            `${year}-${String(month).padStart(2,"0")}-${String(fixedDay).padStart(2,"0")}`;

        months[monthKey]={

            id:i+1,

            key:monthKey,

            year:year,

            month:month,

            dueDay:fixedDay,

            dueDate:dueDate,

            required:installment,

            paid:0,

            remaining:installment,

            status:"unpaid",

            paidDate:null,

            payments:[]

        };

        date.setMonth(date.getMonth()+1);

    }

    return months;

}

function getMonth(customer,key){

    if(!customer.months) return null;

    return customer.months[key] || null;

}

function getUnpaidMonths(customer){

    if(!customer.months) return [];

    return Object.values(customer.months)

        .filter(m=>m.remaining>0)

        .sort((a,b)=>a.id-b.id);

}

function calculateRemaining(customer){

    let remaining=0;

    if(!customer.months) return 0;

    Object.values(customer.months).forEach(m=>{

        remaining+=Number(m.remaining);

    });

    return remaining;

}
