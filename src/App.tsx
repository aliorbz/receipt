/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Wallet, FileText, Check, X, User, Plus, Award, 
  Clock, ArrowLeft, AlertCircle, UploadCloud, CheckCircle2, 
  Loader2, ExternalLink, Shield, ArrowUpRight, ChevronRight, Play, Briefcase
} from 'lucide-react';

// ==========================================
// 1. Core Interfaces
// ==========================================
export interface Task {
  id: string;
  title: string;
  category: string;
  description: string;
  requirements: string; // Deliverables & Requirements
  reward: number; // 1-5 GEN
  deadline: string;
  publisher: string; // Human name/address
  publisherAddress: string;
  status: 'Available' | 'Accepted' | 'Under GenLayer Review' | 'Waiting for Publisher Review' | 'Needs Revision' | 'Completed' | 'Cancelled';
  acceptedBy: string | null; // Wallet address of contributor
  submission?: {
    workUrl: string;
    notes: string;
    screenshotName: string | null;
  } | null;
  publisherScore?: number;
}

export interface UserProfile {
  address: string;
  username: string;
  bio: string;
  workerScore: number;
  publisherScore: number;
  acceptedTasksCount: number;
  publishedTasksCount: number;
  completedReceiptsCount: number;
  completionRate: string;
}

// ==========================================
// 2. Realistic Initial Mock Data
// ==========================================
const INITIAL_TASKS_LIST: Task[] = [
  {
    id: 'task-1',
    title: 'Design Minimal Vector Icon Set',
    category: 'Design',
    reward: 3,
    deadline: '2026-07-12',
    publisher: 'GenLabs Foundation',
    publisherAddress: '0x3F8a02c9B2c00000000000000000000000009B2c',
    description: 'Produce a set of 8 custom vector icons representing GenNode consensus states. The icons should be ultra-minimal, black & white, and delivered as clean SVG files with no unnecessary attributes.',
    requirements: 'Must contain 8 icons. Strictly light/dark stroke ready. No extra SVG wrappers or CSS styling included in files.',
    status: 'Available',
    acceptedBy: null,
    submission: null,
    publisherScore: 94
  },
  {
    id: 'task-2',
    title: 'Implement LLM Smart Contract Wrapper',
    category: 'Developer',
    reward: 5,
    deadline: '2026-07-08',
    publisher: 'Aetheris Protocol',
    publisherAddress: '0xE2b95c9B2c0000000000000000000000000088a1',
    description: 'Create a production-ready smart contract wrapper for GenLayer Intelligent Contracts that enforces deterministic temperature control and provides standard fallback routes.',
    requirements: 'Write TypeScript contract code compatible with GenLayer compiler. Include test cases covering alternate nodes consensus failure.',
    status: 'Available',
    acceptedBy: null,
    submission: null,
    publisherScore: 89
  },
  {
    id: 'task-3',
    title: 'Draft GenLayer FAQ & Explainer Article',
    category: 'Writing',
    reward: 2,
    deadline: '2026-07-01',
    publisher: 'Receipt Labs',
    publisherAddress: '0x91d35c9B2c00000000000000000000000000aa74',
    description: 'Write a high-quality, beginner-friendly article explaining how optimistic consensus mechanisms handle LLM non-determinism. Keep it engaging, clear, and technically accurate.',
    requirements: 'Markdown format of approximately 1,200 words. Neutral tone with clean visual text explanations.',
    status: 'Available',
    acceptedBy: null,
    submission: null,
    publisherScore: 97
  },
  {
    id: 'task-4',
    title: 'Integrate Gas Fee Estimator Component',
    category: 'Developer',
    reward: 4,
    deadline: '2026-07-15',
    publisher: 'Helios DAO',
    publisherAddress: '0x7C105c9B2c0000000000000000000000000022f9',
    description: 'Develop a lightweight, interactive slider-based gas fee component showing projected GEN token consumption for variable LLM input prompt lengths.',
    requirements: 'React component styled with Tailwind. Support slider values between 100 to 10k prompt tokens.',
    status: 'Accepted',
    acceptedBy: '0x2D4a02c9B2c000000000000000000000000077b1', // accepted by someone else
    submission: null,
    publisherScore: 91
  },
  {
    id: 'task-5',
    title: 'Write Prompt Injection Scanner',
    category: 'Developer',
    reward: 5,
    deadline: '2026-07-10',
    publisher: 'SecurNode Tech',
    publisherAddress: '0xAD5c02c9B2c0000000000000000000000000ff82',
    description: 'Create a regex and lexical weight parser to pre-scan transaction input fields for prompt injection attempts before they reach the GenNode consensus group.',
    requirements: 'Must run entirely client-side. Standard JS/TS. Covers 12 common jailbreak instructions.',
    status: 'Waiting for Publisher Review',
    acceptedBy: '0x001122334455667788990011223344556677abef', // current user
    submission: {
      workUrl: 'https://github.com/securnode-scanner-pr',
      notes: 'Initial implementation containing regex engines and static payload matches. Successfully passed offline simulated consensus tests.',
      screenshotName: 'payload_tests_passed.png'
    },
    publisherScore: 95
  },
  {
    id: 'task-6',
    title: 'GenLayer Wallet Splash Illustration',
    category: 'Design',
    reward: 2,
    deadline: '2026-06-25',
    publisher: 'GenLabs Foundation',
    publisherAddress: '0x3F8a02c9B2c00000000000000000000000009B2c',
    description: 'Design a simple, elegant splash graphic showing humans and AI agents collaborating on receipt locking.',
    requirements: 'Export high-res vector SVG and standard optimized WebP. Fully light-mode friendly.',
    status: 'Completed',
    acceptedBy: '0x001122334455667788990011223344556677abef', // current user
    submission: {
      workUrl: 'https://figma.com/file/receipt-splash-genlayer',
      notes: 'Completed minimalist handoff illustration. Designed strictly for light theme with generous negative space.',
      screenshotName: 'splash_preview.png'
    },
    publisherScore: 94
  }
];

