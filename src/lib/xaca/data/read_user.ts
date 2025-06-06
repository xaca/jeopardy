import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { firebaseConfig } from "../utils/config";

export default async function readUser(uid: string) {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const docRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
}




