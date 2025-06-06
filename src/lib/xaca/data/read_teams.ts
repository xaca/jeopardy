import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, collectionGroup } from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { firebaseConfig } from "@/lib/xaca/utils/config";
import type { Team } from "@/types/Team";

export async function readPartidasId(): Promise<string[]> {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const partidasSnapshot = await getDocs(collection(db, "partidas"));
    return partidasSnapshot.docs.map((doc) => doc.id);
}

export async function readTeams(partidaId: string): Promise<Team[]> {
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        // Get all partidas
        const partidasSnapshot = await getDocs(collection(db, "partidas"));
        const teams: Team[] = [];
        
        // For each partida, get its equipos subcollection
        //for (const partidaDoc of partidasSnapshot.docs) {
            
            //const equiposSnapshot = await getDocs(collection(db, "partidas", partidaDoc.id, "equipos"));
            
            const equiposSnapshot = await getDocs(collection(db, "partidas", partidaId, "equipos"));

            equiposSnapshot.forEach((equipoDoc) => {
                const data = equipoDoc.data();
                console.log(data);
                // Ensure the data matches our Team interface
                if (typeof data.name === 'string' && typeof data.score === 'number') {
                    teams.push({
                        id: equipoDoc.id,
                        name: data.name,
                        score: data.score,
                        partidaId: partidaId // Adding partidaId to track which partida this team belongs to
                    });
                } else {
                    console.warn(`Equipo document ${equipoDoc.id} in partida ${partidaId} has invalid data structure:`, data);
                }
            });
        //}
        
        console.log(`Successfully read ${teams.length} teams from ${partidasSnapshot.size} partidas`);
        return teams;
    } catch (error) {
        console.error("Error reading teams from Firestore:", error);
        throw error;
    }
}