export default function App() {
  // ==========================================
  // 3. App State
  // ==========================================
  const [currentPage, setCurrentPage] = useState<'landing' | 'board' | 'detail' | 'profile'>('landing');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  // Wallet Connection
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState<boolean>(false);
  const currentUserAddress = '0x001122334455667788990011223344556677abef';
  
  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    address: currentUserAddress,
    username: '@satoshi',
    bio: 'Building lightweight decentralized verification workflows. Focused on on-chain AI consensus and reputation structures.',
    workerScore: 96,
    publisherScore: 92,
    acceptedTasksCount: 3,
    publishedTasksCount: 1,
    completedReceiptsCount: 2,
    completionRate: '94%'
  });

  // Task database state
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS_LIST);

  // Loading & Action feedback states
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Modals state
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  // Publish Form fields
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Developer');
  const [newDescription, setNewDescription] = useState('');
  const [newReward, setNewReward] = useState<number>(3);
  const [newDeadline, setNewDeadline] = useState('');
  const [newRequirements, setNewRequirements] = useState('');

  // Submit Work Form fields
  const [submitWorkUrl, setSubmitWorkUrl] = useState('');
  const [submitNotes, setSubmitNotes] = useState('');
  const [submitScreenshotName, setSubmitScreenshotName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Multi-step validation animation simulator
  const [validationStep, setValidationStep] = useState<number>(0);

  // Loading skeleton states & Inline submission form toggle
  const [isBoardLoading, setIsBoardLoading] = useState<boolean>(false);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(false);
  const [isSubmitFormOpen, setIsSubmitFormOpen] = useState<boolean>(false);

  // Navigation with built-in skeleton loader flash for realistic feedback
  const navigateToPage = (page: 'landing' | 'board' | 'detail' | 'profile') => {
    setSelectedTaskId(null);
    setIsProfileMenuOpen(false);
    setIsSubmitFormOpen(false); // reset form toggles
    if (page === 'board') {
      setIsBoardLoading(true);
      setCurrentPage('board');
      setTimeout(() => setIsBoardLoading(false), 600);
    } else if (page === 'profile') {
      setIsProfileLoading(true);
      setCurrentPage('profile');
      setTimeout(() => setIsProfileLoading(false), 600);
    } else {
      setCurrentPage(page);
    }
  };

  // Auto close toast helper
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const triggerToast = (text: string, type: 'success' | 'warning' | 'info' = 'info') => {
    setToastMessage({ text, type });
  };

  // ==========================================
  // 4. Interaction Handlers
  // ==========================================

  // Connect Wallet Flow
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

  // Publish Task Flow
  const handlePublishTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription || !newDeadline) {
      triggerToast('Please fill out all required fields', 'warning');
      return;
    }
    if (newReward < 1 || newReward > 5) {
      triggerToast('Reward must be between 1 and 5 GEN', 'warning');
      return;
    }

    setLoadingAction('Locking bounty on-chain...');
    setIsPublishModalOpen(false);

    setTimeout(() => {
      const createdTask: Task = {
        id: `task-${Date.now()}`,
        title: newTitle,
        category: newCategory,
        description: newDescription,
        requirements: newRequirements || 'Deliver premium-grade deliverables adhering to instructions.',
        reward: newReward,
        deadline: newDeadline,
        publisher: 'You (@satoshi)',
        publisherAddress: currentUserAddress,
        status: 'Available',
        acceptedBy: null,
        submission: null
      };

      setTasks(prev => [createdTask, ...prev]);
      
      // Update profile stats
      setUserProfile(prev => ({
        ...prev,
        publishedTasksCount: prev.publishedTasksCount + 1
      }));

      // Reset form
      setNewTitle('');
      setNewCategory('Developer');
      setNewDescription('');
      setNewReward(3);
      setNewDeadline('');
      setNewRequirements('');
      
      setLoadingAction(null);
      triggerToast('Task published successfully. Bounty locked!', 'success');
    }, 1500);
  };

  // Accept Task Flow
  const handleAcceptTask = (taskId: string) => {
    setLoadingAction('Locking commitment...');
    setTimeout(() => {
      setTasks(prev => 
        prev.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              status: 'Accepted',
              acceptedBy: currentUserAddress
            };
          }
          return t;
        })
      );

      // Update local profile count
      setUserProfile(prev => ({
        ...prev,
        acceptedTasksCount: prev.acceptedTasksCount + 1
      }));

      setLoadingAction(null);
      triggerToast('Task accepted! It has been added to your workspace.', 'success');
    }, 1000);
  };

  // Cancel Task Flow
  const handleCancelTask = (taskId: string) => {
    setLoadingAction('Cancelling task agreement...');
    setTimeout(() => {
      setTasks(prev => 
        prev.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              status: 'Cancelled',
              acceptedBy: null
            };
          }
          return t;
        })
      );

      // Reduce Worker Score as warned
      setUserProfile(prev => ({
        ...prev,
        workerScore: Math.max(50, prev.workerScore - 8)
      }));

      setLoadingAction(null);
      triggerToast('Task cancelled. Your Worker Score was reduced.', 'warning');
    }, 1200);
  };

  // Submit Work Flow
  const handleSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitWorkUrl || !submitNotes) {
      triggerToast('Please provide a URL and notes of your work', 'warning');
      return;
    }

    if (!selectedTaskId) return;
    setIsSubmitModalOpen(false);
    setIsSubmitFormOpen(false);

    // Enter a multi-step GenLayer validation loading animation!
    setLoadingAction('Simulating consensus engine...');
    setValidationStep(1);

    // Step 1: Broadcasting
    setTimeout(() => {
      setValidationStep(2); // Running rules evaluation
      
      setTimeout(() => {
        setValidationStep(3); // Receipt pinned
        
        setTimeout(() => {
          // Complete the submission
          setTasks(prev => 
            prev.map(t => {
              if (t.id === selectedTaskId) {
                return {
                  ...t,
                  status: 'Waiting for Publisher Review',
                  submission: {
                    workUrl: submitWorkUrl,
                    notes: submitNotes,
                    screenshotName: submitScreenshotName || 'submission_proof.png'
                  }
                };
              }
              return t;
            })
          );

          setSubmitWorkUrl('');
          setSubmitNotes('');
          setSubmitScreenshotName(null);
          setLoadingAction(null);
          setValidationStep(0);
          triggerToast('Work submitted. GenLayer consensus passed!', 'success');
        }, 1200);

      }, 1400);

    }, 1200);
  };

  // Simulate Publisher reviewing contributor's submission
  const handlePublisherReview = (taskId: string, decision: 'Approve' | 'Revision') => {
    setLoadingAction(decision === 'Approve' ? 'Settling reward escrow...' : 'Filing revision request...');
    
    setTimeout(() => {
      setTasks(prev => 
        prev.map(t => {
          if (t.id === taskId) {
            return {
              ...t,
              status: decision === 'Approve' ? 'Completed' : 'Needs Revision'
            };
          }
          return t;
        })
      );

      if (decision === 'Approve') {
        setUserProfile(prev => ({
          ...prev,
          completedReceiptsCount: prev.completedReceiptsCount + 1,
          workerScore: Math.min(100, prev.workerScore + 1),
          publisherScore: Math.min(100, prev.publisherScore + 2)
        }));
        triggerToast('Receipt settled! Rewards released to contributor.', 'success');
      } else {
        triggerToast('Revision requested. Contributor notified.', 'info');
      }
      setLoadingAction(null);
    }, 1500);
  };

  // Drag and drop simulation helpers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSubmitScreenshotName(e.dataTransfer.files[0].name);
      triggerToast(`Uploaded ${e.dataTransfer.files[0].name}`, 'success');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubmitScreenshotName(e.target.files[0].name);
      triggerToast(`Uploaded ${e.target.files[0].name}`, 'success');
    }
  };

  // Find currently selected task details
  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-sans antialiased flex flex-col selection:bg-[#4F46E5]/10 selection:text-[#4F46E5]">
      
      {/* GLOBAL TOAST BANNER */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-sm max-w-md ${
            toastMessage.type === 'success' ? 'bg-white border-[#E5E7EB] text-[#22C55E]' :
            toastMessage.type === 'warning' ? 'bg-white border-[#E5E7EB] text-[#EF4444]' :
            'bg-white border-[#E5E7EB] text-[#4F46E5]'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              toastMessage.type === 'success' ? 'bg-[#22C55E]' :
              toastMessage.type === 'warning' ? 'bg-[#EF4444]' :
              'bg-[#4F46E5]'
            }`} />
            <p className="text-sm font-medium text-[#111827]">{toastMessage.text}</p>
          </div>
        </div>
      )}

      {/* GLOBAL SIMULATION OVERLAY LOADER */}
      {loadingAction && (
        <div className="fixed inset-0 bg-[#FAFAFA]/95 backdrop-blur-xs z-50 flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-xs text-center space-y-6">
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-md font-semibold text-[#111827]">{loadingAction}</h3>
              <p className="text-xs text-[#6B7280]">GenLayer Decentralized Consensus Network v0.1</p>
            </div>

            {validationStep > 0 && (
              <div className="border-t border-[#E5E7EB] pt-4 space-y-3 text-left">
                <div className="flex items-center gap-3 text-xs">
                  <span className={`w-2 h-2 rounded-full ${validationStep >= 1 ? 'bg-[#22C55E]' : 'bg-gray-200'}`} />
                  <span className={validationStep >= 1 ? 'text-[#111827] font-medium' : 'text-gray-400'}>
                    Broadcasting submission parameters to Consensus Group
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`w-2 h-2 rounded-full ${validationStep >= 2 ? 'bg-[#22C55E]' : 'bg-gray-200'}`} />
                  <span className={validationStep >= 2 ? 'text-[#111827] font-medium' : 'text-gray-400'}>
                    Running decentralized verification on LLM-powered GenNodes
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className={`w-2 h-2 rounded-full ${validationStep >= 3 ? 'bg-[#22C55E]' : 'bg-gray-200'}`} />
                  <span className={validationStep >= 3 ? 'text-[#111827] font-medium' : 'text-gray-400'}>
                    Escrow state verified & cryptographically pinned
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-6 h-14 flex items-center justify-between">
        <button 
          onClick={() => navigateToPage('landing')}
          className="flex items-center gap-1.5 group cursor-pointer"
        >
          <span className="font-display font-bold text-[15px] sm:text-base tracking-tight text-[#111827]">
            Receipt
          </span>
          <span className="text-[9px] font-mono font-semibold text-[#4F46E5] bg-[#4F46E5]/10 px-1.5 py-0.5 rounded-full">
            v0.1
          </span>
        </button>

        {/* Center Navigation Links */}
        <nav className="flex items-center gap-4.5 sm:gap-6 text-[13px] sm:text-xs font-semibold text-[#6B7280]">
          <button
            onClick={() => {
              if (!walletConnected) {
                handleConnectWallet();
              } else {
                navigateToPage('board');
              }
            }}
            className={`hover:text-[#111827] transition-colors cursor-pointer pb-0.5 ${
              currentPage === 'board' || (currentPage === 'detail' && selectedTaskId)
                ? 'text-[#111827] font-bold border-b-2 border-black' 
                : ''
            }`}
          >
            Taskboard
          </button>
          <button
            onClick={() => {
              if (!walletConnected) {
                handleConnectWallet();
              } else {
                navigateToPage('profile');
              }
            }}
            className={`hover:text-[#111827] transition-colors cursor-pointer pb-0.5 ${
              currentPage === 'profile' 
                ? 'text-[#111827] font-bold border-b-2 border-black' 
                : ''
            }`}
          >
            Profile
          </button>
        </nav>

        {/* Right Section: Connect or Profile Menu */}
        <div className="flex items-center gap-2.5 sm:gap-4 relative">
          {!walletConnected ? (
            <button
              onClick={handleConnectWallet}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 bg-black hover:bg-black/95 text-white text-[12px] sm:text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Wallet</span>
            </button>
          ) : (
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-[#111827] group-hover:text-[#4F46E5] transition-colors">
                  {userProfile.username}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full border border-[#E5E7EB] bg-gray-100 flex items-center justify-center font-bold text-xs text-[#4F46E5] group-hover:border-[#4F46E5] transition-colors overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          )}

          {/* Profile Slide-out / Dropdown Menu */}
          {isProfileMenuOpen && walletConnected && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl p-5 z-40 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB] mb-3">
                <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-wider">Account Workspace</span>
                <button 
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 pb-4 border-b border-[#E5E7EB]">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E5E7EB] bg-gray-50 flex-shrink-0">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-extrabold text-[#111827] truncate">
                    {userProfile.username}
                  </p>
                </div>
              </div>

              {/* Menu Actions */}
              <div className="pt-3 space-y-1">
                <button
                  onClick={() => {
                    navigateToPage('profile');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-[#111827] hover:bg-gray-50 rounded-xl transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4 text-[#6B7280]" />
                  Profile Workspace
                </button>
                <button
                  onClick={() => {
                    handleDisconnectWallet();
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-[#EF4444] hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4 text-[#EF4444]" />
                  Disconnect Wallet
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* VIEWPORT AREA */}
      <main className="flex-1 flex flex-col">
        
        {/* ==========================================
            1. LANDING PAGE VIEW 
           ========================================== */}
        {currentPage === 'landing' && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
            <div className="max-w-xl w-full text-center space-y-10 animate-fade-in">
              
              {/* Receipt Logo & Header */}
              <div className="flex flex-col items-center space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-display font-extrabold text-2xl tracking-tight text-[#111827]">
                    Receipt
                  </span>
                  <span className="text-xs font-mono font-semibold text-[#4F46E5] bg-[#4F46E5]/10 px-2.5 py-0.5 rounded-full">
                    GenLayer Beta
                  </span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-[#111827] tracking-tight leading-none">
                  Complete tasks.<br />
                  Build a trusted work history.
                </h1>
                <p className="text-sm sm:text-base text-[#6B7280] max-w-lg mx-auto leading-relaxed">
                  Publish tasks, complete work, receive AI-assisted verification, and build your reputation on GenLayer.
                </p>
              </div>

              {/* One large primary button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    if (!walletConnected) {
                      handleConnectWallet();
                    } else {
                      setCurrentPage('board');
                    }
                  }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black hover:bg-black/90 text-white font-semibold rounded-xl text-xs tracking-wide uppercase transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  {walletConnected ? 'Explore Taskboard' : 'Get Started'}
                  <ChevronRight className="w-4 h-4 text-white" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            2. TASK BOARD PAGE VIEW
           ========================================== */}
        {currentPage === 'board' && (
          <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 space-y-10 animate-fade-in">
            {isBoardLoading ? (
              <div className="space-y-8 animate-pulse">
                {/* Skeleton Header */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-6">
                  <div className="space-y-2">
                    <div className="h-7 w-48 bg-gray-200 rounded" />
                    <div className="h-3.5 w-64 bg-gray-200 rounded" />
                  </div>
                  <div className="h-10 w-32 bg-gray-200 rounded-lg" />
                </div>
                
                {/* Skeleton Available section */}
                <div className="space-y-4">
                  <div className="h-5 w-36 bg-gray-200 rounded" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} className="border border-gray-100 rounded-xl p-5 space-y-4 bg-white">
                        <div className="flex justify-between">
                          <div className="h-4 w-16 bg-gray-200 rounded" />
                          <div className="h-4 w-12 bg-gray-200 rounded" />
                        </div>
                        <div className="h-5 w-3/4 bg-gray-200 rounded" />
                        <div className="space-y-2">
                          <div className="h-3 w-full bg-gray-200 rounded" />
                          <div className="h-3 w-5/6 bg-gray-200 rounded" />
                        </div>
                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                          <div className="h-4 w-24 bg-gray-200 rounded" />
                          <div className="h-8 w-24 bg-gray-200 rounded-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Board Header Area - Floating Sticky Card */}
                <div className="sticky top-[68px] z-20 bg-white/95 backdrop-blur-md border border-[#E5E7EB] rounded-2xl p-4 shadow-md flex items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-display font-bold text-[#111827] tracking-tight">
                      Available Tasks
                    </h1>
                  </div>
                  <div>
                    <button
                      onClick={() => setIsPublishModalOpen(true)}
                      className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-4 sm:py-2.5 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden sm:inline">Publish Task</span>
                    </button>
                  </div>
                </div>

                {/* Section 1: Available Tasks */}
                <div id="available-tasks-section" className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4F46E5]" />
                    <h2 className="text-sm font-semibold text-[#111827] uppercase tracking-wider">
                      Available Tasks
                    </h2>
                    <span className="text-xs font-mono text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded-full">
                      {tasks.filter(t => t.status === 'Available' || t.status === 'Needs Revision').length} Open
                    </span>
                  </div>

                  {tasks.filter(t => t.status === 'Available' || t.status === 'Needs Revision').length === 0 ? (
                    <div className="border border-dashed border-[#E5E7EB] rounded-2xl p-12 text-center space-y-4 bg-white max-w-md mx-auto">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400 border border-[#E5E7EB]">
                        <Plus className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-[#111827]">No Available Tasks</p>
                        <p className="text-xs text-[#6B7280]">Be the first to publish a verified task on the GenLayer marketplace.</p>
                      </div>
                      <button
                        onClick={() => setIsPublishModalOpen(true)}
                        className="px-4 py-2 bg-[#4F46E5] text-white hover:bg-[#4F46E5]/90 text-xs font-semibold rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5 mx-auto"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Publish First Task
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tasks.filter(t => t.status === 'Available' || t.status === 'Needs Revision').map(task => (
                        <div 
                          key={task.id}
                          className="bg-white border border-[#E5E7EB] rounded-xl p-5 hover:border-[#4F46E5]/40 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
                        >
                          <div className="space-y-2">
                            {/* Header */}
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-semibold text-[#4F46E5] bg-[#4F46E5]/10 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                {task.category}
                              </span>
                              <span className="text-xs font-mono font-bold text-[#4F46E5] flex items-center gap-1">
                                {task.reward} GEN
                              </span>
                            </div>
                            {/* Title */}
                            <h3 className="text-sm font-bold text-[#111827] line-clamp-1 group-hover:text-[#4F46E5]">
                              {task.title}
                            </h3>
                            {/* Short Description */}
                            <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          </div>

                          {/* Footer Info & View Details */}
                          <div className="pt-3 border-t border-[#E5E7EB]/50 flex items-center justify-between text-[11px] text-[#6B7280]">
                            <div className="space-y-0.5">
                              <p className="line-clamp-1 text-[#111827]">
                                By <span className="font-semibold">{task.publisher}</span>
                              </p>
                              <p className="text-[10px] text-gray-500 font-medium">
                                Client Score: <span className="font-semibold text-gray-800">{task.publisherScore || 95}</span>
                              </p>
                              <p className="flex items-center gap-1 font-mono text-[10px] mt-0.5">
                                <Clock className="w-3 h-3 text-[#6B7280]" />
                                {task.deadline}
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                setSelectedTaskId(task.id);
                                setCurrentPage('detail');
                              }}
                              className="px-3 py-1.5 bg-gray-50 hover:bg-[#4F46E5]/5 hover:text-[#4F46E5] border border-[#E5E7EB] text-xs font-medium text-[#111827] rounded-md transition-colors cursor-pointer"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 2: Your Tasks */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    <h2 className="text-sm font-semibold text-[#111827] uppercase tracking-wider">
                      Your Tasks
                    </h2>
                    <span className="text-xs font-mono text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded-full">
                      {tasks.filter(t => t.status !== 'Available' && (t.acceptedBy === currentUserAddress || t.publisherAddress === currentUserAddress)).length} Connected
                    </span>
                  </div>

                  {tasks.filter(t => t.status !== 'Available' && (t.acceptedBy === currentUserAddress || t.publisherAddress === currentUserAddress)).length === 0 ? (
                    <div className="border border-dashed border-[#E5E7EB] rounded-2xl p-12 text-center space-y-4 bg-white max-w-md mx-auto">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-400 border border-[#E5E7EB]">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-[#111827]">No Active Commitments</p>
                        <p className="text-xs text-[#6B7280]">You haven't accepted or interacted with any tasks yet.</p>
                      </div>
                      <button
                        onClick={() => {
                          const element = document.getElementById('available-tasks-section');
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="px-4 py-2 bg-black hover:bg-black/90 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer mx-auto block"
                      >
                        Browse Tasks
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tasks.filter(t => t.status !== 'Available' && (t.acceptedBy === currentUserAddress || t.publisherAddress === currentUserAddress)).map(task => {
                        const isSelfAccepted = task.acceptedBy === currentUserAddress;
                        
                        // Map status names to specified badges
                        let displayStatus = task.status as string;
                        let badgeStyle = 'bg-gray-100 text-gray-500 border border-gray-200';
                        if (task.status === 'Accepted') {
                          displayStatus = 'Accepted';
                          badgeStyle = 'bg-[#4F46E5]/10 text-[#4F46E5] border border-[#4F46E5]/20';
                        } else if (task.status === 'Under GenLayer Review') {
                          displayStatus = 'GenLayer Review';
                          badgeStyle = 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20';
                        } else if (task.status === 'Waiting for Publisher Review') {
                          displayStatus = 'Client Review';
                          badgeStyle = 'bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20';
                        } else if (task.status === 'Completed') {
                          displayStatus = 'Completed';
                          badgeStyle = 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20';
                        } else if (task.status === 'Cancelled') {
                          displayStatus = 'Cancelled';
                          badgeStyle = 'bg-red-50 text-red-500 border border-red-100';
                        } else if (task.status === 'Needs Revision') {
                          displayStatus = 'Needs Revision';
                          badgeStyle = 'bg-red-50 text-red-500 border border-red-100';
                        }

                        return (
                          <div 
                            key={task.id}
                            className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-gray-300 transition-colors"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-semibold text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {task.category}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono font-bold text-[#4F46E5]">
                                    {task.reward} GEN
                                  </span>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${badgeStyle}`}>
                                    {displayStatus}
                                  </span>
                                </div>
                              </div>
                              <h3 className="text-sm font-bold text-[#111827] line-clamp-1">
                                {task.title}
                              </h3>
                              <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">
                                {task.description}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#6B7280]">
                              <div>
                                <p className="line-clamp-1">
                                  Contributor:{' '}
                                  <span className="font-semibold text-[#111827]">
                                    {isSelfAccepted ? 'You (@satoshi)' : task.acceptedBy ? `${task.acceptedBy.slice(0, 6)}...` : 'External User'}
                                  </span>
                                </p>
                                <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                                  Client Score: <span className="font-semibold text-gray-800">{task.publisherScore || 95}</span>
                                </p>
                                <p className="font-mono mt-0.5 text-[10px]">Deadline: {task.deadline}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setSelectedTaskId(task.id);
                                    setCurrentPage('detail');
                                  }}
                                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-[#E5E7EB] text-xs font-medium text-[#111827] rounded-md transition-colors cursor-pointer"
                                >
                                  Details
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>


              </>
            )}
          </div>
        )}

        {/* ==========================================
            3. TASK DETAIL PAGE VIEW
           ========================================== */}
        {currentPage === 'detail' && selectedTask && (
          <div className="flex-1 max-w-2xl w-full mx-auto px-6 py-10 space-y-8 animate-fade-in">
            
            {/* Back to Board Button */}
            <button
              onClick={() => {
                setCurrentPage('board');
                setSelectedTaskId(null);
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B7280] hover:text-[#111827] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to available tasks
            </button>

            {/* Task Card Container */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 space-y-6">
              
              {/* Progress Timeline */}
              <div className="border-b border-[#E5E7EB] pb-5">
                <div className="flex items-center justify-between text-[9px] text-gray-400 font-mono font-medium max-w-lg mx-auto">
                  {(() => {
                    const timelineSteps = ['Available', 'Accepted', 'Submitted', 'GenLayer Review', 'Client Review', 'Completed'];
                    let currentStepIndex = 0;
                    if (selectedTask.status === 'Available') currentStepIndex = 0;
                    else if (selectedTask.status === 'Accepted' || selectedTask.status === 'Needs Revision') currentStepIndex = 1;
                    else if (selectedTask.status === 'Under GenLayer Review') currentStepIndex = 3;
                    else if (selectedTask.status === 'Waiting for Publisher Review') currentStepIndex = 4;
                    else if (selectedTask.status === 'Completed') currentStepIndex = 5;

                    return timelineSteps.map((step, idx) => {
                      const isCurrent = currentStepIndex === idx;
                      const isPassed = currentStepIndex > idx;
                      return (
                        <div key={step} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-all ${
                              isCurrent ? 'bg-[#4F46E5] border-[#4F46E5] ring-2 ring-[#4F46E5]/20' :
                              isPassed ? 'bg-[#22C55E] border-[#22C55E]' :
                              'bg-white border-gray-300'
                            }`}>
                              {isPassed && <Check className="w-1.5 h-1.5 text-white stroke-[3px]" />}
                            </span>
                            <span className={`text-[8px] sm:text-[9px] font-semibold whitespace-nowrap ${
                              isCurrent ? 'text-[#4F46E5] font-bold' :
                              isPassed ? 'text-[#111827]' :
                              'text-gray-400'
                            }`}>
                              {step}
                            </span>
                          </div>
                          {idx < timelineSteps.length - 1 && (
                            <div className={`h-[1px] flex-1 mx-1.5 ${
                              isPassed ? 'bg-[#22C55E]' : 'bg-[#E5E7EB]'
                            }`} />
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Header Badge & Reward */}
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4">
                <span className="text-xs font-bold text-[#4F46E5] bg-[#4F46E5]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedTask.category}
                </span>
                <div className="text-right">
                  <p className="text-[10px] text-[#6B7280] uppercase tracking-wider font-semibold">Reward locked</p>
                  <p className="text-lg font-mono font-bold text-[#4F46E5]">{selectedTask.reward} GEN</p>
                </div>
              </div>

              {/* Title & Client */}
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#111827] tracking-tight">
                  {selectedTask.title}
                </h1>
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#6B7280]">
                  <p>Client: <span className="font-semibold text-[#111827]">{selectedTask.publisher}</span></p>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <p className="font-mono">Address: {selectedTask.publisherAddress.slice(0,12)}...</p>
                </div>
              </div>

              {/* Main Info Blocks */}
              <div className="grid grid-cols-2 gap-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl p-4 text-xs">
                <div>
                  <p className="text-[#6B7280] font-medium">Deadline Date</p>
                  <p className="font-semibold text-[#111827] mt-0.5">{selectedTask.deadline}</p>
                </div>
                <div>
                  <p className="text-[#6B7280] font-medium">Agreement Status</p>
                  <p className="font-bold text-[#111827] mt-0.5 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                    <span className={`w-2 h-2 rounded-full ${
                      selectedTask.status === 'Completed' ? 'bg-[#22C55E]' :
                      selectedTask.status === 'Cancelled' ? 'bg-[#EF4444]' :
                      selectedTask.status === 'Waiting for Publisher Review' ? 'bg-[#F59E0B]' :
                      'bg-[#4F46E5]'
                    }`} />
                    {selectedTask.status === 'Waiting for Publisher Review' ? 'Client Review' : selectedTask.status}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#111827]">
                  Description
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>

              {/* Requirements */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#111827]">
                  Requirements & Deliverables
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 border border-[#E5E7EB] text-xs space-y-2">
                  <p className="text-[#111827] font-medium leading-relaxed">
                    {selectedTask.requirements}
                  </p>
                </div>
              </div>

              {/* Inline Submission Form (Toggleable if accepted and active) */}
              {isSubmitFormOpen && selectedTask.status === 'Accepted' && (
                <form onSubmit={handleSubmitWork} className="border border-[#E5E7EB] rounded-xl p-5 bg-[#FAFAFA] space-y-4 text-xs mt-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-2">
                    <h4 className="font-bold text-[#111827]">Submit Finished Work</h4>
                    <button 
                      type="button"
                      onClick={() => setIsSubmitFormOpen(false)}
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#111827]">Work URL</label>
                    <input 
                      type="url"
                      required
                      placeholder="https://github.com/your-username/repo-name or design link"
                      value={submitWorkUrl}
                      onChange={(e) => setSubmitWorkUrl(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5] text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#111827]">Notes & Explanation</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="Explain your approach, libraries used, or describe files for automated or client review..."
                      value={submitNotes}
                      onChange={(e) => setSubmitNotes(e.target.value)}
                      className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5]"
                    />
                  </div>

                  {/* Drag & Drop File Container for Screenshot Upload */}
                  <div className="space-y-1">
                    <label className="font-semibold text-[#111827]">Screenshot Upload</label>
                    <div 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border border-dashed rounded-lg p-4 text-center transition-all cursor-pointer ${
                        isDragging ? 'border-[#4F46E5] bg-[#4F46E5]/5' : 'border-[#E5E7EB] hover:border-[#4F46E5]'
                      }`}
                    >
                      <input 
                        type="file" 
                        id="screenshot-file-inline" 
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden" 
                      />
                      <label htmlFor="screenshot-file-inline" className="cursor-pointer space-y-1 block">
                        <div className="flex justify-center">
                          <UploadCloud className="w-6 h-6 text-[#6B7280]" />
                        </div>
                        {submitScreenshotName ? (
                          <div className="space-y-0.5">
                            <p className="text-[11px] font-bold text-[#22C55E]">Screenshot Chosen</p>
                            <p className="text-[10px] font-mono text-[#6B7280]">{submitScreenshotName}</p>
                          </div>
                        ) : (
                          <div className="space-y-0.5">
                            <p className="text-[11px] font-semibold text-[#111827]">Drag and drop screenshot, or click to browse</p>
                            <p className="text-[9px] text-[#6B7280]">Supports PNG, JPG up to 10MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setIsSubmitFormOpen(false)}
                      className="px-3 py-1.5 bg-white border border-[#E5E7EB] text-[#6B7280] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white font-semibold rounded-lg shadow-xs transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}

              {/* Submission Information if Submitted/Completed (replaces form/submission flow inline) */}
              {selectedTask.submission && (
                <div className="border-t border-[#E5E7EB] pt-6 space-y-3">
                  <h3 className="text-xs uppercase tracking-wider font-bold text-[#111827]">
                    Submitted Work
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-[#E5E7EB] space-y-3 text-xs">
                    <div>
                      <p className="text-[#6B7280] font-medium">Work URL Reference</p>
                      <a 
                        href={selectedTask.submission.workUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[#4F46E5] hover:underline font-mono inline-flex items-center gap-1 mt-0.5"
                      >
                        {selectedTask.submission.workUrl}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div>
                      <p className="text-[#6B7280] font-medium">Notes & Explanatory Proof</p>
                      <p className="text-[#111827] mt-0.5 leading-relaxed">{selectedTask.submission.notes}</p>
                    </div>
                    {selectedTask.submission.screenshotName && (
                      <div>
                        <p className="text-[#6B7280] font-medium">Uploaded Screenshot</p>
                        <div className="mt-1 flex items-center gap-2 text-[#22C55E] bg-[#22C55E]/5 border border-[#22C55E]/10 px-2 py-1.5 rounded-lg w-fit">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="font-mono text-[11px]">{selectedTask.submission.screenshotName}</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-[#6B7280] font-medium">Current Status</p>
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md mt-1 border ${
                        selectedTask.status === 'Completed' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' :
                        selectedTask.status === 'Needs Revision' ? 'bg-red-50 text-red-500 border-red-100' :
                        'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          selectedTask.status === 'Completed' ? 'bg-[#22C55E]' :
                          selectedTask.status === 'Needs Revision' ? 'bg-red-500' :
                          'bg-[#3B82F6] animate-pulse'
                        }`} />
                        {selectedTask.status === 'Waiting for Publisher Review' ? 'Client Review' : selectedTask.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION PANEL */}
              <div className="pt-4 border-t border-[#E5E7EB]">
                
                {/* Before Accepting State */}
                {selectedTask.status === 'Available' && (
                  <div className="space-y-3">
                    {selectedTask.publisherAddress === currentUserAddress ? (
                      <div className="bg-[#F59E0B]/5 border border-[#F59E0B]/20 p-4 rounded-xl text-center">
                        <p className="text-xs text-[#F59E0B] font-semibold">
                          You published this task. Requesters must not accept their own tasks.
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAcceptTask(selectedTask.id)}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white font-medium rounded-xl text-sm transition-all shadow-xs cursor-pointer"
                      >
                        Accept Task
                      </button>
                    )}
                  </div>
                )}

                {/* After Accepting State (claimed by you) */}
                {selectedTask.status === 'Accepted' && selectedTask.acceptedBy === currentUserAddress && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setIsSubmitFormOpen(!isSubmitFormOpen)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white font-medium rounded-xl text-sm transition-all shadow-xs cursor-pointer"
                      >
                        {isSubmitFormOpen ? 'Cancel Submission' : 'Submit Work'}
                      </button>
                      <button
                        onClick={() => handleCancelTask(selectedTask.id)}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-red-50 text-[#EF4444] border border-[#E5E7EB] font-medium rounded-xl text-sm transition-all cursor-pointer"
                      >
                        Cancel Task
                      </button>
                    </div>
                    
                    <p className="text-[11px] text-[#6B7280] text-center leading-relaxed max-w-md mx-auto">
                      Cancelling will reduce your Contributor Score. Future versions may also include token penalties.
                    </p>
                  </div>
                )}

                {/* If submitted and pending, but you are the Client */}
                {selectedTask.status === 'Waiting for Publisher Review' && selectedTask.publisherAddress === currentUserAddress && (
                  <div className="space-y-4 bg-[#FAFAFA] p-5 border border-[#E5E7EB] rounded-xl text-center">
                    <div>
                      <p className="text-xs font-bold text-[#111827]">Review this Contributor Submission</p>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">As the client, evaluate the submitted work to release the GEN tokens or request revisions.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center pt-2">
                      <button
                        onClick={() => handlePublisherReview(selectedTask.id, 'Approve')}
                        className="px-4 py-2 bg-[#22C55E] hover:bg-[#22C55E]/90 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        Approve & Release Funds
                      </button>
                      <button
                        onClick={() => handlePublisherReview(selectedTask.id, 'Revision')}
                        className="px-4 py-2 bg-white hover:bg-gray-100 text-[#111827] border border-[#E5E7EB] text-xs font-medium rounded-lg transition-colors cursor-pointer"
                      >
                        Request Revision
                      </button>
                    </div>
                  </div>
                )}

                {/* If submitted by you, showing simple status labels / Revision form toggle */}
                {selectedTask.acceptedBy === currentUserAddress && selectedTask.status !== 'Accepted' && (
                  <div className="bg-[#FAFAFA] border border-[#E5E7EB] p-5 rounded-xl space-y-2">
                    <p className="text-xs font-medium text-[#6B7280] text-center">Your Submission Status:</p>
                    <div className="flex items-center justify-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        selectedTask.status === 'Completed' ? 'bg-[#22C55E]' :
                        selectedTask.status === 'Needs Revision' ? 'bg-[#F59E0B]' :
                        'bg-[#4F46E5] animate-pulse'
                      }`} />
                      <span className="text-sm font-bold text-[#111827]">
                        {selectedTask.status === 'Waiting for Publisher Review' ? 'Client Review' : selectedTask.status}
                      </span>
                    </div>

                    {selectedTask.status === 'Needs Revision' && (
                      <div className="text-center pt-2">
                        <button
                          onClick={() => setIsSubmitFormOpen(!isSubmitFormOpen)}
                          className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white text-xs font-medium rounded-lg cursor-pointer"
                        >
                          {isSubmitFormOpen ? 'Cancel Revision' : 'Submit Revision'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            4. PROFILE PAGE VIEW
           ========================================== */}
        {currentPage === 'profile' && (() => {
          const recentReceipts = tasks
            .filter(t => t.acceptedBy === currentUserAddress || t.publisherAddress === currentUserAddress)
            .slice(-5)
            .reverse();

          return (
            <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 space-y-8 animate-fade-in">
              
              {/* Minimal Profile Details (Now at the top of Profile) */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full border-2 border-[#E5E7EB] bg-gray-50 flex-shrink-0 overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80" 
                      alt="Satoshi Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Bio Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-[#111827]">
                        {userProfile.username}
                      </h2>
                    </div>
                    <p className="text-xs font-mono text-[#6B7280]">
                      Address: {userProfile.address}
                    </p>
                    <p className="text-xs text-[#6B7280] max-w-lg leading-relaxed pt-1">
                      {userProfile.bio}
                    </p>
                  </div>
                </div>
              </div>

              {/* Reputation Cards & Stats Row (Below profile details) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Reputation Metric Card 1 */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider">
                      Contributor Score
                    </h4>
                    <Award className="w-4 h-4 text-[#4F46E5]" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-mono font-bold text-[#111827]">
                      {userProfile.workerScore}
                    </span>
                    <span className="text-xs text-[#6B7280]">/ 100</span>
                  </div>
                  <p className="text-[10px] text-[#6B7280] leading-relaxed">
                    Reflects promptness, deliverable quality, and completion rates.
                  </p>
                </div>

                {/* Reputation Metric Card 2 */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs text-[#6B7280] font-semibold uppercase tracking-wider">
                      Client Score
                    </h4>
                    <Shield className="w-4 h-4 text-[#22C55E]" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-mono font-bold text-[#111827]">
                      {userProfile.publisherScore}
                    </span>
                    <span className="text-xs text-[#6B7280]">/ 100</span>
                  </div>
                  <p className="text-[10px] text-[#6B7280] leading-relaxed">
                    Reflects prompt escrow settling, clear guidelines, and fair evaluation parameters.
                  </p>
                </div>

                {/* Simple Statistics Panel */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 space-y-4">
                  <h4 className="text-xs text-[#111827] font-bold uppercase tracking-wider">
                    Verification Stats
                  </h4>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                    <div>
                      <span className="text-[10px] text-[#6B7280] block">Accepted Tasks</span>
                      <span className="font-mono font-bold text-sm text-[#111827]">{userProfile.acceptedTasksCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6B7280] block">Published Tasks</span>
                      <span className="font-mono font-bold text-sm text-[#111827]">{userProfile.publishedTasksCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6B7280] block">Completed Receipts</span>
                      <span className="font-mono font-bold text-sm text-[#111827]">{userProfile.completedReceiptsCount}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#6B7280] block">Completion Rate</span>
                      <span className="font-mono font-bold text-sm text-[#22C55E]">{userProfile.completionRate}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Recent Receipts Section (latest 5) */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-bold text-[#111827] flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-500" />
                  Recent Receipts
                </h3>
                {recentReceipts.length === 0 ? (
                  <p className="text-xs text-[#6B7280]">No recent receipt activity recorded on GenLayer.</p>
                ) : (
                  <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-xl overflow-hidden bg-[#FAFAFA]">
                    {recentReceipts.map(receipt => (
                      <div 
                        key={receipt.id}
                        onClick={() => {
                          setSelectedTaskId(receipt.id);
                          setCurrentPage('detail');
                        }}
                        className="p-3 flex items-center justify-between gap-4 hover:bg-gray-100 transition-colors cursor-pointer text-xs"
                      >
                        <div className="space-y-0.5">
                          <p className="font-bold text-[#111827] line-clamp-1">{receipt.title}</p>
                          <p className="text-[10px] text-[#6B7280]">
                            {receipt.category} • {receipt.reward} GEN • Client Score: {receipt.publisherScore || 95}
                          </p>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          receipt.status === 'Completed' ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' :
                          receipt.status === 'Cancelled' ? 'bg-red-50 text-red-500 border border-red-100' :
                          'bg-gray-100 text-gray-500 border border-gray-200'
                        }`}>
                          {receipt.status === 'Waiting for Publisher Review' ? 'Client Review' : receipt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TABBED Workspace Section */}
              <ProfileTabs 
                tasks={tasks} 
                currentUserAddress={currentUserAddress} 
                onViewTask={(id) => {
                  setSelectedTaskId(id);
                  setCurrentPage('detail');
                }}
              />

            </div>
          );
        })()}

      </main>

      {/* FOOTER NAVBAR (IF WALLET CONNECTED) */}
      {currentPage !== 'landing' && walletConnected && (
        <footer className="bg-white border-t border-[#E5E7EB] py-4 px-6 text-center text-xs text-[#6B7280]">
          <div className="max-w-4xl w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>Receipt task marketplace, optimized for GenLayer optimistic smart contract beta protocol.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setCurrentPage('board');
                  setSelectedTaskId(null);
                }} 
                className="hover:text-[#111827] font-semibold"
              >
                Task Board
              </button>
              <button 
                onClick={() => {
                  setCurrentPage('profile');
                  setSelectedTaskId(null);
                }} 
                className="hover:text-[#111827] font-semibold"
              >
                Profile Workspace
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* ==========================================
          5. PUBLISH TASK OVERLAY MODAL
         ========================================== */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <h3 className="text-base font-bold text-[#111827]">Publish New Task</h3>
              <button 
                onClick={() => setIsPublishModalOpen(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePublishTask} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-semibold text-[#111827]">Task Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g., Implement LLM Smart Contract Wrapper"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5] text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-[#111827]">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5]"
                  >
                    <option value="Developer">Developer</option>
                    <option value="Design">Design</option>
                    <option value="Writing">Writing</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#111827]">Reward Amount (1–5 GEN)</label>
                  <input 
                    type="number"
                    min="1"
                    max="5"
                    step="0.5"
                    required
                    value={newReward}
                    onChange={(e) => setNewReward(parseFloat(e.target.value) || 1)}
                    className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111827]">Deadline Date</label>
                <input 
                  type="date"
                  required
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111827]">Description</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Describe the task workflow, goal, context, and model settings if any..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111827]">Requirements & Deliverables</label>
                <textarea 
                  rows={2}
                  placeholder="List exact deliverables or testing procedures expected..."
                  value={newRequirements}
                  onChange={(e) => setNewRequirements(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5]"
                />
              </div>

              <div className="bg-[#4F46E5]/5 rounded-lg p-3 text-[11px] text-[#4F46E5] leading-relaxed">
                The reward will be locked when the task is published.
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#6B7280] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Publish Task
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ==========================================
          6. SUBMIT WORK OVERLAY MODAL
         ========================================== */}
      {isSubmitModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-lg space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#111827]">Submit Finished Work</h3>
                <p className="text-[11px] text-[#6B7280]">Task: {selectedTask.title}</p>
              </div>
              <button 
                onClick={() => setIsSubmitModalOpen(false)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitWork} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="font-semibold text-[#111827]">Work URL</label>
                <input 
                  type="url"
                  required
                  placeholder="https://github.com/your-username/repo-name or design link"
                  value={submitWorkUrl}
                  onChange={(e) => setSubmitWorkUrl(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#111827]">Notes & Explanation</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Explain your approach, libraries used, or describe files for automated or publisher review..."
                  value={submitNotes}
                  onChange={(e) => setSubmitNotes(e.target.value)}
                  className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#111827] focus:outline-hidden focus:border-[#4F46E5]"
                />
              </div>

              {/* Drag & Drop File Container for Screenshot Upload */}
              <div className="space-y-1">
                <label className="font-semibold text-[#111827]">Screenshot Upload</label>
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                    isDragging ? 'border-[#4F46E5] bg-[#4F46E5]/5' : 'border-[#E5E7EB] hover:border-[#4F46E5]'
                  }`}
                >
                  <input 
                    type="file" 
                    id="screenshot-file" 
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden" 
                  />
                  <label htmlFor="screenshot-file" className="cursor-pointer space-y-2 block">
                    <div className="flex justify-center">
                      <UploadCloud className="w-8 h-8 text-[#6B7280]" />
                    </div>
                    {submitScreenshotName ? (
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-[#22C55E]">Screenshot Chosen</p>
                        <p className="text-[11px] font-mono text-[#6B7280]">{submitScreenshotName}</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-[#111827]">Drag and drop your screenshot, or click to browse</p>
                        <p className="text-[10px] text-[#6B7280]">Supports PNG, JPG up to 10MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 bg-white border border-[#E5E7EB] text-[#6B7280] font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4F46E5] hover:bg-[#4F46E5]/90 text-white font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Submit
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// ==========================================
// 7. ProfileTabs Component
// ==========================================
interface ProfileTabsProps {
  tasks: Task[];
  currentUserAddress: string;
  onViewTask: (id: string) => void;
}

function ProfileTabs({ tasks, currentUserAddress, onViewTask }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<'Accepted' | 'Published' | 'Completed'>('Accepted');

  const acceptedTasks = tasks.filter(t => t.acceptedBy === currentUserAddress && t.status !== 'Completed');
  const publishedTasks = tasks.filter(t => t.publisherAddress === currentUserAddress);
  const completedTasks = tasks.filter(t => t.status === 'Completed' && (t.acceptedBy === currentUserAddress || t.publisherAddress === currentUserAddress));

  const currentTabTasks = 
    activeTab === 'Accepted' ? acceptedTasks :
    activeTab === 'Published' ? publishedTasks :
    completedTasks;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6">
      
      {/* Tab Buttons */}
      <div className="flex border-b border-[#E5E7EB] gap-6 text-sm">
        {(['Accepted', 'Published', 'Completed'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-semibold relative transition-colors cursor-pointer ${
              activeTab === tab ? 'text-[#4F46E5]' : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4F46E5] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Cards */}
      {currentTabTasks.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#6B7280] space-y-2">
          <p className="font-semibold text-[#111827]">No tasks found under {activeTab}</p>
          <p>Your action records on Receipt will be documented chronologically here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {currentTabTasks.map(task => (
            <div 
              key={task.id}
              className="border border-[#E5E7EB] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gray-300 transition-colors bg-[#FAFAFA]"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-[#4F46E5] bg-[#4F46E5]/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {task.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#4F46E5]">
                    {task.reward} GEN
                  </span>
                  {task.status === 'Completed' && (
                    <span className="text-[9px] font-bold text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Receipt Signed
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-[#111827]">{task.title}</h4>
                <p className="text-[11px] text-[#6B7280] line-clamp-1">
                  Client: {task.publisher} • Deadline: {task.deadline}
                </p>
              </div>

              <div className="flex items-center gap-3 justify-between sm:justify-start">
                <span className="text-[10px] uppercase font-bold text-[#6B7280] bg-white border border-[#E5E7EB] px-2.5 py-1 rounded-md">
                  {task.status}
                </span>
                <button
                  onClick={() => onViewTask(task.id)}
                  className="px-3 py-1.5 bg-[#4F46E5] text-white hover:bg-[#4F46E5]/90 text-xs font-medium rounded-md transition-colors cursor-pointer flex items-center gap-1"
                >
                  View Detail
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
