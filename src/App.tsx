import type React from 'react';
import { useEffect, useState } from 'react';
import { LoadingOverlay } from './components/feedback/LoadingOverlay';
import { Toast } from './components/feedback/Toast';
import { FooterNav } from './components/layout/FooterNav';
import { Navbar } from './components/layout/Navbar';
import { PublishTaskModal } from './components/modals/PublishTaskModal';
import { CURRENT_USER_ADDRESS, INITIAL_TASKS_LIST, INITIAL_USER_PROFILE } from './data/mockData';
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
  const [currentPage, setCurrentPage] = useState<AppPage>('landing');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
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

  const selectedTask = tasks.find(task => task.id === selectedTaskId);

  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const triggerToast = (text: string, type: ToastType = 'info') => {
    setToastMessage({ text, type });
  };

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

  const handleConnectWallet = () => {
    setLoadingAction('Connecting secure wallet...');
    setTimeout(() => {
      setWalletConnected(true);
      setCurrentPage('board');
      setLoadingAction(null);
      triggerToast('Wallet connected: 0x0011...abef', 'success');
    }, 1200);
  };

  const handleDisconnectWallet = () => {
    setWalletConnected(false);
    setCurrentPage('landing');
    triggerToast('Wallet disconnected', 'info');
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
        publisherAddress: CURRENT_USER_ADDRESS,
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

    if (task.publisherAddress === CURRENT_USER_ADDRESS) {
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
                acceptedBy: CURRENT_USER_ADDRESS,
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
        walletConnected={walletConnected}
        isProfileMenuOpen={isProfileMenuOpen}
        userProfile={userProfile}
        onNavigate={navigateToPage}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
        onToggleProfileMenu={() => setIsProfileMenuOpen(prev => !prev)}
        onCloseProfileMenu={() => setIsProfileMenuOpen(false)}
      />

      <main className="flex-1 flex flex-col">
        {currentPage === 'landing' && (
          <LandingScreen
            walletConnected={walletConnected}
            onConnectWallet={handleConnectWallet}
            onExploreTasks={() => setCurrentPage('board')}
          />
        )}

        {currentPage === 'board' && (
          <TaskBoardScreen
            tasks={tasks}
            currentUserAddress={CURRENT_USER_ADDRESS}
            isLoading={isBoardLoading}
            onOpenPublishModal={() => setIsPublishModalOpen(true)}
            onViewTask={viewTask}
          />
        )}

        {currentPage === 'detail' && selectedTask && (
          <TaskDetailScreen
            task={selectedTask}
            currentUserAddress={CURRENT_USER_ADDRESS}
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
            currentUserAddress={CURRENT_USER_ADDRESS}
            isLoading={isProfileLoading}
            onViewTask={viewTask}
          />
        )}
      </main>

      <FooterNav
        show={currentPage !== 'landing' && walletConnected}
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
