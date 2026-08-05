 // ==========================================
// AlRashed Smart V2
// migration.js
// Version: 2.0.0-beta1
// نقل الزبائن من النظام القديم إلى V2
// ==========================================


async function migrateOldCustomers(){


    const oldRef = db.ref("installments");


    const snap = await oldRef.once("value");


    const oldCustomers = snap.val();


    if(!oldCustomers){

        alert("لا توجد بيانات قديمة");

        return;

    }


    for(const id in oldCustomers){


        const old = oldCustomers[id];


        const newCustomer = {


            id:id,


            name:old.name || "",


            phone:old.phone || "",


            model:old.model || "",


            totalPrice:Number(old.total) || 0,


            downPayment:0,


            remaining:0,


            monthlyInstallment:0,


            fixedDay:old.fixedDay || 1,


            purchaseDate:

                new Date().toISOString(),


            status:"active",


            createdAt:Date.now(),


            months:{},


            payments:{}


        };


        let paid = 0;


        if(old.payments){


            Object.values(old.payments)

            .forEach(p=>{


                paid += Number(p.amount);


            });


        }


        newCustomer.remaining =

            Math.max(

                0,

                newCustomer.totalPrice - paid

            );



        await customersRef

        .child(id)

        .set(newCustomer);



    }


    alert("تم نقل البيانات إلى V2");


}
