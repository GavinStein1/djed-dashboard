import { initializeApp } from 'firebase/app';
import { getDatabase, ref, child, get } from 'firebase/database';

export default async function handler(req, res) {
    // Initialize Firebase with your configuration
    const firebaseConfig = {
        apiKey: "AIzaSyD1_Xw16x0cnfOrsIVqTGN28XrWL36NQrw",
        authDomain: "djed-dash.firebaseapp.com",
        databaseURL: "https://djed-dash-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "djed-dash",
        storageBucket: "djed-dash.appspot.com",
        messagingSenderId: "615210867502",
        appId: "1:615210867502:web:7394775690df5900a178bf"
      };
    
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();
    const reference = ref(db);
    var data_snapshot = await get(child(reference, "/raw_data"));
    res.status(200).json(data_snapshot.val());
}