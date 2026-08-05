// js/firebase.js

const firebaseConfig = {

apiKey:"YOUR_API_KEY",

authDomain:"YOUR_PROJECT.firebaseapp.com",

databaseURL:"https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app",

projectId:"YOUR_PROJECT",

storageBucket:"YOUR_PROJECT.appspot.com",

messagingSenderId:"XXXXXXXX",

appId:"XXXXXXXX"

};


firebase.initializeApp(firebaseConfig);


const db = firebase.database();


// قاعدة البيانات الجديدة

const DATABASE="installments_v2";


// المراجع

const customersRef=db.ref(DATABASE+"/customers");

const settingsRef=db.ref(DATABASE+"/settings");
