import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { readTeam, updateTeamScore, subscribeToTeams } from "@/lib/xaca/data/teams";
import CircularTimer from "@/components/CircularTimer";
import { readPartidaBoard } from "@/lib/xaca/data/game";
import GameBoard from "@/components/GameBoard";
import { categories, pointValues, questionsData } from "@/data/mockQuestions";

// Team Info Component
function TeamInfo({ partidaId, teamId, score, teamName, isAnswerEnabled, answer, setAnswer, startAnswerTimer, sendAnswer, handleTimerComplete }: {
    partidaId: string;
    teamId: string;
    score: number;
    teamName: string;
    isAnswerEnabled: boolean;
    answer: string;
    setAnswer: (answer: string) => void;
    startAnswerTimer: () => void;
    sendAnswer: (partidaId: string, teamId: string, answer: string) => void;
    handleTimerComplete: () => void;
}) {
    return (
        <div className="bg-[#000066] rounded-lg p-6 md:p-8 shadow-lg">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Team Score
            </h1>
            
            <div className="space-y-6">
                <div className="text-center">
                    <p className="text-gray-300 text-sm md:text-base mb-1">Game ID</p>
                    <p className="font-mono text-base md:text-lg bg-[#000044] p-2 rounded">
                        {partidaId}
                    </p>
                </div>

                <div className="text-center">
                    <p className="text-gray-300 text-sm md:text-base mb-1">Team</p>
                    <p className="font-bold text-xl md:text-2xl text-yellow-400">
                        {teamName}
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-4">
                    <div className="w-full max-w-xs">
                        <label htmlFor="score" className="block text-gray-300 text-sm md:text-base mb-2">
                            Current Score
                        </label>
                        <input
                            id="score"
                            type="text"
                            value={score}
                            className="w-full bg-[#000044] text-white text-2xl md:text-3xl font-bold p-3 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled
                        />
                    </div>
                    <div className="w-full max-w-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={startAnswerTimer}
                                disabled={isAnswerEnabled}
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Start Answer
                            </button>
                            {isAnswerEnabled && (
                                <CircularTimer
                                    duration={60}
                                    onComplete={handleTimerComplete}
                                    size={40}
                                    className="text-white"
                                />
                            )}
                        </div>
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full bg-[#000044] text-white text-2xl md:text-3xl font-bold p-3 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={!isAnswerEnabled}
                            placeholder={isAnswerEnabled ? "Type your answer..." : "Click Start Answer to begin"}
                        />
                        <button
                            onClick={() => sendAnswer(partidaId, teamId, answer)}
                            disabled={!isAnswerEnabled || !answer.trim()}
                            className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Answer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Player() {
    const { partidaId, teamId } = useParams();
    const [score, setScore] = useState(0);
    const [teamName, setTeamName] = useState("");
    const [answer, setAnswer] = useState("");
    const [isAnswerEnabled, setIsAnswerEnabled] = useState(false);
    const [activeTab, setActiveTab] = useState<'board' | 'info'>('board');
    const [activatedQuestions, setActivatedQuestions] = useState<Set<string>>(new Set<string>());
    useEffect(() => {
        console.log(partidaId, teamId);
        let unsubscribe: (() => void) | undefined;

        (async () => {
            if (partidaId && teamId) {
                // Initial team data fetch
                const team = await readTeam(partidaId, teamId);
                setScore(team.score);
                setTeamName(team.name);

                // Subscribe to real-time updates
                unsubscribe = subscribeToTeams(partidaId, (teams) => {
                    const updatedTeam = teams.find(t => t.id === teamId);
                    if (updatedTeam) {
                        setScore(updatedTeam.score);
                        setTeamName(updatedTeam.name);
                    }
                });
            }
        })();

        // Cleanup subscription on unmount
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [partidaId, teamId]);

    useEffect(() => {
        const fetchBoard = async () => {
            if (partidaId) {
                const board = await readPartidaBoard(partidaId);
                console.log(board);
                setActivatedQuestions(board);
            }
        }
        fetchBoard();
    }, []);
    const handleTimerComplete = () => {
        setIsAnswerEnabled(false);
        setAnswer(""); // Clear the answer when time is up
    };

    const startAnswerTimer = () => {
        setIsAnswerEnabled(true);
        setAnswer(""); // Clear any previous answer
    };

    const sendAnswer = (partidaId: string, teamId: string, answer: string) => {
        if (!isAnswerEnabled) return;
        console.log(partidaId, teamId, answer);
        setIsAnswerEnabled(false);
    }

    const handleQuestionClick = (category: string, points: number) => {
        console.log(category, points);       
    }

    if (!partidaId || !teamId) {
        return <div className="min-h-screen bg-[#000033] text-white p-4">Invalid game or team ID</div>;
    }

    return (
        <div className="min-h-screen bg-[#000033] text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Tab Navigation */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('board')}
                        className={`px-4 py-2 rounded-t-lg font-semibold transition-colors duration-200 ${
                            activeTab === 'board'
                                ? 'bg-[#000066] text-white'
                                : 'bg-[#000044] text-gray-400 hover:text-white'
                        }`}
                    >
                        Game Board
                    </button>
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`px-4 py-2 rounded-t-lg font-semibold transition-colors duration-200 ${
                            activeTab === 'info'
                                ? 'bg-[#000066] text-white'
                                : 'bg-[#000044] text-gray-400 hover:text-white'
                        }`}
                    >
                        Team Info
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'board' ? (
                    <GameBoard categories={categories} pointValues={pointValues} questionsData={questionsData} activatedQuestions={activatedQuestions} onQuestionClick={handleQuestionClick} />
                ) : (
                    <TeamInfo
                        partidaId={partidaId}
                        teamId={teamId}
                        score={score}
                        teamName={teamName}
                        isAnswerEnabled={isAnswerEnabled}
                        answer={answer}
                        setAnswer={setAnswer}
                        startAnswerTimer={startAnswerTimer}
                        sendAnswer={sendAnswer}
                        handleTimerComplete={handleTimerComplete}
                    />
                )}
            </div>
        </div>
    );
}