import React from 'react';
import { Play } from 'lucide-react';

const GameCard = ({ game, onSelect }) => {
  return (
    <div className="group relative bg-gradient-to-br from-gray-800/80 to-black/60 backdrop-blur-sm border border-gray-600/50 rounded-xl p-6 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 cursor-pointer">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="text-4xl mb-4 text-center">{game.icon}</div>
        
        <h3 className="text-xl font-bold text-center mb-3 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {game.title}
        </h3>
        
        <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">
          {game.description}
        </p>
        
        <button
          onClick={() => onSelect(game.id)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
        >
          <Play size={16} />
          Play Game
        </button>
      </div>
    </div>
  );
};

export default GameCard;