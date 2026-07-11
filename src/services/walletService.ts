import { APP_DISCONNECTED_SESSION_KEY, GENLAYER_BRADBURY } from '../config/genlayer';
import type { Eip1193Provider } from '../types';

export class WalletServiceError extends Error {
  code?: number | string;

  constructor(message: string, code?: number | string) {
    super(message);
    this.name = 'WalletServiceError';
    this.code = code;
  }
}

export function getInjectedProvider(): Eip1193Provider | null {
  if (typeof window === 'undefined') return null;
  return window.ethereum ?? null;
}

export function getProviderAvailable() {
  return Boolean(getInjectedProvider());
}

export function normalizeAddress(address: unknown): string | null {
  if (typeof address !== 'string') return null;
  const trimmed = address.trim();
  return /^0x[a-fA-F0-9]{40}$/.test(trimmed) ? trimmed : null;
}

export function addressesEqual(left: string | null | undefined, right: string | null | undefined) {
  return Boolean(left && right && left.toLowerCase() === right.toLowerCase());
}

export function shortAddress(address: string | null | undefined) {
  if (!address) return null;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function parseChainId(chainId: unknown): number | null {
  if (typeof chainId === 'number' && Number.isFinite(chainId)) return chainId;
  if (typeof chainId !== 'string') return null;
  if (chainId.startsWith('0x')) {
    const parsed = Number.parseInt(chainId, 16);
    return Number.isFinite(parsed) ? parsed : null;
  }
  const parsed = Number.parseInt(chainId, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function requestAccounts(provider: Eip1193Provider) {
  const accounts = await provider.request<unknown>({ method: 'eth_requestAccounts' });
  return parseAccounts(accounts);
}

export async function getAuthorizedAccounts(provider: Eip1193Provider) {
  const accounts = await provider.request<unknown>({ method: 'eth_accounts' });
  return parseAccounts(accounts);
}

export async function getChainId(provider: Eip1193Provider) {
  const chainId = await provider.request<unknown>({ method: 'eth_chainId' });
  return parseChainId(chainId);
}

export async function switchToBradbury(provider: Eip1193Provider) {
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: GENLAYER_BRADBURY.chainIdHex }],
    });
  } catch (error) {
    const code = getWalletErrorCode(error);
    if (code === 4902 || code === '4902') {
      await addBradburyChain(provider);
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: GENLAYER_BRADBURY.chainIdHex }],
      });
      return;
    }
    throw normalizeWalletError(error);
  }
}

export async function addBradburyChain(provider: Eip1193Provider) {
  await provider.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: GENLAYER_BRADBURY.chainIdHex,
        chainName: GENLAYER_BRADBURY.networkName,
        nativeCurrency: GENLAYER_BRADBURY.nativeCurrency,
        rpcUrls: [GENLAYER_BRADBURY.evmRpcUrl],
        blockExplorerUrls: [GENLAYER_BRADBURY.explorerUrl],
      },
    ],
  });
}

export function isAppSessionDisconnected() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(APP_DISCONNECTED_SESSION_KEY) === 'true';
}

export function setAppSessionDisconnected(disconnected: boolean) {
  if (typeof window === 'undefined') return;
  if (disconnected) {
    window.localStorage.setItem(APP_DISCONNECTED_SESSION_KEY, 'true');
  } else {
    window.localStorage.removeItem(APP_DISCONNECTED_SESSION_KEY);
  }
}

export function friendlyWalletError(error: unknown) {
  const normalized = normalizeWalletError(error);
  if (normalized.code === 4001 || normalized.code === '4001') {
    return 'Wallet request was cancelled.';
  }
  if (normalized.message === 'NO_PROVIDER') {
    return 'No compatible browser wallet was detected.';
  }
  if (normalized.message === 'NO_ACCOUNTS') {
    return 'No wallet account is currently available.';
  }
  if (normalized.message === 'MALFORMED_RESPONSE') {
    return 'The wallet returned an unexpected response.';
  }
  return normalized.message || 'Something went wrong while talking to the wallet.';
}

export function normalizeWalletError(error: unknown) {
  if (error instanceof WalletServiceError) return error;
  if (typeof error === 'object' && error !== null) {
    const maybeError = error as { code?: number | string; message?: string };
    if (maybeError.message) {
      return new WalletServiceError(maybeError.message, maybeError.code);
    }
  }
  return new WalletServiceError('Unknown wallet error.');
}

export function parseAccounts(accounts: unknown) {
  if (!Array.isArray(accounts)) {
    throw new WalletServiceError('MALFORMED_RESPONSE');
  }
  return accounts.map(normalizeAddress).filter((account): account is string => Boolean(account));
}

function getWalletErrorCode(error: unknown) {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    return (error as { code?: number | string }).code;
  }
  return undefined;
}
