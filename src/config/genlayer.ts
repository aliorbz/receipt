export const GENLAYER_BRADBURY = {
  networkName: 'GenLayer Bradbury Testnet',
  networkIdentifier: 'testnetBradbury',
  chainId: 4221,
  chainIdHex: '0x107d',
  nativeCurrency: {
    name: 'GEN',
    symbol: 'GEN',
    decimals: 18,
  },
  genlayerRpcUrl: 'https://rpc-bradbury.genlayer.com',
  evmRpcUrl: 'https://rpc.testnet-chain.genlayer.com',
  explorerUrl: 'https://explorer.testnet-chain.genlayer.com',
} as const;

export const APP_DISCONNECTED_SESSION_KEY = 'receipt.walletDisconnectedSession';
