import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseConfig } from "../utils/config";

export interface Partida {
    id: string;
    board: string;
    createdAt: string;
    status: string;
}

/**
 * Reads a partida by ID and returns a Set of used positions
 * @param partidaId The ID of the partida to read
 * @returns A promise that resolves to a Set of strings in "row,col" format representing used positions
 * @throws Error if the partida is not found or if the board data is invalid
 */
export async function readPartidaBoard(partidaId: string): Promise<Set<string>> {
    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        // Get the partida document
        const partidaDoc = await getDoc(doc(db, "partidas", partidaId));
        
        if (!partidaDoc.exists()) {
            throw new Error(`Partida with ID ${partidaId} not found`);
        }
        
        const partidaData = partidaDoc.data() as Partida;
        
        // Parse the board string and create a Set of used positions
        const usedPositions = new Set<string>();
        const rows = partidaData.board.split(';');
        
        // Validate the matrix structure
        if (rows.length !== 5 || rows.some(row => row.split(',').length !== 5)) {
            throw new Error('Invalid board format: expected a 5x5 matrix');
        }
        
        // Convert to Set of used positions
        rows.forEach((row, rowIndex) => {
            row.split(',').forEach((cell, colIndex) => {
                if (parseInt(cell, 10) === 1) {
                    usedPositions.add(`${rowIndex},${colIndex}`);
                }
            });
        });
        
        return usedPositions;
    } catch (error) {
        console.error("Error reading partida board:", error);
        throw error;
    }
}

/**
 * Updates the board representation to mark a question as answered
 * @param partidaId The ID of the partida to update
 * @param row The row index (0-4) of the question to mark as answered
 * @param col The column index (0-4) of the question to mark as answered
 * @returns A promise that resolves when the update is complete
 * @throws Error if the partida is not found, if the position is invalid, or if the update fails
 */
export async function updatePartidaBoard(partidaId: string, row: number, col: number): Promise<void> {
    try {
        // Validate position
        if (row < 0 || row > 4 || col < 0 || col > 4) {
            throw new Error('Invalid position: row and column must be between 0 and 4');
        }

        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        
        // Get the partida document
        const partidaRef = doc(db, "partidas", partidaId);
        const partidaDoc = await getDoc(partidaRef);
        
        if (!partidaDoc.exists()) {
            throw new Error(`Partida with ID ${partidaId} not found`);
        }
        
        const partidaData = partidaDoc.data() as Partida;
        
        // Parse the board string
        const rows = partidaData.board.split(';');
        
        // Validate the matrix structure
        if (rows.length !== 5 || rows.some(row => row.split(',').length !== 5)) {
            throw new Error('Invalid board format: expected a 5x5 matrix');
        }
        
        // Update the specific position
        const rowArray = rows[row].split(',');
        rowArray[col] = '1';
        rows[row] = rowArray.join(',');
        
        // Create the updated board string
        const updatedBoard = rows.join(';');
        
        // Update the document
        await updateDoc(partidaRef, {
            board: updatedBoard
        });
    } catch (error) {
        console.error("Error updating partida board:", error);
        throw error;
    }
}
