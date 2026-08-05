import { db, ref, get, set, ROOT_NODE } from "./firebase.js";

export async function fetchAllCustomers() {
    try {
        const snap = await get(ref(db, `${ROOT_NODE}/customers`));
        if (snap.exists()) {
            return snap.val();
        }
        return {};
    } catch (error) {
        console.error("خطأ جلب البيانات:", error);
        return {};
    }
}