import { useState } from 'react';
import Game from '../components/Game';


const Home = () => {
  const [teams, setTeams] = useState(3);
  const [isStarted, setIsStarted] = useState(false);

  return (
    <div className="min-h-screen bg-[#000033] text-white p-4">

      {/* Game Controls */}
      {!isStarted && (
        <div className="flex flex-col justify-center gap-4 mb-8 mx-auto">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-center font-bold mb-8">
            Coding midterm
        </h1>
        
          <select 
            value={teams}
            onChange={(e) => setTeams(Number(e.target.value))}
            className="bg-white text-black px-4 py-2 rounded"
          >
            <option value={2}>2 teams</option>
            <option value={3}>3 teams</option>
            <option value={4}>4 teams</option>
          </select>
          <button
            onClick={() => setIsStarted(true)}
            className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition-colors"
          >
            Start
          </button>
        </div>
      )}

      {/* Show Game component when started */}
      {isStarted && <Game teams={teams} />}
    </div>
  );
};

export default Home;
