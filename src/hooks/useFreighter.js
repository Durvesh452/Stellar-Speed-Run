import { useState, useCallback } from 'react';
import {
  isConnected,
  getPublicKey,
  getNetwork,
} from '@stellar/freighter-api';
import { getBalance } from '../utils/stellar';

export function useFreighter() {
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refreshBalance = useCallback(async (pk) => {
    const key = pk || publicKey;
    if (!key) return;
    try {
      const bal = await getBalance(key);
      setBalance(bal);
      return bal;
    } catch (err) {
      console.error('Balance fetch error:', err);
      return null;
    }
  }, [publicKey]);

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if Freighter is installed
      const hasFreighter = await isConnected();
      console.log('Freighter isConnected:', hasFreighter);
      
      const isFreighterConnected = typeof hasFreighter === 'boolean' ? hasFreighter : hasFreighter?.isConnected;
      
      if (!isFreighterConnected) {
        throw new Error(
          'Freighter wallet not found. Please install it from freighter.app or unlock your extension.'
        );
      }

      // Request authorization/access (Required in v6+)
      console.log('Requesting access...');
      if (typeof window.freighterApi?.requestAccess === 'function') {
        const accessStr = await window.freighterApi.requestAccess();
        console.log('Access response:', accessStr);
        if (accessStr && accessStr.error) {
           throw new Error(accessStr.error);
        }
      }

      // Get public key
      console.log('Getting public key...');
      const pkResult = await getPublicKey();
      console.log('Public key result:', pkResult);
      
      if (pkResult && pkResult.error) throw new Error(pkResult.error);
      const pk = typeof pkResult === 'string' ? pkResult : pkResult?.publicKey;
      
      if (!pk) {
         throw new Error('Failed to retrieve public key from Freighter. Make sure you granted access.');
      }

      // Verify network (Testnet required for this app)
      const networkResult = await getNetwork();
      if (networkResult && networkResult.error) throw new Error(networkResult.error);
      
      const currentNetwork = typeof networkResult === 'string' ? networkResult : networkResult?.network;
      if (!currentNetwork || !currentNetwork.toUpperCase().includes('TESTNET')) {
        throw new Error(
          'Please switch your Freighter wallet to the Stellar Testnet network.'
        );
      }

      setPublicKey(pk);
      setConnected(true);

      // Fetch balance
      const bal = await getBalance(pk);
      setBalance(bal);
    } catch (err) {
      setError(err.message || 'Connection failed');
      setConnected(false);
      setPublicKey(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setConnected(false);
    setPublicKey(null);
    setBalance(null);
    setError(null);
  }, []);

  return {
    connected,
    publicKey,
    balance,
    loading,
    error,
    connect,
    disconnect,
    refreshBalance,
  };
}
