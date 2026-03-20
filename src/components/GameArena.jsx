import React, { useState, useEffect, useRef, useCallback } from 'react';

const ARENA_WIDTH = 600;
const ARENA_HEIGHT = 400;
const STAR_SIZE = 52;
const MOVE_INTERVAL = 800;
const TOTAL_CLICKS = 5;

function getRandomPosition() {
  const x = Math.floor(Math.random() * (ARENA_WIDTH - STAR_SIZE - 20)) + 10;
  const y = Math.floor(Math.random() * (ARENA_HEIGHT - STAR_SIZE - 20)) + 10;
  return { x, y };
}

// Small twinkling background stars
function BackgroundStars() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 3,
  }));

  return (
    <>
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </>
  );
}

export default function GameArena({ onGameWon, onClickRegistered }) {
  const [gameState, setGameState] = useState('idle'); // idle | playing | won
  const [starPos, setStarPos] = useState({ x: 270, y: 174 });
  const [clicksLeft, setClicksLeft] = useState(TOTAL_CLICKS);
  const [showHit, setShowHit] = useState(false);
  const [hitPos, setHitPos] = useState({ x: 0, y: 0 });
  const intervalRef = useRef(null);

  // Move star on interval
  useEffect(() => {
    if (gameState !== 'playing') return;
    intervalRef.current = setInterval(() => {
      setStarPos(getRandomPosition());
    }, MOVE_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [gameState]);

  const startGame = useCallback(() => {
    setClicksLeft(TOTAL_CLICKS);
    setStarPos(getRandomPosition());
    setGameState('playing');
  }, []);

  const handleStarClick = useCallback((e) => {
    if (gameState !== 'playing') return;
    e.stopPropagation();

    // Show hit flash at click position
    const rect = e.currentTarget.getBoundingClientRect();
    setHitPos({ x: rect.left, y: rect.top });
    setShowHit(true);
    setTimeout(() => setShowHit(false), 400);

    // Move star immediately on click
    setStarPos(getRandomPosition());

    setClicksLeft(prev => {
      const next = prev - 1;
      if (onClickRegistered) onClickRegistered(TOTAL_CLICKS - next);
      if (next === 0) {
        clearInterval(intervalRef.current);
        setGameState('won');
        if (onGameWon) onGameWon();
      }
      return next;
    });
  }, [gameState, onGameWon, onClickRegistered]);

  const resetGame = useCallback(() => {
    clearInterval(intervalRef.current);
    setClicksLeft(TOTAL_CLICKS);
    setGameState('idle');
  }, []);

  const progress = ((TOTAL_CLICKS - clicksLeft) / TOTAL_CLICKS) * 100;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Stats Row */}
      <div className="flex items-center gap-8">
        <div className="text-center">
          <p className="text-xs text-white/40 font-inter uppercase tracking-widest mb-1">Stars Left</p>
          <p className="text-4xl font-bold font-orbitron text-star-gold">{clicksLeft}</p>
        </div>
        <div className="w-px h-12 bg-white/10" />
        <div className="text-center">
          <p className="text-xs text-white/40 font-inter uppercase tracking-widest mb-1">Progress</p>
          <div className="w-40 h-3 bg-space-mid rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gold-gradient rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Game Arena */}
      <div
        className="relative rounded-2xl overflow-hidden border border-white/10"
        style={{
          width: ARENA_WIDTH,
          maxWidth: '100%',
          height: ARENA_HEIGHT,
          background: 'radial-gradient(ellipse at center, #12122a 0%, #0a0a1a 100%)',
          boxShadow: '0 0 60px rgba(124, 58, 237, 0.15), inset 0 0 60px rgba(0,0,0,0.5)',
        }}
      >
        <BackgroundStars />

        {/* Crosshair grid lines (subtle) */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Idle State */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 animate-fade-in">
            <div className="text-6xl animate-float">🚀</div>
            <h2 className="font-orbitron text-2xl font-bold text-white">Ready to Launch?</h2>
            <p className="text-white/50 font-inter text-sm text-center px-6">
              Catch the golden star <span className="text-star-gold">5 times</span> before it escapes!
            </p>
            <button
              onClick={startGame}
              className="mt-2 px-8 py-3 rounded-xl bg-gold-gradient text-space-dark font-bold font-orbitron text-sm
                         hover:brightness-110 transition-all duration-200 shadow-lg shadow-star-gold/30 animate-glow-pulse"
            >
              START GAME
            </button>
          </div>
        )}

        {/* Won State */}
        {gameState === 'won' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 animate-fade-in"
            style={{ background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.08) 0%, transparent 70%)' }}>
            <div className="text-6xl">🏆</div>
            <h2 className="font-orbitron text-2xl font-bold text-star-gold">Mission Complete!</h2>
            <p className="text-white/60 font-inter text-sm">Processing your reward...</p>
            <div className="flex gap-2 mt-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-star-gold animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Playing: The Star Target */}
        {gameState === 'playing' && (
          <button
            onClick={handleStarClick}
            className="absolute transition-all duration-150 ease-out cursor-crosshair hover:scale-110 active:scale-95"
            style={{
              left: starPos.x,
              top: starPos.y,
              width: STAR_SIZE,
              height: STAR_SIZE,
              background: 'none',
              border: 'none',
              padding: 0,
              filter: 'drop-shadow(0 0 12px rgba(251,191,36,0.8))',
            }}
            aria-label="Click the star!"
          >
            <svg viewBox="0 0 24 24" fill="#fbbf24" width={STAR_SIZE} height={STAR_SIZE} className="animate-star-pulse">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            {/* Ripple ring */}
            <div className="absolute inset-0 rounded-full border-2 border-star-gold/30 animate-ping" />
          </button>
        )}

        {/* Hit Flash Indicator */}
        {showHit && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 rounded-2xl border-2 border-star-gold/60 animate-ping" />
          </div>
        )}

        {/* Scanner line when playing */}
        {gameState === 'playing' && (
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nebula-purple/40 to-transparent animate-pulse" />
        )}
      </div>

      {/* Arena Controls */}
      {(gameState === 'playing' || gameState === 'won') && (
        <button
          onClick={resetGame}
          className="text-xs text-white/30 hover:text-white/60 font-inter transition-colors duration-200 underline underline-offset-2"
        >
          Reset Game
        </button>
      )}
    </div>
  );
}
