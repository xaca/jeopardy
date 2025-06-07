import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc, updateDoc, onSnapshot, addDoc } from "firebase/firestore";
import { firebaseConfig } from "@/lib/xaca/utils/config";
import type { Team } from "@/types/Team";
import { uniqueNamesGenerator, adjectives, animals, colors, names } from 'unique-names-generator';
import type { Config } from 'unique-names-generator';

// Custom configuration for team name generation
const customConfig: Config = {
    dictionaries: [adjectives, animals],
    separator: ' ',
    length: 2,
    style: 'capital'
};

// Generate a single random team name
function generateTeamName(): string {
    return uniqueNamesGenerator(customConfig);
}

// Generate n unique team names
function generateUniqueTeamNames(count: number): string[] {
    const names = new Set<string>();
    while (names.size < count) {
        names.add(generateTeamName());
    }
    return Array.from(names);
}

export async function readPartidasId(): Promise<string[]> {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const partidasSnapshot = await getDocs(collection(db, "partidas"));
    return partidasSnapshot.docs.map((doc) => doc.id);
}
export async function readTeam(partidaId: string, teamId: string): Promise<Team> {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const teamDoc = await getDoc(doc(db, "partidas", partidaId, "equipos", teamId));
    return teamDoc.data() as Team;
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

export async function updateTeamScore(partidaId: string, teamId: string, newScore: number): Promise<void> {
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        // Reference to the specific team document
        const teamRef = doc(db, "partidas", partidaId, "equipos", teamId);
        
        // Update the score
        await updateDoc(teamRef, {
            score: newScore
        });
        
        console.log(`Successfully updated score for team ${teamId} in partida ${partidaId} to ${newScore}`);
    } catch (error) {
        console.error("Error updating team score in Firestore:", error);
        throw error;
    }
}

export function subscribeToTeams(partidaId: string, onTeamsUpdate: (teams: Team[]) => void) {
    if (!partidaId) return () => {};

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const teamsRef = collection(db, "partidas", partidaId, "equipos");
    return onSnapshot(teamsRef, (snapshot) => {
        const updatedTeams: Team[] = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            if (typeof data.name === 'string' && typeof data.score === 'number') {
                updatedTeams.push({
                    id: doc.id,
                    name: data.name,
                    score: data.score,
                    partidaId: partidaId
                });
            }
        });
        onTeamsUpdate(updatedTeams);
    });
}

export async function createPartida(): Promise<string> {
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        // Create a new document in the partidas collection
        // We'll add a timestamp to track when the partida was created
        const partidaRef = await addDoc(collection(db, "partidas"), {
            createdAt: new Date().toISOString(),
            status: "active" // You can use this to track if the game is active, finished, etc.
        });
        
        console.log(`Successfully created new partida with ID: ${partidaRef.id}`);
        return partidaRef.id;
    } catch (error) {
        console.error("Error creating new partida in Firestore:", error);
        throw error;
    }
}

export async function createTeams(partidaId: string, numberOfTeams: number): Promise<void> {
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        // Generate random team names
        const teamNames = generateUniqueTeamNames(numberOfTeams);
        
        // Create a batch of writes to add all teams
        const teamsRef = collection(db, "partidas", partidaId, "equipos");
        
        console.log(`Creating ${numberOfTeams} teams in partida ${partidaId}:`, teamNames);

        // Create all teams with initial score of 0 and include their ID
        const createPromises = teamNames.map(async (teamName) => {
            const newTeamRef = await addDoc(teamsRef, {
                name: teamName,
                score: 0,
                id: '' // This will be updated with the actual ID
            });
            
            // Update the document with its own ID
            await updateDoc(newTeamRef, {
                id: newTeamRef.id
            });
        });
        
        await Promise.all(createPromises);
        console.log(`Successfully created ${teamNames.length} teams in partida ${partidaId}:`, teamNames);
    } catch (error) {
        console.error("Error creating teams in Firestore:", error);
        throw error;
    }
}
