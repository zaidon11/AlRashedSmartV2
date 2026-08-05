import { db, ref, get, set, ROOT_NODE } from "./firebase.js";
import { addCustomer } from "./customers.js";

export async function migrateOldData(oldBranchName = "installments") {
    try {
        const oldSnap = await get(ref(db, oldBranchName));
        if (!oldSnap.exists()) throw new Error("لم يتم العثور على قاعدة البيانات القديمة");

        const oldData = oldSnap.val();
        let migratedCount = 0;

        for (let key in oldData) {
            const oldCust = oldData[key];
            await addCustomer({
                name: oldCust.name || "زبون قديم",
                phone: oldCust.phone || "000",
                device: oldCust.device || "غير محدد",
                imei: oldCust.imei || "000",
                color: oldCust.color || "افتراضي",
                totalPrice: oldCust.totalPrice || 0,
                downPayment: oldCust.downPayment || 0,
                monthlyInstallment: oldCust.monthlyInstallment || 50000,
                fixedPayDay: oldCust.fixedPayDay || 1,
                purchaseDate: oldCust.purchaseDate || new Date().toISOString().split('T')[0],
                notes: "تم نقله من النظام القديم"
            });
            migratedCount++;
        }

        return { success: true, count: migratedCount };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

export async function exportDataJSON() {
    const snap = await get(ref(db, ROOT_NODE));
    if (!snap.exists()) return alert("لا توجد بيانات للتصدير");
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snap.val()));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup_v2_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

export async function importDataJSON(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const data = JSON.parse(e.target.result);
            await set(ref(db, ROOT_NODE), data);
            alert("تم استيراد النسخة الاحتياطية بنجاح!");
            window.location.reload();
        } catch (err) {
            alert("ملف غير صالح: " + err.message);
        }
    };
    reader.readAsText(file);
}