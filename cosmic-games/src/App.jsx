import React, { useState } from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import GameCard from './components/GameCard';
import TicTacToe from './components/TicTacToe';
import MemoryMatch from './components/MemoryMatch';
import RockPaperScissors from './components/RockPaperScissors';
import Snake from './components/Snake';
import TypingTest from './components/TypingTest';
import Hangman from './components/Hangman';
import DinoRunner from './components/DinoRunner';
import MazeSolver from './components/MazeSolver';

const games = [
  {
    id: 'tic-tac-toe',
    title: 'AI Tic Tac Toe',
    description: 'Challenge the cosmic AI in this strategic battle',
    icon: '⚡',
    component: TicTacToe
  },
  {
    id: 'memory-match',
    title: 'Memory Constellation',
    description: 'Match pairs of cosmic cards to clear the galaxy',
    icon: '🌌',
    component: MemoryMatch
  },
  {
    id: 'rock-paper-scissors',
    title: 'Asteroid Clash',
    description: 'Ancient battle of rock, paper, scissors in space',
    icon: '🚀',
    component: RockPaperScissors
  },
  {
    id: 'snake',
    title: 'Stellar Serpent',
    description: 'Guide your cosmic snake through the star field',
    icon: '🐍',
    component: Snake
  },
  {
    id: 'typing-test',
    title: 'Hyperspeed Typing',
    description: 'Test your typing speed across the cosmos',
    icon: '⌨️',
    component: TypingTest
  },
  {
    id: 'hangman',
    title: 'Galactic Hangman',
    description: 'Save the astronaut by guessing the mystery word',
    icon: '👨‍🚀',
    component: Hangman
  },
  {
    id: 'dino-runner',
    title: 'Space Dino Run',
    description: 'Help the cosmic dinosaur jump over asteroids',
    icon: '🦕',
    component: DinoRunner
  },
  {
    id: 'maze-solver',
    title: 'Cosmic Maze',
    description: 'Navigate through space mazes or watch AI solve them',
    icon: '🌀',
    component: MazeSolver
  }
];

function App() {
  const [currentGame, setCurrentGame] = useState(null);

  const handleGameSelect = (gameId) => {
    const game = games.find(g => g.id === gameId);
    setCurrentGame(game);
  };

  const handleBackToHome = () => {
    setCurrentGame(null);
  };

  const CurrentGameComponent = currentGame?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white overflow-hidden relative">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-cyan-400 rounded-full opacity-40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
        {/* Additional floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute bg-purple-400 rounded-full opacity-20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 4 + 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {!currentGame ? (
          // Home Screen
          <div className="container mx-auto px-6 py-8">
            <header className="text-center mb-12">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 animate-pulse">
                COSMIC GAMES
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Embark on intergalactic gaming adventures across the cosmos
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onSelect={handleGameSelect}
                />
              ))}
            </div>

            <footer className="text-center mt-16 text-gray-400">
              <p className="text-gray-500">🌟 Made with cosmic energy and React magic 🌟</p>
            </footer>
          </div>
        ) : (
          // Game Screen
          <div className="min-h-screen flex flex-col">
            <header className="flex items-center justify-between p-6 border-b border-gray-700 bg-black/20 backdrop-blur-sm">
              <button
                onClick={handleBackToHome}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-all duration-200 hover:border-cyan-400"
              >
                <ArrowLeft size={20} />
                <span>Back to Galaxy</span>
              </button>
              
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {currentGame.title}
              </h1>
              
              <div className="w-32"></div> {/* Spacer for centering */}
            </header>

            <div className="flex-1 p-6">
              <CurrentGameComponent />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;