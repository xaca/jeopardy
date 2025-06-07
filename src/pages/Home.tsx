import { useEffect, useState } from 'react';
import Game from '../components/Game';
import type { Team } from '@/types/Team';
import { Toaster,toast} from "react-hot-toast";
import { createPartida, readPartidasId, subscribeToTeams } from '@/lib/xaca/data/teams';

const Home = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [partidaId, setPartidaId] = useState<string>("");

  function handleTeamsChange(teams: number) {
    if (teams === -1) {
      setTeams([]);
      toast.error("Please select a number of teams");
      return;
    }
    const array:Team[] = [];
    for (let i = 0; i < teams; i++) {
      array.push({
        id: i.toString(),
        name: `Team ${i + 1}`,
        score: 0,
        partidaId: ""
      });
    }
    setTeams(array);
  }

  async function handleCreatePartida() {
    try {
      setIsLoading(true);
      const newPartidaId = await createPartida();
      setPartidaId(newPartidaId);
      setIsStarted(true);
    } catch (error) {
      console.error('Error creating partida:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
    <Toaster />
    <div className="min-h-screen bg-[#000033] text-white p-4">
      {/* Game Controls */}
      {!isStarted && (
        <div className="flex flex-col justify-center gap-4 mb-8 mx-auto max-w-md">
          {/* Header */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-center font-bold mb-8">
            Coding midterm
          </h1>
          
          <h2 className="text-xl font-semibold">How many teams?</h2>
          <select 
            onChange={(e) => handleTeamsChange(Number(e.target.value))}
            className="bg-[#000066] border border-white/20 rounded px-4 py-2 focus:outline-none focus:border-white/40 transition-colors"
            disabled={isLoading}
          >
            <option value="-1">Select number of teams</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <button
            onClick={handleCreatePartida}
            disabled={isLoading || teams.length === 0}
            className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative"
          >
            {isLoading ? (
              <>
                <span className="opacity-0">Start</span>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              'Start'
            )}
          </button>
        </div>
      )}

      {/* Show Game component when started */}
      {isStarted && <Game totalTeams={teams.length} partidaId={partidaId} />}
    </div>
    </>
  );
};

export default Home;
