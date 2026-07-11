export type AppPage = 'landing' | 'board' | 'detail' | 'profile';

export type TaskCategory = 'Developer' | 'Design' | 'Writing' | 'Marketing' | string;

export type TaskStatus =
  | 'Available'
  | 'Accepted'
  | 'Under GenLayer Review'
  | 'Waiting for Client Review'
  | 'Needs Revision'
  | 'Completed'
  | 'Cancelled';

export interface Submission {
  workUrl: string;
  notes: string;
  screenshotName: string | null;
}

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  description: string;
  requirements: string;
  reward: number;
  deadline: string;
  publisher: string;
  publisherAddress: string;
  status: TaskStatus;
  acceptedBy: string | null;
  submission?: Submission | null;
  clientScore?: number;
}

export interface Receipt {
  id: string;
  title: string;
  category: TaskCategory;
  reward: number;
  status: TaskStatus;
  clientScore?: number;
}

export interface UserProfile {
  address: string;
  username: string;
  bio: string;
  contributorScore: number;
  clientScore: number;
  acceptedTasksCount: number;
  publishedTasksCount: number;
  completedReceiptsCount: number;
  completionRate: string;
}

export type ToastType = 'success' | 'warning' | 'info';

export interface ToastState {
  text: string;
  type: ToastType;
}

export interface PublishTaskFormState {
  title: string;
  category: string;
  description: string;
  reward: number;
  deadline: string;
  requirements: string;
}

export interface SubmitWorkFormState {
  workUrl: string;
  notes: string;
  screenshotName: string | null;
  isDragging: boolean;
}

export interface Eip1193Provider {
  request: <T = unknown>(args: { method: string; params?: unknown[] | Record<string, unknown> }) => Promise<T>;
  on?: (event: 'accountsChanged' | 'chainChanged', handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: 'accountsChanged' | 'chainChanged', handler: (...args: unknown[]) => void) => void;
}

export interface WalletState {
  providerAvailable: boolean;
  address: string | null;
  shortAddress: string | null;
  chainId: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  isCorrectNetwork: boolean;
  error: string | null;
}

export interface WalletHookState extends WalletState {
  connect: () => Promise<void>;
  disconnectSession: () => void;
  switchToBradbury: () => Promise<void>;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}
