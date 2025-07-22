import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Play, Info } from 'lucide-react';

const DinoRunner = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [dinoJumping, setDinoJumping] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(2);
  const [showInstructions, setShowInstructions] = useState(false);

  const jump = useCallback(() => {
    if (!dinoJumping && gameStarted && !gameOver) {
      setDinoJumping(true);
      setTimeout(() => setDinoJumping(false), 600);
    }
  }, [dinoJumping, gameStarted, gameOver]);

  // Handle spacebar for jumping
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!gameStarted) {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setGameSpeed(2);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setGameSpeed(2);
    setDinoJumping(false);
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setScore(prev => prev + 1);
      
      // Increase speed gradually
      setGameSpeed(prev => prev + 0.002);

      // Add new obstacles
      if (Math.random() < 0.02) {
        setObstacles(prev => [...prev, { id: Date.now(), position: 100 }]);
      }

      // Move obstacles
      setObstacles(prev => prev
        .map(obstacle => ({ ...obstacle, position: obstacle.position - gameSpeed }))
        .filter(obstacle => obstacle.position > -10)
      );

      // Check collision
      setObstacles(prev => {
        const dinoPosition = 5; // Dino is at 5% from left
        const collisionObstacle = prev.find(obstacle => 
          obstacle.position <= dinoPosition + 5 && 
          obstacle.position >= dinoPosition - 5 && 
          !dinoJumping
        );

        if (collisionObstacle) {
          setGameOver(true);
          setGameStarted(false);
        }

        return prev;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, gameSpeed, dinoJumping]);

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-3xl font-bold">Space Dino Run</h2>
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
              Press SPACEBAR to make the cosmic dinosaur jump over asteroids. The game gets faster as your score increases. How far can you go?
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-6 mb-4">
          <p className="text-xl text-cyan-400">Score: {score}</p>
          
          {!gameStarted && !gameOver && (
            <button
              onClick={startGame}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
            >
              <Play size={20} />
              Start
            </button>
          )}
        </div>

        {gameOver && (
          <p className="text-2xl text-red-400 font-bold mb-4">🦖 Game Over! Score: {score} 🦖</p>
        )}

        {!gameStarted && (
          <p className="text-gray-400 mb-4">Press SPACEBAR to jump!</p>
        )}
      </div>

      {/* Game Area */}
      <div className="relative w-full max-w-4xl h-64 bg-gradient-to-b from-purple-900 to-black border-2 border-purple-500 rounded-lg overflow-hidden mb-6">
        {/* Ground */}
        <div className="absolute bottom-0 w-full h-2 bg-cyan-400"></div>
        
        {/* Dino */}
        <div 
          className={`absolute bottom-2 left-20 text-4xl transition-all duration-300 ${
            dinoJumping ? 'transform -translate-y-16' : ''
          }`}
          style={{
            transitionTimingFunction: dinoJumping ? 'cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'ease-out'
          }}
        >
          🦕
        </div>

        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className="absolute bottom-2 text-3xl"
            style={{ left: `${obstacle.position}%` }}
          >
            🌵
          </div>
        ))}

        {/* Background elements */}
        <div className="absolute top-10 left-1/4 text-2xl opacity-60">⭐</div>
        <div className="absolute top-16 right-1/3 text-xl opacity-40">🌙</div>
        <div className="absolute top-8 right-1/4 text-lg opacity-50">✨</div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={jump}
          disabled={!gameStarted || gameOver}
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
        >
          Jump (Spacebar)
        </button>
        
        <button
          onClick={resetGame}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
        >
          <RotateCcw size={20} />
          Reset
        </button>
      </div>
    </div>
  );
};

export default DinoRunner;