import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Zap, Info } from 'lucide-react';

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog",
  "In a galaxy far far away, brave heroes fight for justice",
  "Space exploration has always fascinated humanity throughout history",
  "Typing fast requires practice, patience, and proper finger placement",
  "Cosmic adventures await those who dare to dream beyond stars"
];

const TypingTest = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [showInstructions, setShowInstructions] = useState(false);
  const inputRef = useRef(null);

  const startGame = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);
    setUserInput('');
    setTimeLeft(60);
    setGameStarted(true);
    setGameEnded(false);
    setWpm(0);
    setAccuracy(100);
    inputRef.current?.focus();
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameEnded(false);
    setUserInput('');
    setText('');
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
  };

  const calculateStats = () => {
    const wordsTyped = userInput.trim().split(' ').length;
    const timeElapsed = 60 - timeLeft;
    const currentWpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
    
    let correctChars = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (i < text.length && userInput[i] === text[i]) {
        correctChars++;
      }
    }
    
    const currentAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;
    
    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
  };

  useEffect(() => {
    calculateStats();
  }, [userInput, timeLeft]);

  useEffect(() => {
    let timer;
    if (gameStarted && timeLeft > 0 && !gameEnded) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setGameEnded(true);
      setGameStarted(false);
    }
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft, gameEnded]);

  const handleInputChange = (e) => {
    if (!gameStarted) return;
    setUserInput(e.target.value);
    
    if (e.target.value === text) {
      setGameEnded(true);
      setGameStarted(false);
    }
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = 'text-gray-400';
      
      if (index < userInput.length) {
        className = userInput[index] === char ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20';
      } else if (index === userInput.length) {
        className = 'text-white bg-cyan-400/50 animate-pulse';
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <h2 className="text-3xl font-bold">Hyperspeed Typing</h2>
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
              Type the displayed text as fast and accurately as possible. You have 60 seconds to complete the challenge. Green letters are correct, red letters are mistakes!
            </p>
          </div>
        )}
        
        <div className="flex justify-center gap-8 mb-6">
          <div className="text-center">
            <p className="text-cyan-400 font-semibold">WPM</p>
            <p className="text-2xl font-bold">{wpm}</p>
          </div>
          <div className="text-center">
            <p className="text-green-400 font-semibold">Accuracy</p>
            <p className="text-2xl font-bold">{accuracy}%</p>
          </div>
          <div className="text-center">
            <p className="text-yellow-400 font-semibold">Time</p>
            <p className="text-2xl font-bold">{timeLeft}s</p>
          </div>
        </div>

        {gameEnded && (
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-800 to-blue-800 rounded-lg">
            <p className="text-2xl text-green-400 font-bold mb-2">🚀 Test Complete! 🚀</p>
            <p className="text-lg">Final Speed: {wpm} WPM | Accuracy: {accuracy}%</p>
          </div>
        )}
      </div>

      {!gameStarted && !gameEnded && (
        <button
          onClick={startGame}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 mb-8"
        >
          <Zap size={20} />
          Start Typing Test
        </button>
      )}

      {(gameStarted || gameEnded) && (
        <>
          <div className="w-full max-w-2xl mb-6 p-6 bg-black/30 border border-purple-500 rounded-lg">
            <div className="text-lg leading-relaxed font-mono">
              {renderText()}
            </div>
          </div>

          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            disabled={!gameStarted}
            className="w-full max-w-2xl h-32 p-4 bg-purple-800/50 border border-purple-500 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-cyan-400 font-mono"
            placeholder="Start typing here..."
          />
        </>
      )}

      <button
        onClick={resetGame}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 mt-6"
      >
        <RotateCcw size={20} />
        Reset Test
      </button>
    </div>
  );
};

export default TypingTest;