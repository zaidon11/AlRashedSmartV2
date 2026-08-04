// ==========================================
// AlRashed Smart V2
// Main App File
// ==========================================

console.log("🚀 AlRashed Smart V2 Started");

document.addEventListener("DOMContentLoaded", () => {

    console.log("📄 Page Loaded");

    // فحص الاتصال مع Firebase
    testConnection();

});


// ==========================================
// فحص الاتصال
// ==========================================
function testConnection() {

    db.ref(DATABASE).once("value")
        .then((snapshot) => {

            console.log("✅ Database Connected");

            // إذا النسخة الجديدة غير موجودة
            if (!snapshot.exists()) {

                console.log("📦 إنشاء قاعدة البيانات الجديدة...");

                db.ref(DATABASE).set({
                    version: "2.0.0-beta1",
                    createdAt: Date.now()
                });

            }

            showSystemMessage("✅ تم الاتصال بقاعدة البيانات");

        })
        .catch((error) => {

            console.error("❌ Firebase Error:", error);

            showSystemMessage("❌ خطأ بالاتصال");

        });

}


// ==========================================
// رسائل بسيطة للمستخدم
// ==========================================
function showSystemMessage(msg) {

    const box = document.getElementById("customersList");

    if (box) {
        box.innerHTML = `
            <div class="customer-card">
                ${msg}
            </div>
        `;
    }

}
