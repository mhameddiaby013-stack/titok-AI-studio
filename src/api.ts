import { User, GeneratedScript, VideoProject, CreditTransaction, PaymentTransaction, PlanConfig, AdminStats } from './types';

let currentToken: string | null = localStorage.getItem('tiktok_ai_token');

export function setAuthToken(token: string | null) {
  currentToken = token;
  if (token) {
    localStorage.setItem('tiktok_ai_token', token);
  } else {
    localStorage.removeItem('tiktok_ai_token');
  }
}

export function getAuthToken(): string | null {
  return currentToken;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (currentToken) {
    headers['Authorization'] = `Bearer ${currentToken}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Erreur serveur (${response.status})`);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(email: string, password: string, name?: string): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    setAuthToken(res.token);
    return res;
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(res.token);
    return res;
  },

  async getMe(): Promise<{ user: User | null }> {
    return request<{ user: User | null }>('/api/auth/me');
  },

  async logout(): Promise<void> {
    try {
      await request('/api/auth/logout', { method: 'POST' });
    } finally {
      setAuthToken(null);
    }
  },

  async switchDemo(roleOrEmail: string): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/api/auth/switch-demo', {
      method: 'POST',
      body: JSON.stringify({ roleOrEmail }),
    });
    setAuthToken(res.token);
    return res;
  },

  // Script Generator
  async generateScript(params: {
    topic: string;
    category: string;
    language: string;
    tone: string;
    targetDuration: string;
  }): Promise<{ success: boolean; script: GeneratedScript; remainingCredits: number }> {
    return request('/api/generate/script', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  // Video Generator
  async generateVideo(params: {
    prompt: string;
    style: string;
    aspectRatio: '9:16' | '16:9';
    durationSeconds: number;
    scenes?: any[];
  }): Promise<{
    success: boolean;
    video: VideoProject;
    isRealVeo: boolean;
    remainingCredits: number;
    message: string;
  }> {
    return request('/api/generate/video', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async checkVideoStatus(operationName: string): Promise<{ done?: boolean; response?: any; error?: any }> {
    return request('/api/video-status', {
      method: 'POST',
      body: JSON.stringify({ operationName }),
    });
  },

  // Library
  async getLibrary(): Promise<{ scripts: GeneratedScript[]; videos: VideoProject[] }> {
    return request('/api/library');
  },

  async deleteLibraryItem(type: 'script' | 'video', id: string): Promise<{ success: boolean }> {
    return request(`/api/library/${type}/${id}`, { method: 'DELETE' });
  },

  // Credits & Payments
  async getCreditsHistory(): Promise<{ transactions: CreditTransaction[]; currentCredits: number }> {
    return request('/api/credits/history');
  },

  async createCheckout(params: {
    itemType: 'subscription' | 'credit_pack';
    itemId: string;
    method: 'card' | 'mobile_money' | 'paypal';
    currency: string;
  }): Promise<{ success: boolean; payment: PaymentTransaction; user: User; message: string }> {
    return request('/api/checkout/session', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async cancelSubscription(): Promise<{ success: boolean; user: User; message: string }> {
    return request('/api/subscription/cancel', { method: 'POST' });
  },

  // Admin
  async getAdminStats(): Promise<{ stats: AdminStats }> {
    return request('/api/admin/stats');
  },

  async getPlans(): Promise<{ plans: PlanConfig[] }> {
    return request('/api/admin/plans');
  },

  async updatePlans(plans: PlanConfig[]): Promise<{ success: boolean; plans: PlanConfig[]; message: string }> {
    return request('/api/admin/plans', {
      method: 'PUT',
      body: JSON.stringify({ plans }),
    });
  },

  async getAdminUsers(): Promise<{ users: any[] }> {
    return request('/api/admin/users');
  },

  async adjustCredits(userId: string, amount: number, reason: string): Promise<{ success: boolean; newBalance: number }> {
    return request('/api/admin/adjust-credits', {
      method: 'POST',
      body: JSON.stringify({ userId, amount, reason }),
    });
  },

  async getAdminTransactions(): Promise<{ payments: PaymentTransaction[]; creditTransactions: CreditTransaction[] }> {
    return request('/api/admin/transactions');
  },

  // System
  async getSystemStatus(): Promise<any> {
    return request('/api/system/status');
  },
};
