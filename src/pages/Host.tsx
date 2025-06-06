import TeamCard from "@/components/TeamCard";
import {readTeams, readPartidasId} from "@/lib/xaca/data/read_teams";
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

    function handlePartidaChange(partidaId: string) {
        setSelectedPartidaId(partidaId);
        (async () => {
            const teams = await readTeams(partidaId);
            setTeams(teams);
        })();
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
            <button className="bg-blue-500 text-white p-2 rounded" onClick={() => handlePartidaChange(selectedPartidaId)}></button>
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