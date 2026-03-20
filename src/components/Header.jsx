import React from 'react';

function shortenAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
}

export default function Header({ connected, publicKey, balance, onConnect, onDisconnect, loading }) {
  return (
    <header className="w-full border-b border-white/10 bg-space-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-3xl animate-star-pulse inline-block">⭐</span>
          </div>
          <div>
            <h1 className="font-orbitron text-xl font-bold bg-gradient-to-r from-star-gold to-star-gold-light bg-clip-text text-transparent">
              STELLAR SPEED-RUN
            </h1>
            <p className="text-xs text-white/40 font-inter">Proof of Humanity · Testnet</p>
          </div>
        </div>

        {/* Wallet Section */}
        <div className="flex items-center gap-4">
          {connected && (
            <div className="hidden sm:flex flex-col items-end gap-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success-green animate-pulse" />
                <span className="text-xs text-white/60 font-inter font-mono">
                  {shortenAddress(publicKey)}
                </span>
              </div>
              {balance !== null && (
                <span className="text-sm font-bold text-star-gold font-orbitron">
                  {balance} XLM
                </span>
              )}
            </div>
          )}

          {connected ? (
            <button
              onClick={onDisconnect}
              className="px-4 py-2 rounded-lg border border-danger-red/50 text-danger-red text-sm font-inter font-medium 
                         hover:bg-danger-red/10 transition-all duration-200 hover:border-danger-red"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={onConnect}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-gold-gradient text-space-dark text-sm font-inter font-bold
                         hover:brightness-110 transition-all duration-200 disabled:opacity-50 disabled:cursor-wait
                         shadow-lg shadow-star-gold/20 animate-glow-pulse"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Connecting...
                </span>
              ) : '🔗 Connect Wallet'}
            </button>
          )}
        </div>
      </div>

      {/* Mobile balance strip */}
      {connected && (
        <div className="sm:hidden border-t border-white/5 px-6 py-2 flex items-center justify-between">
          <span className="text-xs text-white/50 font-mono">{shortenAddress(publicKey)}</span>
          <span className="text-sm font-bold text-star-gold font-orbitron">{balance} XLM</span>
        </div>
      )}
    </header>
  );
}
