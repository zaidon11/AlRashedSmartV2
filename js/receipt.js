// ==========================================
// AlRashed Smart V2
// receipt.js
// Version: 2.0.0-beta1
// ==========================================

function createReceipt(customer, month, payment){

    const receiptData = {

        receiptNumber:
            Date.now(),

        customerName:
            customer.name,

        phone:
            customer.phone,

        device:
            customer.model,

        month:
            month.key,

        monthNumber:
            month.id,

        amount:
            payment.amount,

        paymentDate:
            payment.date,

        remaining:
            customer.remaining

    };


    return receiptData;

}


function printReceipt(data){

    const win = window.open(
        "",
        "_blank"
    );


    win.document.write(`

    <html dir="rtl">

    <head>

    <title>وصل تسديد</title>

    <style>

    body{

        font-family:Arial;

        text-align:center;

        width:280px;

        margin:auto;

    }

    .line{

        border-top:1px dashed #000;

        margin:10px 0;

    }

    </style>

    </head>


    <body>


    <h2>

    مركز الراشد

    </h2>


    <h3>

    وصل تسديد قسط

    </h3>


    <div class="line"></div>


    <p>

    الزبون:

    ${data.customerName}

    </p>


    <p>

    الجهاز:

    ${data.device}

    </p>


    <p>

    الشهر:

    ${data.monthNumber}

    (${data.month})

    </p>


    <p>

    المبلغ:

    ${Number(data.amount).toLocaleString()}

    د.ع

    </p>


    <p>

    التاريخ:

    ${data.paymentDate}

    </p>


    <div class="line"></div>


    <b>

    المتبقي:

    ${Number(data.remaining).toLocaleString()}

    د.ع

    </b>


    <script>

    window.onload=function(){

        window.print();

    }

    <\/script>


    </body>

    </html>

    `);


    win.document.close();

}
