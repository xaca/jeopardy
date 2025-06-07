import TeamCard from "@/components/TeamCard";
import {readTeams, readPartidasId, subscribeToTeams} from "@/lib/xaca/data/teams";
import type { Team } from "@/types/Team";
import { useEffect, useState } from "react";

export default function Host() {
    const [teams, setTeams] = useState<Team[]>([]);
    const [partidasId, setPartidasId] = useState<string[]>([]);
    const [selectedPartidaId, setSelectedPartidaId] = useState<string>("");

    useEffect(() => {
        (async () => {
            const partidasId = await readPartidasId();
            setPartidasId(partidasId);
            if (partidasId.length > 0) {
                setSelectedPartidaId(partidasId[0]);
            }
        })();
    }, []);

    // Set up listener when selectedPartidaId changes
    useEffect(() => {
        if (!selectedPartidaId) return;

        // Set up the real-time listener
        const unsubscribe = subscribeToTeams(selectedPartidaId, (updatedTeams) => {
            setTeams(updatedTeams);
        });

        // Cleanup function to remove the listener when component unmounts or partidaId changes
        return () => unsubscribe();
    }, [selectedPartidaId]);

    function handlePartidaChange(partidaId: string) {
        setSelectedPartidaId(partidaId);
    }

    return (
        <div>
            <h1>Host</h1>
            <select 
                value={selectedPartidaId}
                onChange={(e) => handlePartidaChange(e.target.value)}
                className="mb-4 p-2 rounded"
            >
                {partidasId.map((partidaId) => (
                    <option key={partidaId} value={partidaId}>{partidaId}</option>
                ))}
            </select>
            <button 
                className="bg-blue-500 text-white p-2 rounded ml-2" 
                onClick={() => handlePartidaChange(selectedPartidaId)}
            >
                Refresh
            </button>
            {teams.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {teams.map((team) => (
                    <TeamCard
                        key={team.id}
                        id={team.id}
                        name={team.name}
                        score={team.score}
                        partidaId={selectedPartidaId}
                    />
                ))}
            </div>
            )}
        </div>
    )
}