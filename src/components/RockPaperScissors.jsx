import React, { useState } from 'react';
import { RotateCcw, Info } from 'lucide-react';

const choices = [
  { name: 'rock', emoji: '🪨', beats: 'scissors' },
  { name: 'paper', emoji: '📄', beats: 'rock' },
  { name: 'scissors', emoji: '✂️', beats: 'paper' }
];

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState('');
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [showInstructions, setShowInstructions] = useState(false);

  const playGame = (playerSelection) => {
    const computerSelection = choices[Math.floor(Math.random() * choices.length)];
    
    setPlayerChoice(playerSelection);
    setComputerChoice(computerSelection);

    let gameResult;
    if (playerSelection.name === computerSelection.name) {
      gameResult = "It's a tie!";
    } else if (playerSelection.beats === computerSelection.name) {
      gameResult = 'You win!';
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else {
      gameResult = 'Computer wins!';
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
    }

    setResult(gameResult);
  };

  const resetGame = () => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult('');
    setScore({ player: 0, computer: 0 });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-3xl font-bold">Asteroid Clash</h2>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <Info size={20} />
          </button>
        </div>

        {showInstructions && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-800/50 to-blue-800/50 border border-purple-500/30 rounded-lg max-w-md mx-auto">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">How to Play:</h3>
            <p className="text-gray-300 text-sm">
              Choose your weapon! Rock crushes scissors, scissors cuts paper, and paper covers rock. Battle the computer and see who can win the most rounds!
            </p>
          </div>
        )}
        
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-cyan-400 font-semibold">You</p>
            <p className="text-2xl font-bold">{score.player}</p>
          </div>
          <div className="text-center">
            <p className="text-pink-400 font-semibold">Computer</p>
            <p className="text-2xl font-bold">{score.computer}</p>
          </div>
        </div>

        {result && (
          <p className={`text-xl font-bold mb-4 ${
            result.includes('You win') ? 'text-green-400' : 
            result.includes('Computer wins') ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {result}
          </p>
        )}
      </div>

      {playerChoice && computerChoice && (
        <div className="flex items-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-cyan-400 mb-2">Your Choice</p>
            <div className="text-6xl bg-gradient-to-br from-cyan-500 to-purple-500 p-4 rounded-xl">
              {playerChoice.emoji}
            </div>
          </div>
          
          <div className="text-4xl">VS</div>
          
          <div className="text-center">
            <p className="text-pink-400 mb-2">Computer's Choice</p>
            <div className="text-6xl bg-gradient-to-br from-pink-500 to-red-500 p-4 rounded-xl">
              {computerChoice.emoji}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-8">
        {choices.map((choice) => (
          <button
            key={choice.name}
            onClick={() => playGame(choice)}
            className="flex flex-col items-center gap-2 p-6 bg-gradient-to-br from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            <div className="text-4xl">{choice.emoji}</div>
            <span className="font-semibold capitalize">{choice.name}</span>
          </button>
        ))}
      </div>

      <button
        onClick={resetGame}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
      >
        <RotateCcw size={20} />
        Reset Game
      </button>
    </div>
  );
};

export default RockPaperScissors;