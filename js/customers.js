// ==========================================
// AlRashed Smart V2
// customers.js
// Version: 2.0.0-beta1
// ==========================================


let customers = {};



// تحميل الزبائن

function loadCustomers(){


    customersRef.on("value", snapshot=>{


        customers = snapshot.val() || {};


        renderCustomers();


        updateDashboard();


    });


}



// إضافة زبون

async function addCustomer(data){


    try{


        const ref = customersRef.push();


        const id = ref.key;



        const remaining =

        data.totalPrice - data.downPayment;



        const monthsCount = Math.ceil(

            remaining /

            data.monthlyInstallment

        );



        const months = generateMonths(

            data.purchaseDate,

            monthsCount,

            data.monthlyInstallment,

            data.fixedDay

        );



        await ref.set({


            id:id,


            name:data.name,


            phone:data.phone,


            model:data.model,


            totalPrice:data.totalPrice,


            downPayment:data.downPayment,


            remaining:remaining,


            monthlyInstallment:data.monthlyInstallment,


            fixedDay:data.fixedDay,


            purchaseDate:data.purchaseDate,


            status:"active",


            createdAt:Date.now(),


            months:months,


            payments:{}


        });



        alert("✅ تم إضافة الزبون");



    }

    catch(error){


        console.error(error);


        alert("حدث خطأ بالحفظ");


    }


}




// عرض الزبائن

function renderCustomers(){


    const box =

    document.getElementById("customersList");



    if(!box) return;



    box.innerHTML="";



    Object.values(customers)

    .forEach(c=>{


        box.innerHTML += `


        <div

        class="customerCard"

        data-name="${c.name.toLowerCase()}"

        onclick="openCustomer('${c.id}')">


            <div class="customerName">

                ${c.name}

            </div>


            <div class="customerModel">

                ${c.model || ""}

            </div>


            <div class="customerRemaining">

                المتبقي:

                ${Number(c.remaining).toLocaleString()}

                د.ع

            </div>


        </div>


        `;


    });


}
