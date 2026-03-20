import React from 'react';

function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-white/5 last:border-0">
      <span className="text-sm text-white/50 font-inter">{label}</span>
      <span className={`text-sm font-bold font-mono ${highlight ? 'text-star-gold' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}

export default function ResultScreen({ status, txHash, balanceBefore, balanceAfter, error, onPlayAgain }) {
  const explorerUrl = txHash
    ? `https://stellar.expert/explorer/testnet/tx/${txHash}`
    : null;

  const shortHash = txHash
    ? `${txHash.slice(0, 10)}...${txHash.slice(-10)}`
    : null;

  if (status === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 animate-fade-in">
        {/* Spinner */}
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-4 border-space-card" />
          <div className="absolute inset-0 rounded-full border-4 border-t-star-gold border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full border-2 border-nebula-purple/40 animate-spin-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl">⭐</span>
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-orbitron text-lg font-bold text-white">Processing Transaction</h3>
          <p className="text-white/50 font-inter text-sm mt-1">Submitting to Stellar Testnet...</p>
        </div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-nebula-purple animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-6 py-12 animate-fade-in max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-full bg-danger-red/10 border border-danger-red/30 flex items-center justify-center">
          <span className="text-3xl">❌</span>
        </div>
        <div className="text-center">
          <h3 className="font-orbitron text-lg font-bold text-danger-red">Transaction Failed</h3>
          <p className="text-white/50 font-inter text-sm mt-2 leading-relaxed">{error || 'An unexpected error occurred.'}</p>
        </div>
        <button
          onClick={onPlayAgain}
          className="px-6 py-2.5 rounded-lg border border-white/20 text-white/70 text-sm font-inter 
                     hover:border-star-gold/50 hover:text-star-gold transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (status === 'success') {
    const gainedXLM = balanceBefore && balanceAfter
      ? (parseFloat(balanceAfter) - parseFloat(balanceBefore)).toFixed(2)
      : null;

    return (
      <div className="w-full max-w-md mx-auto animate-slide-up">
        {/* Trophy header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float inline-block">🏆</div>
          <h2 className="font-orbitron text-2xl font-bold bg-gradient-to-r from-star-gold to-star-gold-light bg-clip-text text-transparent">
            Mission Accomplished!
          </h2>
          <p className="text-white/50 font-inter text-sm mt-2">
            You proved you're human and earned your reward.
          </p>
        </div>

        {/* Reward badge */}
        <div className="relative rounded-2xl p-6 mb-5 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(251,191,36,0.12) 0%, rgba(124,58,237,0.08) 100%)',
            border: '1px solid rgba(251,191,36,0.25)',
          }}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-star-gold/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="text-center">
            <p className="text-xs text-white/40 font-inter uppercase tracking-widest mb-1">Reward Received</p>
            <p className="font-orbitron text-4xl font-bold text-star-gold">+10 XLM</p>
            {gainedXLM && (
              <p className="text-xs text-success-green font-mono mt-1">({gainedXLM > 0 ? '+' : ''}{gainedXLM} actual)</p>
            )}
          </div>
        </div>

        {/* Transaction details card */}
        <div className="rounded-2xl bg-space-card border border-white/8 p-5 mb-5">
          <h4 className="text-xs text-white/40 font-inter uppercase tracking-widest mb-3">Transaction Details</h4>

          {balanceBefore && (
            <InfoRow label="Balance Before" value={`${balanceBefore} XLM`} />
          )}
          {balanceAfter && (
            <InfoRow label="Balance After" value={`${balanceAfter} XLM`} highlight />
          )}

          {txHash && (
            <div className="pt-3">
              <p className="text-xs text-white/40 font-inter uppercase tracking-widest mb-2">Transaction Hash</p>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-space-mid border border-nebula-purple/30 px-3 py-2.5
                           text-xs font-mono text-nebula-blue hover:text-star-gold hover:border-star-gold/30
                           transition-all duration-200 truncate"
                title={txHash}
              >
                🔗 {shortHash}
              </a>
              <p className="text-xs text-white/30 mt-1 font-inter">↗ Opens in Stellar Expert (Testnet)</p>
            </div>
          )}
        </div>

        {/* Play again */}
        <button
          onClick={onPlayAgain}
          className="w-full py-3 rounded-xl bg-gold-gradient text-space-dark font-bold font-orbitron text-sm
                     hover:brightness-110 transition-all duration-200 shadow-lg shadow-star-gold/20"
        >
          PLAY AGAIN 🚀
        </button>
      </div>
    );
  }

  return null;
}
