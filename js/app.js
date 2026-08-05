// ==========================================
// AlRashed Smart V2
// app.js
// Version: 2.0.0-beta1
// ==========================================


function initApp(){

    hideLoading();

    loadCustomers();

    bindEvents();

}


// ربط الأزرار

function bindEvents(){


    const saveBtn =
    document.getElementById("saveCustomerBtn");


    if(saveBtn){

        saveBtn.onclick = saveCustomer;

    }



    const search =
    document.getElementById("searchInput");


    if(search){

        search.oninput = searchCustomers;

    }


}


// إخفاء التحميل

function hideLoading(){


    const loading =
    document.getElementById("loadingScreen");


    if(loading){

        setTimeout(()=>{

            loading.style.display="none";

        },700);

    }


}


// حفظ زبون

function saveCustomer(){


    const data = {


        name:

        document.getElementById("customerName").value.trim(),


        phone:

        document.getElementById("customerPhone").value.trim(),


        model:

        document.getElementById("customerModel").value.trim(),


        totalPrice:

        Number(document.getElementById("customerPrice").value),


        downPayment:

        Number(document.getElementById("customerDownPayment").value),


        monthlyInstallment:

        Number(document.getElementById("customerMonthly").value),


        fixedDay:

        Number(document.getElementById("customerFixedDay").value),


        purchaseDate:

        new Date().toISOString()


    };



    if(!data.name){

        alert("اكتب اسم الزبون");

        return;

    }



    addCustomer(data);



    document.getElementById("customerModal").style.display="none";


}



// البحث

function searchCustomers(){


    const value =

    document

    .getElementById("searchInput")

    .value

    .toLowerCase();



    document

    .querySelectorAll(".customerCard")

    .forEach(card=>{


        const name =

        card.dataset.name;



        card.style.display =

        name.includes(value)

        ?

        "block"

        :

        "none";


    });


}



// الإحصائيات

function updateDashboard(){


    let count = 0;

    let money = 0;

    let late = 0;



    Object.values(customers)

    .forEach(c=>{


        count++;


        money +=

        Number(c.remaining || 0);



        if(c.months){


            Object.values(c.months)

            .forEach(m=>{


                if(

                    m.status !== "paid"

                    &&

                    new Date(m.dueDate)

                    < new Date()

                ){

                    late++;

                }


            });


        }


    });



    document.getElementById("customersCount").innerText=count;


    document.getElementById("remainingMoney").innerText=

    money.toLocaleString();


    document.getElementById("lateCustomers").innerText=late;


}
