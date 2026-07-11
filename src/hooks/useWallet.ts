import { useCallback, useEffect, useMemo, useState } from 'react';
import { GENLAYER_BRADBURY } from '../config/genlayer';
import type { WalletState } from '../types';
import {
  friendlyWalletError,
  getAuthorizedAccounts,
  getChainId,
  getInjectedProvider,
  getProviderAvailable,
  isAppSessionDisconnected,
  parseChainId,
  requestAccounts,
  setAppSessionDisconnected,
  shortAddress,
  switchToBradbury as switchProviderToBradbury,
} from '../services/walletService';

const DEFAULT_WALLET_STATE: WalletState = {
  providerAvailable: false,
  address: null,
  shortAddress: null,
  chainId: null,
  isConnected: false,
  isConnecting: false,
  isCorrectNetwork: false,
  error: null,
};

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>(DEFAULT_WALLET_STATE);

  const setWalletAddressAndChain = useCallback((address: string | null, chainId: number | null) => {
    setWallet(prev => ({
      ...prev,
      providerAvailable: getProviderAvailable(),
      address,
      shortAddress: shortAddress(address),
      chainId,
      isConnected: Boolean(address),
      isCorrectNetwork: chainId === GENLAYER_BRADBURY.chainId,
      error: null,
    }));
  }, []);

  const refreshChain = useCallback(async () => {
    const provider = getInjectedProvider();
    if (!provider) {
      setWallet(prev => ({
        ...prev,
        providerAvailable: false,
        chainId: null,
        isCorrectNetwork: false,
      }));
      return;
    }

    const chainId = await getChainId(provider);
    setWallet(prev => ({
      ...prev,
      providerAvailable: true,
      chainId,
      isCorrectNetwork: chainId === GENLAYER_BRADBURY.chainId,
    }));
  }, []);

  const connect = useCallback(async () => {
    const provider = getInjectedProvider();
    if (!provider) {
      const message = 'No compatible browser wallet was detected.';
      setWallet(prev => ({
        ...prev,
        providerAvailable: false,
        error: message,
      }));
      throw new Error(message);
    }

    setWallet(prev => ({
      ...prev,
      providerAvailable: true,
      isConnecting: true,
      error: null,
    }));

    try {
      const accounts = await requestAccounts(provider);
      if (accounts.length === 0) {
        throw new Error('NO_ACCOUNTS');
      }
      const chainId = await getChainId(provider);
      setAppSessionDisconnected(false);
      setWalletAddressAndChain(accounts[0], chainId);
    } catch (error) {
      const message = friendlyWalletError(error);
      setWallet(prev => ({
        ...prev,
        isConnecting: false,
        error: message,
      }));
      throw new Error(message);
    } finally {
      setWallet(prev => ({
        ...prev,
        isConnecting: false,
      }));
    }
  }, [setWalletAddressAndChain]);

  const disconnectSession = useCallback(() => {
    setAppSessionDisconnected(true);
    setWallet(prev => ({
      ...DEFAULT_WALLET_STATE,
      providerAvailable: prev.providerAvailable,
    }));
  }, []);

  const switchToBradbury = useCallback(async () => {
    const provider = getInjectedProvider();
    if (!provider) {
      const message = 'No compatible browser wallet was detected.';
      setWallet(prev => ({ ...prev, providerAvailable: false, error: message }));
      throw new Error(message);
    }

    setWallet(prev => ({ ...prev, error: null }));
    try {
      await switchProviderToBradbury(provider);
      await refreshChain();
    } catch (error) {
      const message = friendlyWalletError(error);
      setWallet(prev => ({ ...prev, error: message }));
      throw new Error(message);
    }
  }, [refreshChain]);

  useEffect(() => {
    const provider = getInjectedProvider();
    if (!provider) {
      setWallet(prev => ({
        ...prev,
        providerAvailable: false,
      }));
      return;
    }

    let cancelled = false;

    const restoreAuthorizedSession = async () => {
      setWallet(prev => ({
        ...prev,
        providerAvailable: true,
      }));

      if (isAppSessionDisconnected()) return;

      try {
        const [accounts, chainId] = await Promise.all([
          getAuthorizedAccounts(provider),
          getChainId(provider),
        ]);
        if (!cancelled && accounts.length > 0) {
          setWalletAddressAndChain(accounts[0], chainId);
        }
      } catch (error) {
        console.warn('Unable to restore wallet session', error);
      }
    };

    const handleAccountsChanged = (...args: unknown[]) => {
      const accounts = Array.isArray(args[0]) ? args[0] : [];
      const nextAddress = typeof accounts[0] === 'string' ? accounts[0] : null;
      if (!nextAddress) {
        setWallet(prev => ({
          ...prev,
          address: null,
          shortAddress: null,
          isConnected: false,
          error: null,
        }));
        return;
      }

      setAppSessionDisconnected(false);
      setWallet(prev => ({
        ...prev,
        address: nextAddress,
        shortAddress: shortAddress(nextAddress),
        isConnected: true,
        error: null,
      }));
    };

    const handleChainChanged = (...args: unknown[]) => {
      const chainId = parseChainId(args[0]);
      setWallet(prev => ({
        ...prev,
        chainId,
        isCorrectNetwork: chainId === GENLAYER_BRADBURY.chainId,
      }));
    };

    restoreAuthorizedSession();
    provider.on?.('accountsChanged', handleAccountsChanged);
    provider.on?.('chainChanged', handleChainChanged);

    return () => {
      cancelled = true;
      provider.removeListener?.('accountsChanged', handleAccountsChanged);
      provider.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [setWalletAddressAndChain]);

  return useMemo(
    () => ({
      ...wallet,
      connect,
      disconnectSession,
      switchToBradbury,
    }),
    [connect, disconnectSession, switchToBradbury, wallet],
  );
}
