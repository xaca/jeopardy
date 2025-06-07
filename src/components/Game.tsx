import React, { useEffect, useState } from 'react';
import Question from '../components/Question';
import TeamCard from '../components/TeamCard';
import GameBoard from '../components/GameBoard';
import { createTeams, readTeams, subscribeToTeams, updateTeamScore } from '@/lib/xaca/data/teams';
import type { Team } from '@/types/Team';
import type { QuestionData } from '@/data/mockQuestions';
import { categories, pointValues, questionsData } from '@/data/mockQuestions';
import { updatePartidaBoard } from '@/lib/xaca/data/game';
import { getBoardCoordinates } from '@/utils/boardUtils';

interface GameProps {
  totalTeams: number;
  partidaId: string;
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
          /*if (existingTeams.length !== totalTeams) {
            setError(`This game already has ${existingTeams.length} teams. Cannot modify the number of teams.`);
          }*/
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

  const handleQuestionClick = (category: string, points: number) => {
    const questionKey = `${category}-${points}`;
    
    if (!activatedQuestions.has(questionKey)) {
      const questionData = questionsData[category][points];
      const { row, col } = getBoardCoordinates(category, points);
      setSelectedQuestion(questionData);
      setActivatedQuestions(prev => new Set([...prev, questionKey]));
      updatePartidaBoard(partidaId, row, col);
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
              <GameBoard
                categories={categories}
                pointValues={pointValues}
                questionsData={questionsData}
                activatedQuestions={activatedQuestions}
                onQuestionClick={handleQuestionClick}
              />
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