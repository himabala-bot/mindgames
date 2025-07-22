import React, { useState } from 'react';
import { RotateCcw, Info } from 'lucide-react';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  const isDraw = !winner && board.every(cell => cell !== null);

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-3xl font-bold">Cosmic Tic Tac Toe</h2>
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
              Take turns placing X's and O's on the 3x3 grid. Get 3 in a row (horizontally, vertically, or diagonally) to win! Player X always goes first.
            </p>
          </div>
        )}
        
        {winner ? (
          <p className="text-2xl text-green-400 font-bold">🎉 Player {winner} Wins! 🎉</p>
        ) : isDraw ? (
          <p className="text-2xl text-yellow-400 font-bold">⭐ It's a Draw! ⭐</p>
        ) : (
          <p className="text-xl text-cyan-400">Player {isXNext ? 'X' : 'O'}'s Turn</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            className="w-20 h-20 bg-gradient-to-br from-purple-700 to-blue-700 border-2 border-purple-500 rounded-lg text-4xl font-bold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
          >
            <span className={cell === 'X' ? 'text-cyan-400' : 'text-pink-400'}>
              {cell}
            </span>
          </button>
        ))}
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

export default TicTacToe;