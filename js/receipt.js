// js/receipt.js
import { db, ref, get, ROOT_NODE } from "./firebase.js";

const urlParams = new URLSearchParams(window.location.search);
const customerId = urlParams.get('id');
const recNumber = urlParams.get('rec');

async function renderReceipt() {
    if (!customerId || !recNumber) return;

    const snap = await get(ref(db, `${ROOT_NODE}/customers/${customerId}`));
    if (!snap.exists()) return;

    const c = snap.val();
    
    // البحث عن الدفعة في الأقساط
    let targetPayment = null;
    c.months.forEach(m => {
        if (m.payments) {
            const found = m.payments.find(p => p.receiptNumber === recNumber);
            if (found) targetPayment = found;
        }
    });

    if (!targetPayment) return;

    document.getElementById('rNum').innerText = targetPayment.receiptNumber;
    document.getElementById('rName').innerText = c.name;
    document.getElementById('rDevice').innerText = c.device;
    document.getElementById('rAmount').innerText = targetPayment.amount.toLocaleString() + ' د.ع';
    document.getElementById('rType').innerText = targetPayment.type === 'Auto' ? 'تلقائي' : 'يدوي';
    document.getElementById('rDate').innerText = new Date(targetPayment.date).toLocaleDateString('ar-IQ');

    // إنشاء QR Code
    new QRious({
        element: document.getElementById('qrcode'),
        value: `REC:${recNumber}|CUST:${c.name}|AMT:${targetPayment.amount}`,
        size: 120
    });
}

renderReceipt();
