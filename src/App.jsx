import React, { useState, useCallback, useRef } from 'react';
import Header from './components/Header';
import GameArena from './components/GameArena';
import ResultScreen from './components/ResultScreen';
import { useFreighter } from './hooks/useFreighter';
import { sendXLM } from './utils/stellar';

// Game phases: idle | playing | processing | success | error
export default function App() {
  // const {
  //   connected,
  //   publicKey,
  //   balance,
  //   loading: walletLoading,
  //   error: walletError,
  //   connect,
  //   disconnect,
  //   refreshBalance,
  // } = useFreighter();

  const connected = true;
  const publicKey = "GDWEPALISZUCPFU2DYTWS...EIZRTCQKH";
  const balance = "95.50";
  const walletLoading = false;
  const walletError = null;
  const connect = () => {};
  const disconnect = () => {};
  const refreshBalance = () => "105.50";

  const [gamePhase, setGamePhase] = useState('playing');
  const [txHash, setTxHash] = useState(null);
  const [txError, setTxError] = useState(null);
  const [balanceBefore, setBalanceBefore] = useState("95.50");
  const [balanceAfter, setBalanceAfter] = useState(null);
  const [connectError, setConnectError] = useState(null);

  // Called when user wins the game (5th star clicked)
  const handleGameWon = useCallback(async () => {
    if (!connected || !publicKey) return;

    setBalanceBefore(balance);
    setGamePhase('processing');
    setTxHash(null);
    setTxError(null);

    try {
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const dummyTxHash = "76e32d65fb449d87dcb60f0e3c066e5deec87acf55eb24e6fa58d113905b14f1";
      setTxHash(dummyTxHash);

      // Refresh balance after transaction (simulated)
      setBalanceAfter("105.50");

      setGamePhase('success');
    } catch (err) {
      console.error('Transaction error:', err);
      setTxError(err.message || 'Transaction failed. Please try again.');
      setGamePhase('error');
    }
  }, [connected, publicKey, balance, refreshBalance]);

  const handlePlayAgain = useCallback(() => {
    setGamePhase('idle');
    setTxHash(null);
    setTxError(null);
    setBalanceBefore(null);
    setBalanceAfter(null);
  }, []);

  const handleConnect = useCallback(async () => {
    setConnectError(null);
    await connect();
  }, [connect]);

  const isInGame = gamePhase === 'playing';
  const showResult = ['processing', 'success', 'error'].includes(gamePhase);

  return (
    <div className="min-h-screen bg-space-dark font-inter text-white overflow-x-hidden">
      {/* Stars background layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 1.5 + 0.5}px`,
              height: `${Math.random() * 1.5 + 0.5}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              opacity: Math.random() * 0.7 + 0.1,
            }}
          />
        ))}
      </div>

      <Header
        connected={connected}
        publicKey={publicKey}
        balance={balance}
        onConnect={handleConnect}
        onDisconnect={disconnect}
        loading={walletLoading}
      />

      <main className="relative max-w-4xl mx-auto px-4 py-12">
        {/* Page Title */}
        {!isInGame && !showResult && (
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nebula-purple/10 border border-nebula-purple/30 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-nebula-purple animate-pulse" />
              <span className="text-xs text-nebula-purple font-inter font-medium tracking-wider uppercase">
                Proof of Humanity · Level 1
              </span>
            </div>
            <h2 className="font-orbitron text-4xl md:text-5xl font-black leading-tight mb-4">
              <span className="bg-gradient-to-r from-white via-star-gold-light to-star-gold bg-clip-text text-transparent">
                Catch the Star.
              </span>
              <br />
              <span className="text-white/80">Earn XLM.</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto font-inter leading-relaxed">
              Connect your Freighter wallet, click the golden star 5 times, and receive
              <span className="text-star-gold font-semibold"> 10 XLM</span> on the Stellar Testnet.
            </p>
          </div>
        )}

        {/* Wallet Error Alert */}
        {(walletError || connectError) && (
          <div className="max-w-lg mx-auto mb-6 rounded-xl bg-danger-red/10 border border-danger-red/30 px-4 py-3 animate-fade-in">
            <p className="text-sm text-danger-red font-inter">
              ⚠️ {walletError || connectError}
            </p>
          </div>
        )}

        {/* Not Connected CTA */}
        {!connected && !showResult && (
          <div className="flex flex-col items-center gap-8 animate-fade-in">
            {/* Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mt-4">
              {[
                { icon: '🔗', title: 'Connect Wallet', desc: 'Link your Freighter wallet in one click' },
                { icon: '⭐', title: 'Catch 5 Stars', desc: 'Click the moving star before it escapes' },
                { icon: '💰', title: 'Earn 10 XLM', desc: 'Get an instant Testnet XLM payment' },
              ].map((card) => (
                <div key={card.title}
                  className="rounded-2xl bg-space-card/60 border border-white/8 p-5 text-center backdrop-blur-sm
                             hover:border-star-gold/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h3 className="font-orbitron text-sm font-bold text-white mb-1">{card.title}</h3>
                  <p className="text-xs text-white/40 font-inter leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleConnect}
              disabled={walletLoading}
              className="px-10 py-4 rounded-2xl bg-gold-gradient text-space-dark font-bold font-orbitron text-base
                         hover:brightness-110 transition-all duration-200 shadow-xl shadow-star-gold/30 animate-glow-pulse
                         disabled:opacity-50 disabled:cursor-wait"
            >
              {walletLoading ? '⏳ Connecting...' : '🔗 Connect Freighter Wallet'}
            </button>

            <p className="text-xs text-white/25 font-inter">
              Don't have Freighter?{' '}
              <a href="https://freighter.app" target="_blank" rel="noopener noreferrer"
                className="underline hover:text-white/50 transition-colors">
                freighter.app
              </a>
            </p>
          </div>
        )}

        {/* Game is ready to start or playing */}
        {connected && !showResult && (
          <div className="flex flex-col items-center gap-6 animate-fade-in">
            <GameArena
              onGameWon={handleGameWon}
            />
            <p className="text-xs text-white/30 font-inter text-center max-w-sm">
              ⚡ On 5th catch, 10 XLM will be sent from the Master Wallet to your address on Stellar Testnet
            </p>
          </div>
        )}

        {/* Result Screen */}
        {showResult && (
          <div className="flex flex-col items-center animate-fade-in">
            <ResultScreen
              status={gamePhase}
              txHash={txHash}
              balanceBefore={balanceBefore}
              balanceAfter={balanceAfter}
              error={txError}
              onPlayAgain={handlePlayAgain}
            />
          </div>
        )}

        {/* Footer note */}
        <div className="mt-16 text-center">
          <p className="text-xs text-white/15 font-inter">
            ⚠️ This is a Testnet demo. XLM has no real value. Master key is for educational purposes only.
          </p>
        </div>
      </main>
    </div>
  );
}
