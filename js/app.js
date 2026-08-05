// ==========================================
// AlRashed Smart V2
// app.js
// Version: 2.0.0-beta1
// ==========================================

function initApp() {

    hideLoading();

    loadCustomers();

    bindEvents();

}

function bindEvents() {

    document
        .getElementById("saveCustomerBtn")
        .addEventListener("click", saveCustomer);

    document
        .getElementById("searchInput")
        .addEventListener("input", searchCustomers);

}

function hideLoading() {

    setTimeout(() => {

        document
            .getElementById("loadingScreen")
            .style.display = "none";

    }, 700);

}

function saveCustomer() {

    const customer = {

        name: document.getElementById("customerName").value.trim(),

        phone: document.getElementById("customerPhone").value.trim(),

        model: document.getElementById("customerModel").value.trim(),

        totalPrice: Number(document.getElementById("customerPrice").value),

        downPayment: Number(document.getElementById("customerDownPayment").value),

        monthlyInstallment: Number(document.getElementById("customerMonthly").value),

        fixedDay: Number(document.getElementById("customerFixedDay").value),

        purchaseDate: new Date().toISOString()

    };

    if (!customer.name) {

        alert("اكتب اسم الزبون");

        return;

    }

    addCustomer(customer);

    document.getElementById("customerModal").style.display = "none";

}

function searchCustomers() {

    const value = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    document.querySelectorAll(".customerCard").forEach(card => {

        const name = card.dataset.name;

        card.style.display =
            name.includes(value)
                ? "block"
                : "none";

    });

}
