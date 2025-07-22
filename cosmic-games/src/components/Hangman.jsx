import React, { useState, useEffect } from 'react';
import { RotateCcw, Info } from 'lucide-react';

const words = [
  'COSMIC', 'GALAXY', 'PLANET', 'ROCKET', 'STELLAR', 'NEBULA', 
  'ASTEROID', 'SPACESHIP', 'UNIVERSE', 'ASTRONAUT', 'METEOR', 'COMET'
];

const MAX_WRONG_GUESSES = 6;

const Hangman = () => {
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [showInstructions, setShowInstructions] = useState(false);

  const startNewGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord);
    setGuessedLetters(new Set());
    setWrongGuesses(0);
    setGameStatus('playing');
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (word) {
      const wordLetters = new Set(word);
      const correctGuesses = [...guessedLetters].filter(letter => wordLetters.has(letter));
      
      if (correctGuesses.length === wordLetters.size) {
        setGameStatus('won');
      } else if (wrongGuesses >= MAX_WRONG_GUESSES) {
        setGameStatus('lost');
      }
    }
  }, [guessedLetters, wrongGuesses, word]);

  const handleLetterGuess = (letter) => {
    if (guessedLetters.has(letter) || gameStatus !== 'playing') return;

    const newGuessedLetters = new Set([...guessedLetters, letter]);
    setGuessedLetters(newGuessedLetters);

    if (!word.includes(letter)) {
      setWrongGuesses(wrongGuesses + 1);
    }
  };

  const renderWord = () => {
    return word.split('').map((letter, index) => (
      <span key={index} className="text-4xl font-bold mx-1 p-2 border-b-2 border-cyan-400 min-w-12 text-center">
        {guessedLetters.has(letter) ? letter : '_'}
      </span>
    ));
  };

  const renderAlphabet = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return alphabet.split('').map(letter => (
      <button
        key={letter}
        onClick={() => handleLetterGuess(letter)}
        disabled={guessedLetters.has(letter) || gameStatus !== 'playing'}
        className={`w-12 h-12 m-1 rounded-lg font-bold transition-all duration-200 ${
          guessedLetters.has(letter)
            ? word.includes(letter)
              ? 'bg-green-600 text-white'
              : 'bg-red-600 text-white'
            : 'bg-purple-700 hover:bg-purple-600 text-white transform hover:scale-105'
        } ${guessedLetters.has(letter) || gameStatus !== 'playing' ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {letter}
      </button>
    ));
  };

  const renderAstronaut = () => {
    return (
      <div className="text-6xl text-center mb-4">
        {wrongGuesses >= 1 && <div>🪐</div>}
        {wrongGuesses >= 2 && <div>👨‍🚀</div>}
        {wrongGuesses >= 3 && <div className="text-red-400">💀</div>}
        {wrongGuesses >= 4 && <div>🚀</div>}
        {wrongGuesses >= 5 && <div>💥</div>}
        {wrongGuesses >= 6 && <div className="text-red-500">☠️</div>}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-3xl font-bold">Galactic Hangman</h2>
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
              Guess the space-themed word by clicking letters. Each wrong guess brings the astronaut closer to danger! You have 6 wrong guesses before the mission fails.
            </p>
          </div>
        )}
        
        <div className="mb-6">
          <p className="text-xl text-cyan-400 mb-2">
            Wrong Guesses: {wrongGuesses} / {MAX_WRONG_GUESSES}
          </p>
          
          {gameStatus === 'won' && (
            <p className="text-2xl text-green-400 font-bold">🎉 Astronaut Saved! 🎉</p>
          )}
          
          {gameStatus === 'lost' && (
            <p className="text-2xl text-red-400 font-bold">💥 Mission Failed! Word was: {word} 💥</p>
          )}
        </div>
      </div>

      {renderAstronaut()}

      <div className="mb-8 flex flex-wrap justify-center">
        {renderWord()}
      </div>

      <div className="mb-8 max-w-md flex flex-wrap justify-center">
        {renderAlphabet()}
      </div>

      <button
        onClick={startNewGame}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
      >
        <RotateCcw size={20} />
        New Mission
      </button>
    </div>
  );
};

export default Hangman;