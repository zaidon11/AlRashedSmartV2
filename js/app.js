// js/migration.js
import { db, ref, get, set, ROOT_NODE } from "./firebase.js";
import { addCustomer } from "./customers.js";

/**
 * نقل بيانات الزبائن من الفرع القديم إلى الفرع الجديد v2
 */
export async function migrateOldData(oldBranchName = "installments") {
    try {
        const oldSnap = await get(ref(db, oldBranchName));
        if (!oldSnap.exists()) throw new Error("لم يتم العثور على قاعدة البيانات القديمة");

        const oldData = oldSnap.val();
        let migratedCount = 0;

        for (let key in oldData) {
            const oldCust = oldData[key];
            
            // تحويل وتمرير البيانات للفرع الجديد مع الحساب التلقائي
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

/**
 * تصدير JSON
 */
export async function exportDataJSON() {
    const snap = await get(ref(db, ROOT_NODE));
    if (!snap.exists()) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snap.val()));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `backup_v2_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}
