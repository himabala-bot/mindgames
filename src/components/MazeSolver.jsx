import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Play, Pause, Zap, Info } from 'lucide-react';

const MAZE_SIZE = 15;
const CELL_TYPES = {
  WALL: 1,
  PATH: 0,
  START: 2,
  END: 3,
  VISITED: 4,
  SOLUTION: 5
};

const MazeSolver = () => {
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [gameWon, setGameWon] = useState(false);
  const [isAutoSolving, setIsAutoSolving] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [visitedCells, setVisitedCells] = useState(new Set());

  // Generate a random maze
  const generateMaze = useCallback(() => {
    const newMaze = Array(MAZE_SIZE).fill().map(() => Array(MAZE_SIZE).fill(CELL_TYPES.WALL));
    
    // Simple maze generation - create paths
    for (let y = 1; y < MAZE_SIZE - 1; y += 2) {
      for (let x = 1; x < MAZE_SIZE - 1; x += 2) {
        newMaze[y][x] = CELL_TYPES.PATH;
        
        // Randomly create connections
        if (Math.random() > 0.3 && x < MAZE_SIZE - 3) {
          newMaze[y][x + 1] = CELL_TYPES.PATH;
        }
        if (Math.random() > 0.3 && y < MAZE_SIZE - 3) {
          newMaze[y + 1][x] = CELL_TYPES.PATH;
        }
      }
    }
    
    // Set start and end
    newMaze[1][1] = CELL_TYPES.START;
    newMaze[MAZE_SIZE - 2][MAZE_SIZE - 2] = CELL_TYPES.END;
    
    // Ensure path to end exists
    for (let i = 1; i < MAZE_SIZE - 1; i++) {
      if (newMaze[MAZE_SIZE - 2][i] === CELL_TYPES.WALL) {
        newMaze[MAZE_SIZE - 2][i] = CELL_TYPES.PATH;
      }
      if (newMaze[i][MAZE_SIZE - 2] === CELL_TYPES.WALL) {
        newMaze[i][MAZE_SIZE - 2] = CELL_TYPES.PATH;
      }
    }
    
    return newMaze;
  }, []);

  const resetMaze = () => {
    const newMaze = generateMaze();
    setMaze(newMaze);
    setPlayerPos({ x: 1, y: 1 });
    setGameWon(false);
    setIsAutoSolving(false);
    setVisitedCells(new Set());
  };

  useEffect(() => {
    resetMaze();
  }, [generateMaze]);

  // Player movement
  const movePlayer = useCallback((dx, dy) => {
    if (gameWon || isAutoSolving) return;

    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (newX >= 0 && newX < MAZE_SIZE && newY >= 0 && newY < MAZE_SIZE) {
      const cellType = maze[newY][newX];
      if (cellType !== CELL_TYPES.WALL) {
        setPlayerPos({ x: newX, y: newY });
        setVisitedCells(prev => new Set([...prev, `${newX},${newY}`]));
        
        if (cellType === CELL_TYPES.END) {
          setGameWon(true);
        }
      }
    }
  }, [playerPos, maze, gameWon, isAutoSolving]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  // Auto-solve using simple pathfinding
  const autoSolve = () => {
    if (isAutoSolving) return;
    
    setIsAutoSolving(true);
    const visited = new Set();
    const queue = [{ x: 1, y: 1, path: [{ x: 1, y: 1 }] }];
    
    const solve = () => {
      if (queue.length === 0) {
        setIsAutoSolving(false);
        return;
      }
      
      const current = queue.shift();
      const key = `${current.x},${current.y}`;
      
      if (visited.has(key)) {
        setTimeout(solve, 50);
        return;
      }
      
      visited.add(key);
      setPlayerPos({ x: current.x, y: current.y });
      setVisitedCells(prev => new Set([...prev, key]));
      
      if (maze[current.y][current.x] === CELL_TYPES.END) {
        setGameWon(true);
        setIsAutoSolving(false);
        return;
      }
      
      // Add neighbors
      const directions = [
        { dx: 0, dy: -1 }, { dx: 1, dy: 0 },
        { dx: 0, dy: 1 }, { dx: -1, dy: 0 }
      ];
      
      directions.forEach(({ dx, dy }) => {
        const newX = current.x + dx;
        const newY = current.y + dy;
        const newKey = `${newX},${newY}`;
        
        if (newX >= 0 && newX < MAZE_SIZE && newY >= 0 && newY < MAZE_SIZE &&
            !visited.has(newKey) && maze[newY][newX] !== CELL_TYPES.WALL) {
          queue.push({
            x: newX,
            y: newY,
            path: [...current.path, { x: newX, y: newY }]
          });
        }
      });
      
      setTimeout(solve, 100);
    };
    
    solve();
  };

  const getCellClass = (x, y) => {
    const cellType = maze[y]?.[x];
    const isPlayer = playerPos.x === x && playerPos.y === y;
    const isVisited = visitedCells.has(`${x},${y}`);
    
    if (isPlayer) return 'bg-cyan-400 animate-pulse';
    if (cellType === CELL_TYPES.WALL) return 'bg-gray-800';
    if (cellType === CELL_TYPES.START) return 'bg-green-500';
    if (cellType === CELL_TYPES.END) return 'bg-red-500 animate-pulse';
    if (isVisited) return 'bg-purple-600/50';
    return 'bg-gray-700';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-3xl font-bold">Cosmic Maze</h2>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <Info size={20} />
          </button>
        </div>

        {showInstructions && (
          <div className="mb-6 p-4 bg-gradient-to-r from-gray-800/80 to-black/60 border border-gray-600/50 rounded-lg max-w-md mx-auto">
            <h3 className="text-lg font-bold text-cyan-400 mb-2">How to Play:</h3>
            <p className="text-gray-400 text-sm">
              Navigate from the green start to the red end using arrow keys. Gray walls block your path. Use the auto-solve feature to watch the AI find the solution!
            </p>
          </div>
        )}

        {gameWon && (
          <p className="text-2xl text-green-400 font-bold mb-4">🎉 Maze Completed! 🎉</p>
        )}

        {isAutoSolving && (
          <p className="text-xl text-yellow-400 mb-4">🤖 AI Solving...</p>
        )}
      </div>

      <div 
        className="grid gap-1 p-4 bg-black/40 border-2 border-gray-600 rounded-lg mb-6"
        style={{ 
          gridTemplateColumns: `repeat(${MAZE_SIZE}, 1fr)`,
          width: '450px',
          height: '450px'
        }}
      >
        {maze.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`w-full h-full ${getCellClass(x, y)} transition-colors duration-200`}
            />
          ))
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={autoSolve}
          disabled={isAutoSolving || gameWon}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 rounded-lg transition-colors"
        >
          <Zap size={20} />
          Auto Solve
        </button>

        <button
          onClick={resetMaze}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
        >
          <RotateCcw size={20} />
          New Maze
        </button>
      </div>

      <div className="mt-4 text-center text-gray-400">
        <p>Use arrow keys to move • Green = Start • Red = End</p>
      </div>
    </div>
  );
};

export default MazeSolver;