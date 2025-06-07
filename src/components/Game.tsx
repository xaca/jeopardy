import React, { useEffect, useState } from 'react';
import Question from '../components/Question';
import TeamCard from '../components/TeamCard';
import { createTeams, readTeams, subscribeToTeams, updateTeamScore } from '@/lib/xaca/data/teams';
import type { Team } from '@/types/Team';

interface GameProps {
  totalTeams: number;
  partidaId: string;
}

interface QuestionData {
  category: string;
  points: number;
  question: string;
  answer: string; 
}

const Game: React.FC<GameProps> = ({ totalTeams, partidaId }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionData | null>(null);
  const [activatedQuestions, setActivatedQuestions] = useState<Set<string>>(new Set());
  const [teamScores, setTeamScores] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'board' | 'teams'>('board');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeTeams = async () => {
      try {
        // First check if teams already exist for this partida
        const existingTeams = await readTeams(partidaId);
        
        if (existingTeams.length > 0) {
          // If teams exist, just use them
          if (existingTeams.length !== totalTeams) {
            setError(`This game already has ${existingTeams.length} teams. Cannot modify the number of teams.`);
          }
          setTeamScores(existingTeams.map(team => ({
            id: team.id,
            name: team.name,
            score: team.score,
            partidaId: partidaId
          })));
        } else {
          // Only create teams if none exist
          await createTeams(partidaId, totalTeams);
          const teams = await readTeams(partidaId);
          setTeamScores(teams.map(team => ({
            id: team.id,
            name: team.name,
            score: team.score,
            partidaId: partidaId
          })));
        }
      } catch (error) {
        console.error('Error initializing teams:', error);
        setError('Failed to initialize teams. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeTeams();

    // Subscribe to real-time team updates
    const unsubscribe = subscribeToTeams(partidaId, (teams) => {
      setTeamScores(teams.map(team => ({
        id: team.id,
        name: team.name,
        score: team.score,
        partidaId: partidaId
      })));
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [partidaId, totalTeams]);

  // Mock data - in a real app, this would come from an API or database
  const categories = ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript'];
  const pointValues = [100, 200, 300, 400, 500];
  
  const questionsData: { [key: string]: { [key: number]: QuestionData } } = {
    'HTML': {
      100: { category: 'HTML', points: 100, question: 'This tag is used to create a hyperlink', answer: 'What is <a>?' },
      200: { category: 'HTML', points: 200, question: 'This meta tag ensures proper rendering on mobile devices', answer: 'What is viewport?' },
      300: { category: 'HTML', points: 300, question: 'This semantic element represents a standalone section of content', answer: 'What is <article>?' },
      400: { category: 'HTML', points: 400, question: 'This attribute is used to specify custom data attributes', answer: 'What is data-*?' },
      500: { category: 'HTML', points: 500, question: 'This element is used to draw graphics on the webpage', answer: 'What is <canvas>?' },
    },
    'CSS': {
      100: { category: 'CSS', points: 100, question: 'This property is used to change the text color', answer: 'What is color?' },
      200: { category: 'CSS', points: 200, question: 'This display value makes an element disappear from the page', answer: 'What is none?' },
      300: { category: 'CSS', points: 300, question: 'This positioning value removes an element from the normal document flow', answer: 'What is absolute?' },
      400: { category: 'CSS', points: 400, question: 'This unit is relative to the font-size of the root element', answer: 'What is rem?' },
      500: { category: 'CSS', points: 500, question: 'This property is used to create a grid container', answer: 'What is display: grid?' },
    },
    'JavaScript': {
      100: { category: 'JavaScript', points: 100, question: 'This operator is used for strict equality comparison', answer: 'What is ===' },
      200: { category: 'JavaScript', points: 200, question: 'This method creates a new array with the results of calling a function for every array element', answer: 'What is map()?' },
      300: { category: 'JavaScript', points: 300, question: 'This keyword is used to declare variables that cannot be reassigned', answer: 'What is const?' },
      400: { category: 'JavaScript', points: 400, question: 'This object method creates a shallow copy of an array', answer: 'What is Object.assign()?' },
      500: { category: 'JavaScript', points: 500, question: 'This feature allows you to extract array elements or object properties into distinct variables', answer: 'What is destructuring?' },
    },
    'React': {
      100: { category: 'React', points: 100, question: 'This hook is used to handle side effects in function components', answer: 'What is useEffect?' },
      200: { category: 'React', points: 200, question: 'This method is called just before a component is unmounted', answer: 'What is componentWillUnmount?' },
      300: { category: 'React', points: 300, question: 'This prop is used to pass content between component tags', answer: 'What is children?' },
      400: { category: 'React', points: 400, question: 'This technique is used to prevent unnecessary re-renders of components', answer: 'What is memoization?' },
      500: { category: 'React', points: 500, question: 'This pattern is used to share behavior between components', answer: 'What is render props?' },
    },
    'TypeScript': {
      100: { category: 'TypeScript', points: 100, question: 'This type represents a value that could be one of several types', answer: 'What is union type?' },
      200: { category: 'TypeScript', points: 200, question: 'This keyword is used to define a custom type', answer: 'What is interface?' },
      300: { category: 'TypeScript', points: 300, question: 'This operator is used to assert a type', answer: 'What is as?' },
      400: { category: 'TypeScript', points: 400, question: 'This utility type makes all properties of a type optional', answer: 'What is Partial<T>?' },
      500: { category: 'TypeScript', points: 500, question: 'This feature allows you to create a type that depends on another type', answer: 'What is generics?' },
    },
  };

  const handleQuestionClick = (category: string, points: number) => {
    const questionKey = `${category}-${points}`;
    if (!activatedQuestions.has(questionKey)) {
      const questionData = questionsData[category][points];
      setSelectedQuestion(questionData);
      setActivatedQuestions(prev => new Set([...prev, questionKey]));
    }
  };

  const handleQuestionClose = () => {
    setSelectedQuestion(null);
  };

  const handleScoreUpdate = async (teamId: string, increment: boolean) => {
    try {
      const team = teamScores.find(t => t.id === teamId);
      if (!team || !selectedQuestion) return;

      const newScore = increment 
        ? team.score + selectedQuestion.points 
        : team.score - selectedQuestion.points;

      // Update score in Firestore
      await updateTeamScore(partidaId, teamId, newScore);
      
      // Note: We don't need to update local state here as the subscription will handle it
    } catch (error) {
      console.error('Error updating team score:', error);
      setError('Failed to update team score. Please try again.');
    }
  };

  const isQuestionActivated = (category: string, points: number) => {
    return activatedQuestions.has(`${category}-${points}`);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-[#000033] flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">
          Creating teams...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen bg-[#000033] flex items-center justify-center">
        <div className="text-white text-xl text-center p-4 bg-[#000066] rounded-lg max-w-md">
          <p className="font-bold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#000033] flex flex-col p-2">
      {selectedQuestion ? (
        <Question
          category={selectedQuestion.category}
          points={selectedQuestion.points}
          question={selectedQuestion.question}
          answer={selectedQuestion.answer}
          onContinue={handleQuestionClose}
          onReveal={() => {}}
          teams={teamScores}
          onScoreUpdate={handleScoreUpdate}
        />
      ) : (
        <div className="flex flex-col h-full max-w-[1400px] mx-auto w-full overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex-none flex space-x-2 mb-4">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-4 py-2 rounded-t-lg font-bold transition-colors ${
                activeTab === 'board'
                  ? 'bg-[#000066] text-white'
                  : 'bg-[#000044] text-gray-300 hover:bg-[#000055]'
              }`}
            >
              Game Board
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-4 py-2 rounded-t-lg font-bold transition-colors ${
                activeTab === 'teams'
                  ? 'bg-[#000066] text-white'
                  : 'bg-[#000044] text-gray-300 hover:bg-[#000055]'
              }`}
            >
              Team Scores
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto">
            {activeTab === 'board' ? (
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
                      const activated = isQuestionActivated(category, points);
                      return (
                        <button
                          key={`${category}-${points}`}
                          className={`${
                            activated 
                              ? 'bg-gray-700 cursor-not-allowed opacity-50' 
                              : 'bg-[#000066] hover:bg-[#000099]'
                          } h-16 flex items-center justify-center text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold transition-colors text-white border border-[#000033]`}
                          onClick={() => handleQuestionClick(category, points)}
                          disabled={activated}
                        >
                          ${points}
                        </button>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 h-full">
                {teamScores.map((team, index) => (
                  <TeamCard
                    key={index}
                    id={team.id}
                    name={team.name}
                    score={team.score}
                    partidaId={partidaId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Game; 