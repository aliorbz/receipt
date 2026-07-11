/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskCategory = 'Builder' | 'Creator' | 'Designer' | 'Artist';

export type TaskDifficulty = 'Beginner' | 'Intermediate' | 'Expert';

export type TaskStatus =
  | 'Open'
  | 'Active'
  | 'Submitted'
  | 'UnderReview'
  | 'Completed'
  | 'RevisionRequested'
  | 'Cancelled';

export interface Task {
  id: string;
  title: string;
  requesterName: string;
  requesterAddress: string;
  requesterScore: number;
  reward: number; // in GEN tokens
  difficulty: TaskDifficulty;
  deadline: string;
  taskQuality: number; // Out of 100
  category: TaskCategory;
  description: string;
  deliverables: string[];
  revisionLimit: number;
  status: TaskStatus;
  currentContributorName?: string | null;
  currentContributorAddress?: string | null;
  revisionCount: number;
}

export interface Submission {
  taskId: string;
  workUrl: string;
  screenshots: string[];
  notes: string;
  submittedAt: string;
  aiScore?: number | null; // e.g. 92
  aiConfidence?: number | null; // e.g. 96%
  missingItems?: string[];
  evaluationFeedback?: string;
}

export interface Receipt {
  id: string;
  taskId: string;
  taskTitle: string;
  category: TaskCategory;
  requesterName: string;
  contributorName: string;
  reward: number;
  score: number;
  timestamp: string;
  status: 'Completed' | 'Cancelled' | 'In Progress' | 'Under Review' | 'Revision';
}

export interface UserProfile {
  connected: boolean;
  address: string;
  username: string;
  bio: string;
  interests: string[];
  globalScore: number;
  requesterScore: number;
  contributorScore: number;
  role: 'Requester' | 'Contributor';
}

export interface Notification {
  id: string;
  text: string;
  type: 'success' | 'info' | 'warning';
  timestamp: string;
}
