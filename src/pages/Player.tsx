import { useParams } from "react-router";
import { useEffect } from "react";

export default function Player() {
    const { partidaId, teamId } = useParams();

    useEffect(() => {
        console.log(partidaId, teamId);
    }, [partidaId, teamId]);

    return (
        <div>
            <h1>Player</h1>
            <p>Partida: {partidaId}</p>
            <p>Equipo: {teamId}</p>
        </div>
    )
}