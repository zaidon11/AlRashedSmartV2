// ==========================================
// AlRashed Smart V2
// customer_view.js
// Version: 2.0.0-beta2
// ==========================================


function openCustomer(id){


    const customer = customers[id];


    if(!customer) return;



    const box = document.getElementById("customersList");


    let html = `


    <div class="customerPage">


        <h2>${customer.name}</h2>


        <p>📱 الجهاز: ${customer.model}</p>


        <p>

        💰 المتبقي:

        ${Number(customer.remaining).toLocaleString()}

        د.ع

        </p>



        <hr>



        <h3>جدول الأقساط</h3>



    `;



    Object.values(customer.months)

    .forEach(month=>{


        let status="❌ غير مدفوع";


        if(month.status==="paid"){

            status="✅ مدفوع";

        }

        else if(month.status==="partial"){

            status="🟡 ناقص";

        }



        html += `


        <div class="monthCard">


            <h4>

            الشهر ${month.id}

            (${month.year}-${String(month.monthNumber).padStart(2,"0")})

            </h4>



            <p>

            📅 تاريخ الاستحقاق:

            ${month.dueDate}

            </p>



            <p>

            💵 المطلوب:

            ${month.required.toLocaleString()}

            </p>



            <p>

            💵 المدفوع:

            ${month.paid.toLocaleString()}

            </p>



            <p>

            الحالة:

            ${status}

            </p>



            ${
            month.paidDate

            ?

            `<small>

            آخر دفع:

            ${new Date(month.paidDate).toLocaleDateString("ar-IQ")}

            </small>`

            :

            ""

            }



            <br><br>



            <button onclick="manualPayBox('${id}','${month.key}')">

            دفع هذا الشهر

            </button>



        </div>



        `;


    });



    html += `



    <hr>


    <h3>دفع تلقائي</h3>


    <button onclick="automaticPayBox('${id}')">

    💰 توزيع دفعة تلقائياً

    </button>



    </div>


    `;



    box.innerHTML = html;


}




// دفع شهر محدد

function manualPayBox(customerId, monthKey){


    const amount = prompt(

        "اكتب مبلغ الدفع لهذا الشهر"

    );



    if(amount){

        manualPayment(

            customerId,

            monthKey,

            Number(amount)

        );

    }

}





// دفع تلقائي

function automaticPayBox(customerId){


    const amount = prompt(

        "اكتب مبلغ الدفعة"

    );



    if(amount){

        automaticPayment(

            customerId,

            Number(amount)

        );

    }

}
