// ==========================================
// AlRashed Smart V2
// customer_view.js
// Version: 2.0.0-beta3
// ==========================================


function openCustomer(id){


    const customer = customers[id];


    if(!customer){

        alert("الزبون غير موجود");

        return;

    }



    const box = document.getElementById("customersList");



    let html = `


    <div class="customerPage">


        <h2>${customer.name}</h2>


        <p>📱 الجهاز: ${customer.model || ""}</p>


        <p>

        💰 المتبقي:

        ${Number(customer.remaining || 0).toLocaleString()}

        د.ع

        </p>



        <hr>


        <h3>جدول الأقساط</h3>


    `;



    Object.values(customer.months || {}).forEach(month=>{


        let status = "❌ غير مدفوع";


        if(month.status === "paid"){

            status = "✅ مدفوع";

        }


        if(month.status === "partial"){

            status = "🟡 ناقص";

        }



        html += `


        <div class="monthCard">


        <h4>

        الشهر ${month.id}

        </h4>


        <p>

        📅 الاستحقاق:

        ${month.dueDate}

        </p>


        <p>

        💵 المطلوب:

        ${Number(month.required).toLocaleString()}

        </p>


        <p>

        💵 المدفوع:

        ${Number(month.paid).toLocaleString()}

        </p>


        <p>

        الحالة:

        ${status}

        </p>


        <button onclick="manualPayBox('${id}','${month.key}')">

        دفع هذا الشهر

        </button>


        </div>


        `;


    });



    html += `


    <hr>


    <button onclick="automaticPayBox('${id}')">

    💰 دفع تلقائي

    </button>


    </div>


    `;



    box.innerHTML = html;


}







async function manualPayBox(customerId, monthKey){


    const amount = prompt("اكتب مبلغ الدفع");


    if(!amount) return;



    try{


        await manualPayment(

            customerId,

            monthKey,

            Number(amount)

        );


        openCustomer(customerId);


    }

    catch(e){


        console.error(e);

        alert("حدث خطأ بالدفع اليدوي");


    }


}







async function automaticPayBox(customerId){


    const amount = prompt("اكتب مبلغ الدفعة");


    if(!amount) return;



    try{


        await automaticPayment(

            customerId,

            Number(amount)

        );


        openCustomer(customerId);


    }

    catch(e){


        console.error(e);

        alert("حدث خطأ بالدفع التلقائي");


    }


}
