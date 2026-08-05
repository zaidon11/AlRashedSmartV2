// ==========================================
// AlRashed Smart V2
// Firebase Config
// Version: 2.0.0-beta1
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyBpt495yhuoTbjunCLIFCF_8c1NesxZHWs",

    authDomain: "shopweb-3466b.firebaseapp.com",

    databaseURL: "https://shopweb-3466b-default-rtdb.asia-southeast1.firebasedatabase.app",

    projectId: "shopweb-3466b",

    storageBucket: "shopweb-3466b.appspot.com",

    messagingSenderId: "41811528812",

    appId: "1:41811528812:web:618f240f8106f218a8dc49"

};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

// قاعدة البيانات الجديدة

const DATABASE = "installments_v2"; // النسخة الجديدة

const customersRef = db.ref(`${DATABASE}/customers`);

const settingsRef = db.ref(`${DATABASE}/settings`);
