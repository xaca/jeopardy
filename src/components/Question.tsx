import React, { useState } from 'react';

interface TeamScore {
  id: number;
  score: number;
  name: string;
}

interface QuestionProps {
  question: string;
  points: number;
  category: string;
  answer: string;
  onContinue?: () => void;
  onReveal?: () => void;
  teams: TeamScore[];
  onScoreUpdate: (teamId: number, increment: boolean) => void;
}

const Question: React.FC<QuestionProps> = ({
  question,
  points,
  category,
  answer,
  onContinue,
  onReveal,
  teams,
  onScoreUpdate,
}) => {
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const handleReveal = () => {
    setIsAnswerRevealed(true);
    onReveal?.();
  };

  // Handle keyboard shortcuts
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        onContinue?.();
      } else if (event.code === 'Space') {
        handleReveal();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 bg-[#000066] text-white p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={onContinue}
          className="px-4 py-2 text-sm bg-blue-700 hover:bg-blue-600 rounded transition-colors"
        >
          Continue (ESC)
        </button>
        <h1 className="text-2xl font-bold">
          {category} for ${points}
        </h1>
        <button 
          onClick={handleReveal}
          className="px-4 py-2 text-sm bg-blue-700 hover:bg-blue-600 rounded transition-colors"
          disabled={isAnswerRevealed}
        >
          Reveal Answer (Space)
        </button>
      </div>

      {/* Question Display */}
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <h2 className="text-4xl md:text-5xl lg:text-6xl text-center mb-8">
            {question}
          </h2>
          {isAnswerRevealed && (
            <div className="text-3xl md:text-4xl text-center text-yellow-400 mt-8">
              {answer}
            </div>
          )}
        </div>
      </div>

      {/* Team Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        {teams.map(team => (
          <div key={team.id} className="text-center">
            <h3 className="text-xl font-bold border-b-2 border-blue-500 pb-2 mb-2">
              {team.name}
            </h3>
            <div className="bg-blue-800 px-8 py-4 text-3xl font-bold mb-2 rounded">
              ${team.score}
            </div>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => onScoreUpdate(team.id, true)}
                className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
              >
                +
              </button>
              <button
                onClick={() => onScoreUpdate(team.id, false)}
                className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;
