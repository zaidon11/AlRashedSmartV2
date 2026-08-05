// ==========================================
// AlRashed Smart V2
// customer_view.js
// Version: 2.0.0-beta1
// ==========================================

function openCustomer(id){

    const customer = customers[id];

    if(!customer) return;


    let html = `

    <div class="customerCard">

        <h2>${customer.name}</h2>

        <p>📱 الجهاز: ${customer.model}</p>

        <p>💰 المتبقي:

        ${Number(customer.remaining).toLocaleString()} د.ع

        </p>


        <hr>


        <h3>الأشهر:</h3>

    `;


    Object.values(customer.months).forEach(month=>{


        let status = "";

        if(month.status==="paid"){

            status="✅ مدفوع";

        }

        else if(month.status==="partial"){

            status="🟡 مدفوع جزئياً";

        }

        else{

            status="❌ غير مدفوع";

        }


        html += `

        <div class="monthBox">

            <b>

            الشهر ${month.id}

            (${month.year}-${month.month})

            </b>

            <br>

            📅 الاستحقاق:

            ${month.dueDate}

            <br>

            💵 المطلوب:

            ${month.required.toLocaleString()}

            <br>

            💵 المدفوع:

            ${month.paid.toLocaleString()}

            <br>

            ${status}


            <br>


            <button onclick="payMonthPrompt('${id}','${month.key}')">

            تسجيل دفعة لهذا الشهر

            </button>


        </div>


        `;


    });


    html += `</div>`;


    document.getElementById("customersList").innerHTML=html;

}


function payMonthPrompt(customerId,monthKey){


    const amount = prompt(

        "أدخل مبلغ الدفعة"

    );


    if(amount){

        payMonth(

            customerId,

            monthKey,

            Number(amount)

        );

    }

}
