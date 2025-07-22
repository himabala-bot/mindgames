import React, { useState, useEffect } from 'react';
import { RotateCcw, Info } from 'lucide-react';

const emojis = ['🌟', '🚀', '🌙', '⭐', '🛸', '🌍', '🔮', '💫'];

const MemoryMatch = () => {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const initializeGame = () => {
    const shuffledCards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji }));
    
    setCards(shuffledCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setGameWon(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
      setMoves(moves + 1);
    }
  }, [flipped, cards, matched, moves]);

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setGameWon(true);
    }
  }, [matched, cards]);

  const handleCardClick = (index) => {
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-3xl font-bold">Memory Constellation</h2>
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
              Flip cards to reveal cosmic symbols. Find and match pairs of identical symbols. Clear all pairs to complete the constellation! Try to do it in as few moves as possible.
            </p>
          </div>
        )}
        
        {gameWon ? (
          <p className="text-2xl text-green-400 font-bold">🎉 Constellation Complete! 🎉</p>
        ) : (
          <p className="text-xl text-cyan-400">Moves: {moves}</p>
        )}
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8 max-w-md">
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(index)}
            className={`w-16 h-16 rounded-lg text-2xl font-bold transition-all duration-300 transform hover:scale-105 ${
              flipped.includes(index) || matched.includes(index)
                ? 'bg-gradient-to-br from-cyan-500 to-purple-500'
                : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 hover:border-cyan-400'
            }`}
          >
            {flipped.includes(index) || matched.includes(index) ? card.emoji : '?'}
          </button>
        ))}
      </div>

      <button
        onClick={initializeGame}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
      >
        <RotateCcw size={20} />
        New Game
      </button>
    </div>
  );
};

export default MemoryMatch;