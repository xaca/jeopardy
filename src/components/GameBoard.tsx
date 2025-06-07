import { getBoardCoordinates } from '@/utils/boardUtils';
import React from 'react';

interface QuestionData {
  category: string;
  points: number;
  question: string;
  answer: string;
}

interface GameBoardProps {
  categories: string[];
  pointValues: number[];
  questionsData: { [key: string]: { [key: number]: QuestionData } };
  activatedQuestions: Set<string>;
  onQuestionClick: (category: string, points: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({
  categories,
  pointValues,
  questionsData,
  activatedQuestions,
  onQuestionClick,
}) => {
  const isQuestionActivated = (category: string, points: number) => {    
    return activatedQuestions.has(`${category}-${points}`);
  };
  
  return (
    <div className="grid grid-cols-5 gap-1 h-full">
      {/* Categories */}
      {categories.map((category) => (
        <div 
          key={category} 
          className="bg-[#000066] p-2 text-center font-bold text-sm md:text-base lg:text-lg xl:text-xl text-white h-16 flex items-center justify-center border-b-2 border-[#000033]"
        >
          {category}
        </div>
      ))}

      {/* Question Cards - Organized by rows */}
      {pointValues.map((points) => (
        <React.Fragment key={points}>
          {categories.map((category) => {
            const validation1 = isQuestionActivated(category, points);
            const { row, col } = getBoardCoordinates(category, points);
            const validation2 = activatedQuestions.has(`${row},${col}`);
            const activated = validation1 || validation2;
            return (
              <button
                key={`${category}-${points}`}
                className={`${
                  activated 
                    ? 'bg-gray-700 cursor-not-allowed opacity-50' 
                    : 'bg-[#000066] hover:bg-[#000099]'
                } h-16 flex items-center justify-center text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold transition-colors text-white border border-[#000033]`}
                onClick={() => onQuestionClick(category, points)}
                disabled={activated}
              >
                ${points}
              </button>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default GameBoard; 