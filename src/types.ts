export type UserRole = 'user' | 'admin';
export type PlanType = 'free' | 'creator' | 'pro';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  plan: PlanType;
  credits: number;
  createdAt: string;
  renewalDate?: string;
}

export interface Scene {
  sceneNumber: number;
  timestamp: string;
  visualPrompt916: string;
  speech: string;
  textOnScreen: string;
  cameraAngle: string;
  musicMood?: string;
}

export interface GeneratedScript {
  id: string;
  userId: string;
  topic: string;
  category: string;
  language: string;
  tone: string;
  title: string;
  alternativeTitles: string[];
  hook: string;
  fullScript: string;
  estimatedDuration: string;
  description: string;
  hashtags: string[];
  soundSuggestion: string;
  scenes: Scene[];
  veoPrompt: string;
  createdAt: string;
}

export interface VideoProject {
  id: string;
  userId: string;
  title: string;
  prompt: string;
  style: string;
  aspectRatio: '9:16' | '16:9';
  durationSeconds: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  previewThumbnail?: string;
  isRealVeo: boolean;
  operationName?: string;
  errorMessage?: string;
  createdAt: string;
  scenes?: Scene[];
}

export interface CreditTransaction {
  id: string;
  userId: string;
  amount: number; // positive for additions, negative for consumption
  balanceAfter: number;
  type: 'welcome' | 'generation_script' | 'generation_video' | 'purchase' | 'subscription' | 'refund' | 'admin_adjust';
  description: string;
  timestamp: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  currency: string;
  itemType: 'subscription' | 'credit_pack';
  itemId: string; // e.g. 'plan_creator', 'pack_50'
  method: 'card' | 'mobile_money' | 'paypal';
  status: 'completed' | 'failed' | 'pending';
  timestamp: string;
}

export interface PlanConfig {
  id: PlanType;
  name: string;
  priceEur: number;
  priceUsd: number;
  monthlyCredits: number;
  badge: string;
  features: string[];
  recommended?: boolean;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  premiumSubscribers: number;
  totalRevenueUsd: number;
  totalCreditsUsed: number;
  successfulGenerations: number;
  failedGenerations: number;
  estimatedApiCostUsd: number;
}
