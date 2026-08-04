// ==========================================
// AlRashed Smart V2
// Firebase Connection
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyBpt495yhuoTbjunCLIFCF_8c1NesxZHWs",
    authDomain: "shopweb-3466b.firebaseapp.com",
    databaseURL: "https://shopweb-3466b-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "shopweb-3466b",
    storageBucket: "shopweb-3466b.firebasestorage.app",
    messagingSenderId: "41811528812",
    appId: "1:41811528812:web:618f240f8106f218a8dc49"
};

// تشغيل Firebase
firebase.initializeApp(firebaseConfig);

// الاتصال بقاعدة البيانات
const db = firebase.database();

// قاعدة البيانات الجديدة
const DATABASE = "installments_v2";

console.log("✅ AlRashed Smart V2 Connected");
