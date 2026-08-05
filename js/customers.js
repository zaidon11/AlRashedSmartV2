// ==========================================
// AlRashed Smart V2
// customers.js
// Version: 2.0.0-beta1
// ==========================================

let customers = {};

function loadCustomers() {

    customersRef.on("value", snapshot => {

        customers = snapshot.val() || {};

        renderCustomers();

        updateDashboard();

    });

}

async function addCustomer(data) {

    try {

        const ref = customersRef.push();

        const id = ref.key;

        const remaining =
            data.totalPrice - data.downPayment;

        const monthsCount = Math.ceil(
            remaining / data.monthlyInstallment
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

        alert("تم إضافة الزبون");

    }

    catch(e){

        console.error(e);

        alert("حدث خطأ");

    }

}

function renderCustomers(){

    const container = document.getElementById("customersList");

    container.innerHTML = "";

    Object.values(customers).forEach(c=>{

        container.innerHTML += `

        <div

            class="customerCard"

            data-name="${c.name.toLowerCase()}"

        >

            <div class="customerName">

                ${c.name}

            </div>

            <div class="customerModel">

                ${c.model}

            </div>

            <div class="customerRemaining">

                المتبقي :

                ${Number(c.remaining).toLocaleString()}

                د.ع

            </div>

        </div>

        `;

    });

}

function updateDashboard(){

    let totalRemaining = 0;

    Object.values(customers).forEach(c=>{

        totalRemaining += Number(c.remaining);

    });

    document.getElementById("customersCount").innerText =
        Object.keys(customers).length;

    document.getElementById("remainingMoney").innerText =
        totalRemaining.toLocaleString();

    document.getElementById("lateCustomers").innerText = 0;

    document.getElementById("todayInstallments").innerText = 0;

}
