/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, Receipt } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Implement Deterministic LLM Smart Contract Wrapper',
    requesterName: 'GenLabs Foundation',
    requesterAddress: '0x3F8a...9B2c',
    requesterScore: 98,
    reward: 4.5,
    difficulty: 'Expert',
    deadline: '2026-07-02',
    taskQuality: 96,
    category: 'Builder',
    description: 'Create a production-ready wrapper for GenLayer Intelligent Contracts that enforces deterministic temperature controls and fallback prompt templates. The handler should gracefully fall back to alternative nodes in the consensus group if the output format deviates from the strict JSON Schema specified in the contract metadata.',
    deliverables: [
      'Well-commented GenLayer Smart Contract code (TypeScript)',
      'Verification script running on simulated GenNode',
      'JSON output format unit tests validating consistency across 5 distinct LLM prompts'
    ],
    revisionLimit: 3,
    status: 'Open',
    revisionCount: 0
  },
  {
    id: 'task-2',
    title: 'UI/UX Interactive Dashboard for Gas Fee Projection',
    requesterName: 'Aetheris Protocol',
    requesterAddress: '0xE2b9...88a1',
    requesterScore: 94,
    reward: 3.0,
    difficulty: 'Intermediate',
    deadline: '2026-06-29',
    taskQuality: 92,
    category: 'Designer',
    description: 'Design and build a clean, minimalist gas fee projector component that visualizes dynamic cost pricing for AI-infused transactions. Because GenLayer smart contracts call LLM inference directly, gas costs depend on prompt length, model selection, and token limits. We need a fluid slider-based component showing projected GEN token consumption.',
    deliverables: [
      'Tailwind CSS-styled component file built in React & TypeScript',
      'Interactive sliders for Input Tokens, Output Tokens, and Node Consensus Count',
      'Adaptive light-theme layout compatible with Apple/Linear styling guidelines'
    ],
    revisionLimit: 2,
    status: 'Open',
    revisionCount: 0
  },
  {
    id: 'task-3',
    title: 'Explain intelligent Consensus Mechanisms for Non-Devs',
    requesterName: 'Receipt Labs',
    requesterAddress: '0x91d3...aa74',
    requesterScore: 99,
    reward: 1.5,
    difficulty: 'Beginner',
    deadline: '2026-06-27',
    taskQuality: 88,
    category: 'Creator',
    description: 'Draft an engaging, technically precise article explaining how GenLayer resolves non-deterministic LLM states through its unique optimistic consensus mechanisms. The reader should easily grasp why standard blockchain nodes cannot process natural language inputs, and how GenLayer bridges LLM predictions with distributed consensus.',
    deliverables: [
      'Markdown-formatted article of approximately 1,200 words',
      '3 conceptual flowchart diagrams styled in neutral SVG formatting',
      'A summary tl;dr card ready for social sharing'
    ],
    revisionLimit: 4,
    status: 'Open',
    revisionCount: 0
  },
  {
    id: 'task-4',
    title: 'Minimal Vector Icon Set for GenNode State Lifecycle',
    requesterName: 'Helios DAO',
    requesterAddress: '0x7C10...22f9',
    requesterScore: 91,
    reward: 2.2,
    difficulty: 'Intermediate',
    deadline: '2026-07-05',
    taskQuality: 94,
    category: 'Artist',
    description: 'Produce a set of 8 custom vector icons representing different states of a GenNode during transaction validation: Idle, Prompt Evaluation, Consensus Quorum, Dispute Phase, Resolution, Receipt Generation, Score Adjustment, and Inactive.',
    deliverables: [
      'Clean, pixel-perfect SVG source files with zero inline attributes',
      'Design token map with customizable color palettes',
      'Preview page showing responsive sizing constraints from 16px to 128px'
    ],
    revisionLimit: 1,
    status: 'Open',
    revisionCount: 0
  },
  {
    id: 'task-5',
    title: 'LLM Prompt Injection Scanner for Intelligent Contracts',
    requesterName: 'SecurNode Tech',
    requesterAddress: '0xAD5c...ff82',
    requesterScore: 95,
    reward: 5.0,
    difficulty: 'Expert',
    deadline: '2026-06-30',
    taskQuality: 97,
    category: 'Builder',
    description: 'Build an offline prompt injection validator that can be run locally inside GenNodes before transaction dispatching. It should analyze input parameters against classic jailbreaking prompt patterns (e.g., "ignore previous instructions") and assign a safety score.',
    deliverables: [
      'Parser module analyzing raw input text payloads',
      'Regular expression and lightweight lexical weight scanner',
      'Benchmark report testing over 100 historical attack prompts'
    ],
    revisionLimit: 2,
    status: 'Active',
    currentContributorName: 'SatoshiN',
    currentContributorAddress: '0x0011...abef',
    revisionCount: 0
  },
  {
    id: 'task-6',
    title: 'GenLayer Wallet Splash Illustration Design',
    requesterName: 'GenLabs Foundation',
    requesterAddress: '0x3F8a...9B2c',
    requesterScore: 98,
    reward: 2.0,
    difficulty: 'Intermediate',
    deadline: '2026-06-25',
    taskQuality: 91,
    category: 'Artist',
    description: 'Design a highly elegant, low-contrast splash screen illustration showcasing an AI agent and a human hand collaborating to lock a transaction receipt in place. Style must be strictly black/white, minimal, and premium.',
    deliverables: [
      'High-resolution vector assets',
      'Responsive aspect ratio variants for web & mobile',
      'Dark-mode alternative styling config'
    ],
    revisionLimit: 2,
    status: 'Submitted',
    currentContributorName: 'SatoshiN',
    currentContributorAddress: '0x0011...abef',
    revisionCount: 1
  }
];

export const INITIAL_RECEIPTS: Receipt[] = [
  {
    id: 'rec-101',
    taskId: 'task-99',
    taskTitle: 'Optimized State-Trie Storage Engine for GenNode',
    category: 'Builder',
    requesterName: 'GenLabs Foundation',
    contributorName: 'Alice_Dev',
    reward: 5.0,
    score: 96,
    timestamp: '2026-06-22 14:32',
    status: 'Completed'
  },
  {
    id: 'rec-102',
    taskId: 'task-98',
    taskTitle: 'Intelligent Oracle API Feed Integration',
    category: 'Builder',
    requesterName: 'Aetheris Protocol',
    contributorName: 'SatoshiN',
    reward: 2.8,
    score: 91,
    timestamp: '2026-06-21 09:15',
    status: 'Completed'
  },
  {
    id: 'rec-103',
    taskId: 'task-97',
    taskTitle: 'Dynamic Gas Fee Illustration Set',
    category: 'Artist',
    requesterName: 'Helios DAO',
    contributorName: 'Aesthetic_Vector',
    reward: 1.8,
    score: 35,
    timestamp: '2026-06-20 18:45',
    status: 'Cancelled'
  },
  {
    id: 'rec-104',
    taskId: 'task-96',
    taskTitle: 'Interactive Smart Contract Gas Configurator',
    category: 'Designer',
    requesterName: 'Aetheris Protocol',
    contributorName: 'SatoshiN',
    reward: 3.5,
    score: 93,
    timestamp: '2026-06-19 11:20',
    status: 'Completed'
  },
  {
    id: 'rec-105',
    taskId: 'task-95',
    taskTitle: 'Write GenLayer Technical FAQ Page',
    category: 'Creator',
    requesterName: 'Receipt Labs',
    contributorName: 'WriteWeb3',
    reward: 1.2,
    score: 89,
    timestamp: '2026-06-18 16:50',
    status: 'Completed'
  }
];
