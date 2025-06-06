import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from "../utils/config";
/*import { Product } from "@/types/product";

export default async function readProducts(): Promise<Product[]> {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const querySnapshot = await getDocs(collection(db, "productos"));
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
    });
    
    return products;
}*/

