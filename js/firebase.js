import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get, set, push, update, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBpt495yhuoTbjunCLIFCF_8c1NesxZHWs",
  authDomain: "shopweb-3466b.firebaseapp.com",
  databaseURL: "https://shopweb-3466b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shopweb-3466b",
  storageBucket: "shopweb-3466b.firebasestorage.app",
  messagingSenderId: "41811528812",
  appId: "1:41811528812:web:618f240f8106f218a8dc49",
  measurementId: "G-TQM29P5JMZ"

};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const ROOT_NODE = "installments_v2";

export { db, ref, get, set, push, update, child, ROOT_NODE };