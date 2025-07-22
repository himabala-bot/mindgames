import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Play, Pause, Info } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };

const Snake = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection({ x: 1, y: 0 });
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
  };

  const generateFood = useCallback((snakeBody) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snakeBody.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 1);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameStarted, gameOver, generateFood]);

  // Game loop
  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted) return;

      const keyMap = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }
      };

      const newDirection = keyMap[e.key];
      if (newDirection) {
        setDirection(current => {
          // Prevent reversing into self
          if (newDirection.x === -current.x && newDirection.y === -current.y) {
            return current;
          }
          return newDirection;
        });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted]);

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-3xl font-bold">Stellar Serpent</h2>
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
              Use arrow keys to control your cosmic snake. Eat the red stars to grow longer and increase your score. Don't hit the walls or your own tail!
            </p>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-6 mb-4">
          <p className="text-xl text-cyan-400">Score: {score}</p>
          
          {!gameStarted && !gameOver && (
            <button
              onClick={() => setGameStarted(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition-colors"
            >
              <Play size={20} />
              Start Game
            </button>
          )}
          
          {gameStarted && !gameOver && (
            <button
              onClick={() => setGameStarted(false)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-lg transition-colors"
            >
              <Pause size={20} />
              Pause
            </button>
          )}
        </div>

        {gameOver && (
          <p className="text-2xl text-red-400 font-bold mb-4">🎯 Game Over! Score: {score} 🎯</p>
        )}

        {!gameStarted && !gameOver && (
          <p className="text-gray-400 mb-4">Use arrow keys to control the snake</p>
        )}
      </div>

      <div 
        className="grid bg-black/30 border-2 border-purple-500 rounded-lg p-2 mb-6"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: '400px',
          height: '400px'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE;
          const y = Math.floor(index / GRID_SIZE);
          
          const isSnake = snake.some(segment => segment.x === x && segment.y === y);
          const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={index}
              className={`w-full h-full ${
                isHead 
                  ? 'bg-cyan-400 rounded-full' 
                  : isSnake 
                  ? 'bg-green-400 rounded-sm' 
                  : isFood 
                  ? 'bg-red-400 rounded-full animate-pulse' 
                  : 'bg-purple-900/20'
              }`}
            />
          );
        })}
      </div>

      <button
        onClick={resetGame}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
      >
        <RotateCcw size={20} />
        New Game
      </button>
    </div>
  );
};

export default Snake;