import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { LoadingOverlay } from './components/feedback/LoadingOverlay';
import { Toast } from './components/feedback/Toast';
import { FooterNav } from './components/layout/FooterNav';
import { Navbar } from './components/layout/Navbar';
import { PublishTaskModal } from './components/modals/PublishTaskModal';
import { CURRENT_USER_ADDRESS, INITIAL_TASKS_LIST, INITIAL_USER_PROFILE } from './data/mockData';
import { useWallet } from './hooks/useWallet';
import { LandingScreen } from './screens/LandingScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { TaskBoardScreen } from './screens/TaskBoardScreen';
import { TaskDetailScreen } from './screens/TaskDetailScreen';
import type {
  AppPage,
  PublishTaskFormState,
  SubmitWorkFormState,
  Task,
  ToastState,
  ToastType,
  UserProfile,
} from './types';
import { addressesEqual } from './services/walletService';

const DEFAULT_PUBLISH_FORM: PublishTaskFormState = {
  title: '',
  category: 'Developer',
  description: '',
  reward: 3,
  deadline: '',
  requirements: '',
};

const DEFAULT_SUBMIT_FORM: SubmitWorkFormState = {
  workUrl: '',
  notes: '',
  screenshotName: null,
  isDragging: false,
};

export default function App() {
  const wallet = useWallet();
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS_LIST);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<ToastState | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishForm, setPublishForm] = useState<PublishTaskFormState>(DEFAULT_PUBLISH_FORM);
  const [submitForm, setSubmitForm] = useState<SubmitWorkFormState>(DEFAULT_SUBMIT_FORM);
  const [validationStep, setValidationStep] = useState(0);
  const [isBoardLoading, setIsBoardLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState(false);
  const activeIdentityAddressRef = useRef(CURRENT_USER_ADDRESS);
  const previousWalletAddressRef = useRef<string | null>(null);
  const previousChainIdRef = useRef<number | null>(null);

  const currentUserAddress = wallet.address ?? activeIdentityAddressRef.current;
  const selectedTask = tasks.find(task => task.id === selectedTaskId);

  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const triggerToast = (text: string, type: ToastType = 'info') => {
    setToastMessage({ text, type });
  };

  useEffect(() => {
    if (!wallet.address) return;

    const previousAddress = activeIdentityAddressRef.current;
    activeIdentityAddressRef.current = wallet.address;

    setUserProfile(prev => ({
      ...prev,
      address: wallet.address!,
    }));

    setTasks(prev =>
      prev.map(task => ({
        ...task,
        publisherAddress: addressesEqual(task.publisherAddress, previousAddress) ? wallet.address! : task.publisherAddress,
        acceptedBy: addressesEqual(task.acceptedBy, previousAddress) ? wallet.address! : task.acceptedBy,
      })),
    );
  }, [wallet.address]);

  useEffect(() => {
    const previousAddress = previousWalletAddressRef.current;
    if (previousAddress && !wallet.address) {
      triggerToast('Wallet account is no longer available. Receipt was disconnected for this session.', 'warning');
    } else if (previousAddress && wallet.address && !addressesEqual(previousAddress, wallet.address)) {
      triggerToast('Wallet account changed.', 'info');
    }
    previousWalletAddressRef.current = wallet.address;
  }, [wallet.address]);

  useEffect(() => {
    const previousChainId = previousChainIdRef.current;
    if (wallet.isConnected && previousChainId !== null && wallet.chainId !== previousChainId) {
      if (wallet.isCorrectNetwork) {
        triggerToast('Wallet is on GenLayer Bradbury Testnet.', 'success');
      } else {
        triggerToast('Wallet is connected to a different network. Switch to Bradbury before onchain actions.', 'warning');
      }
    }
    previousChainIdRef.current = wallet.chainId;
  }, [wallet.chainId, wallet.isConnected, wallet.isCorrectNetwork]);

  const navigateToPage = (page: AppPage) => {
    setSelectedTaskId(null);
    setIsProfileMenuOpen(false);
    setIsSubmitFormOpen(false);

    if (page === 'board') {
      setIsBoardLoading(true);
      setCurrentPage('board');
      setTimeout(() => setIsBoardLoading(false), 600);
      return;
    }

    if (page === 'profile') {
      setIsProfileLoading(true);
      setCurrentPage('profile');
      setTimeout(() => setIsProfileLoading(false), 600);
      return;
    }

    setCurrentPage(page);
  };

  const viewTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setCurrentPage('detail');
    setIsProfileMenuOpen(false);
  };

  const handleConnectWallet = async () => {
    setLoadingAction('Connecting secure wallet...');
    try {
      await wallet.connect();
      setCurrentPage('board');
      triggerToast('Wallet connected.', 'success');
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : 'Unable to connect wallet.', 'warning');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDisconnectWallet = () => {
    wallet.disconnectSession();
    setCurrentPage('landing');
    setIsProfileMenuOpen(false);
    triggerToast('Receipt disconnected for this app session. Wallet permissions were not revoked.', 'info');
  };

  const handleSwitchNetwork = async () => {
    setLoadingAction('Switching to GenLayer Bradbury...');
    try {
      await wallet.switchToBradbury();
      triggerToast('Switched to GenLayer Bradbury Testnet.', 'success');
    } catch (error) {
      triggerToast(error instanceof Error ? error.message : 'Unable to switch network.', 'warning');
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePublishTask = (event: React.FormEvent) => {
    event.preventDefault();

    if (!publishForm.title || !publishForm.description || !publishForm.deadline) {
      triggerToast('Please fill out all required fields', 'warning');
      return;
    }

    if (publishForm.reward < 1 || publishForm.reward > 5) {
      triggerToast('Reward must be between 1 and 5 GEN', 'warning');
      return;
    }

    setLoadingAction('Locking bounty on-chain...');
    setIsPublishModalOpen(false);

    setTimeout(() => {
      const createdTask: Task = {
        id: `task-${Date.now()}`,
        title: publishForm.title,
        category: publishForm.category,
        description: publishForm.description,
        requirements: publishForm.requirements || 'Deliver premium-grade deliverables adhering to instructions.',
        reward: publishForm.reward,
        deadline: publishForm.deadline,
        publisher: 'You (@satoshi)',
        publisherAddress: currentUserAddress,
        status: 'Available',
        acceptedBy: null,
        submission: null,
      };

      setTasks(prev => [createdTask, ...prev]);
      setUserProfile(prev => ({
        ...prev,
        publishedTasksCount: prev.publishedTasksCount + 1,
      }));
      setPublishForm(DEFAULT_PUBLISH_FORM);
      setLoadingAction(null);
      triggerToast('Task published successfully. Bounty locked!', 'success');
    }, 1500);
  };

  const handleAcceptTask = (taskId: string) => {
    const task = tasks.find(item => item.id === taskId);
    if (!task) return;

    if (addressesEqual(task.publisherAddress, currentUserAddress)) {
      triggerToast('You cannot accept your own task', 'warning');
      return;
    }

    setLoadingAction('Locking commitment...');
    setTimeout(() => {
      setTasks(prev =>
        prev.map(item =>
          item.id === taskId
            ? {
                ...item,
                status: 'Accepted',
                acceptedBy: currentUserAddress,
              }
            : item,
        ),
      );
      setUserProfile(prev => ({
        ...prev,
        acceptedTasksCount: prev.acceptedTasksCount + 1,
      }));
      setLoadingAction(null);
      triggerToast('Task accepted! It has been added to your workspace.', 'success');
    }, 1000);
  };

  const handleCancelTask = (taskId: string) => {
    setLoadingAction('Cancelling task agreement...');
    setTimeout(() => {
      setTasks(prev =>
        prev.map(item =>
          item.id === taskId
            ? {
                ...item,
                status: 'Cancelled',
                acceptedBy: null,
              }
            : item,
        ),
      );
      setUserProfile(prev => ({
        ...prev,
        contributorScore: Math.max(50, prev.contributorScore - 8),
      }));
      setLoadingAction(null);
      triggerToast('Task cancelled. Your Contributor Score was reduced.', 'warning');
    }, 1200);
  };

  const handleSubmitWork = (event: React.FormEvent) => {
    event.preventDefault();

    if (!submitForm.workUrl || !submitForm.notes) {
      triggerToast('Please provide a URL and notes of your work', 'warning');
      return;
    }

    if (!selectedTaskId) return;

    setIsSubmitFormOpen(false);
    setLoadingAction('Simulating consensus engine...');
    setValidationStep(1);

    setTimeout(() => {
      setValidationStep(2);

      setTimeout(() => {
        setValidationStep(3);

        setTimeout(() => {
          setTasks(prev =>
            prev.map(item =>
              item.id === selectedTaskId
                ? {
                    ...item,
                    status: 'Waiting for Client Review',
                    submission: {
                      workUrl: submitForm.workUrl,
                      notes: submitForm.notes,
                      screenshotName: submitForm.screenshotName || 'submission_proof.png',
                    },
                  }
                : item,
            ),
          );

          setSubmitForm(DEFAULT_SUBMIT_FORM);
          setLoadingAction(null);
          setValidationStep(0);
          triggerToast('Work submitted. GenLayer consensus passed!', 'success');
        }, 1200);
      }, 1400);
    }, 1200);
  };

  const handleClientReview = (taskId: string, decision: 'Approve' | 'Revision') => {
    setLoadingAction(decision === 'Approve' ? 'Settling reward escrow...' : 'Filing revision request...');

    setTimeout(() => {
      setTasks(prev =>
        prev.map(item =>
          item.id === taskId
            ? {
                ...item,
                status: decision === 'Approve' ? 'Completed' : 'Needs Revision',
              }
            : item,
        ),
      );

      if (decision === 'Approve') {
        setUserProfile(prev => ({
          ...prev,
          completedReceiptsCount: prev.completedReceiptsCount + 1,
          contributorScore: Math.min(100, prev.contributorScore + 1),
          clientScore: Math.min(100, prev.clientScore + 2),
        }));
        triggerToast('Receipt settled! Rewards released to contributor.', 'success');
      } else {
        triggerToast('Revision requested. Contributor notified.', 'info');
      }

      setLoadingAction(null);
    }, 1500);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setSubmitForm(prev => ({ ...prev, isDragging: true }));
  };

  const handleDragLeave = () => {
    setSubmitForm(prev => ({ ...prev, isDragging: false }));
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setSubmitForm(prev => ({ ...prev, isDragging: false }));
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const fileName = event.dataTransfer.files[0].name;
      setSubmitForm(prev => ({ ...prev, screenshotName: fileName }));
      triggerToast(`Uploaded ${fileName}`, 'success');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileName = event.target.files[0].name;
      setSubmitForm(prev => ({ ...prev, screenshotName: fileName }));
      triggerToast(`Uploaded ${fileName}`, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-sans antialiased flex flex-col selection:bg-[#4F46E5]/10 selection:text-[#4F46E5]">
      <Toast toast={toastMessage} />
      <LoadingOverlay loadingAction={loadingAction} validationStep={validationStep} />

      <Navbar
        currentPage={currentPage}
        selectedTaskId={selectedTaskId}
        isConnected={wallet.isConnected}
        isConnecting={wallet.isConnecting}
        shortAddress={wallet.shortAddress}
        isCorrectNetwork={wallet.isCorrectNetwork}
        isProfileMenuOpen={isProfileMenuOpen}
        userProfile={userProfile}
        onNavigate={navigateToPage}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        onSwitchNetwork={handleSwitchNetwork}
        onToggleProfileMenu={() => setIsProfileMenuOpen(prev => !prev)}
        onCloseProfileMenu={() => setIsProfileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col">
        {currentPage === 'landing' && (
          <LandingScreen
            walletConnected={wallet.isConnected}
            isConnecting={wallet.isConnecting}
            onConnectWallet={handleConnectWallet}
            onExploreTasks={() => setCurrentPage('board')}
          />
        )}

        {currentPage === 'board' && (
          <TaskBoardScreen
            tasks={tasks}
            currentUserAddress={currentUserAddress}
            isLoading={isBoardLoading}
            onOpenPublishModal={() => setIsPublishModalOpen(true)}
            onViewTask={viewTask}
          />
        )}

        {currentPage === 'detail' && selectedTask && (
          <TaskDetailScreen
            task={selectedTask}
            currentUserAddress={currentUserAddress}
            isSubmitFormOpen={isSubmitFormOpen}
            submitForm={submitForm}
            onBackToBoard={() => {
              setCurrentPage('board');
              setSelectedTaskId(null);
            }}
            onAcceptTask={handleAcceptTask}
            onCancelTask={handleCancelTask}
            onReviewTask={handleClientReview}
            onToggleSubmitForm={() => setIsSubmitFormOpen(prev => !prev)}
            onCloseSubmitForm={() => setIsSubmitFormOpen(false)}
            onSubmitWork={handleSubmitWork}
            onSubmitFormChange={setSubmitForm}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onFileSelect={handleFileSelect}
          />
        )}

        {currentPage === 'profile' && (
          <ProfileScreen
            tasks={tasks}
            userProfile={userProfile}
            currentUserAddress={currentUserAddress}
            walletShortAddress={wallet.shortAddress}
            isCorrectNetwork={wallet.isCorrectNetwork}
            isLoading={isProfileLoading}
            onViewTask={viewTask}
          />
        )}
      </main>

      <FooterNav
        show={currentPage !== 'landing' && wallet.isConnected}
        onGoToBoard={() => {
          setCurrentPage('board');
          setSelectedTaskId(null);
        }}
        onGoToProfile={() => {
          setCurrentPage('profile');
          setSelectedTaskId(null);
        }}
      />

      <PublishTaskModal
        isOpen={isPublishModalOpen}
        form={publishForm}
        onClose={() => setIsPublishModalOpen(false)}
        onSubmit={handlePublishTask}
        onFormChange={setPublishForm}
      />
    </div>
  );
}
