import { db, ref, get, ROOT_NODE } from "./firebase.js";
import { addCustomer } from "./customers.js";
import { migrateOldData, exportDataJSON, importDataJSON } from "./migration.js";

// مظهر الليل والنهار
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
    });
}

// [ملاحظة: تم حذف حقل تعيين التاريخ اليدوي القديم نهائياً من هنا]

export async function loadDashboard() {
    const snap = await get(ref(db, `${ROOT_NODE}/customers`));
    const listContainer = document.getElementById('customersList');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';

    if (!snap.exists()) {
        listContainer.innerHTML = '<p style="text-align:center; padding: 20px;">لا يوجد زبائن حالياً.</p>';
        return;
    }

    const customers = snap.val();
    let totalCust = 0;
    let totalRem = 0;
    let totalColl = 0;
    let overdueCount = 0;

    const searchKeyword = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
    const todayStr = new Date().toISOString().split('T')[0];

    Object.values(customers).forEach(c => {
        totalCust++;
        totalRem += Number(c.remaining || 0);
        totalColl += Number((c.totalPrice || 0) - (c.remaining || 0));

        let isOverdue = false;
        if (c.months) {
            c.months.forEach(m => {
                if (m.status !== 'Paid' && m.dueDate < todayStr) {
                    isOverdue = true;
                }
            });
        }
        if (isOverdue) overdueCount++;

        // تحديث الفلترة المعتمدة لتعتمد على الاسم ورقم الهاتف فقط
        const matchesName = (c.name || '').toLowerCase().includes(searchKeyword);
        const matchesPhone = (c.phone || '').includes(searchKeyword);

        if (matchesName || matchesPhone) {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                window.location.href = `customer.html?id=${c.customerId}`;
            });
            
            // تم الحفاظ على هيكلية الكارد وعرض اللون والبيانات القديمة بأمان إن وجدت
            const deviceColorInfo = c.color ? ` (${c.color})` : '';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>${c.name}</strong>
                    <span style="color: var(--accent-color); font-weight:600;">${c.phone}</span>
                </div>
                <div style="margin-top:6px; color: var(--text-secondary); font-size:0.88rem;">
                    الجهاز: ${c.device}${deviceColorInfo} | المتبقي: <strong style="color: var(--status-unpaid);">${Number(c.remaining).toLocaleString()} د.ع</strong>
                </div>
            `;
            listContainer.appendChild(card);
        }
    });

    if (document.getElementById('statTotalCustomers')) document.getElementById('statTotalCustomers').innerText = totalCust;
    if (document.getElementById('statTotalRemaining')) document.getElementById('statTotalRemaining').innerText = totalRem.toLocaleString() + ' د.ع';
    if (document.getElementById('statTotalCollected')) document.getElementById('statTotalCollected').innerText = totalColl.toLocaleString() + ' د.ع';
    if (document.getElementById('statOverdueCount')) document.getElementById('statOverdueCount').innerText = overdueCount;
}

// أحداث النماذج والأزرار
const addForm = document.getElementById('addCustomerForm');
if (addForm) {
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // دالة مساعدة داخلية لتنظيف فواصل الآلاف من الحقول النصية وتحويلها لأرقام نقية
        const parseCurrencyValue = (id) => {
            const el = document.getElementById(id);
            if (!el) return 0;
            return parseFloat(el.value.replace(/,/g, '')) || 0;
        };

        // توليد تاريخ اليوم والساعة بالاعتماد على الجهاز والإنترنت أوتوماتيكياً
        const autoPurchaseDate = new Date().toISOString().split('T')[0];

        // بناء كائن الداتا النظيف والمطابق للـ HTML الجديد بدون حقول زائدة وبأرقام صحيحة
        const data = {
            name: document.getElementById('custName').value.trim(),
            phone: document.getElementById('custPhone').value.trim(),
            device: document.getElementById('custDevice').value.trim(),
            totalPrice: parseCurrencyValue('custTotalPrice'),
            downPayment: parseCurrencyValue('custDownPayment'),
            monthlyInstallment: parseCurrencyValue('custMonthly'),
            fixedPayDay: parseInt(document.getElementById('custPayDay').value),
            purchaseDate: autoPurchaseDate,
            notes: document.getElementById('custNotes').value.trim(),
        };

        const res = await addCustomer(data);
        if (res.success) {
            alert('تمت إضافة الزبون بنجاح!');
            addForm.reset();
            loadDashboard();
        } else {
            alert(res.message);
        }
    });
}

const searchInput = document.getElementById('searchInput');
if (searchInput) searchInput.addEventListener('input', loadDashboard);

const exportBtn = document.getElementById('exportBtn');
if (exportBtn) exportBtn.addEventListener('click', exportDataJSON);

const importBtn = document.getElementById('importBtn');
const importFileInput = document.getElementById('importFileInput');
if (importBtn && importFileInput) {
    importBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            importDataJSON(e.target.files[0]);
        }
    });
}

const migrateBtn = document.getElementById('migrateBtn');
if (migrateBtn) {
    migrateBtn.addEventListener('click', async () => {
        if (confirm("هل أنت تأكد من نقل البيانات من الفرع القديم؟ لن يتم حذف البيانات القديمة.")) {
            const res = await migrateOldData();
            if (res.success) {
                alert(`تم نقل ${res.count} زبون بنجاح.`);
                loadDashboard();
            } else {
                alert(res.message);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', loadDashboard);
