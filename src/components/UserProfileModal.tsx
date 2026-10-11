import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { CreditTransaction } from '../types';
import {
  X,
  User as UserIcon,
  Zap,
  Crown,
  Calendar,
  ShieldCheck,
  LogOut,
  RefreshCw,
  AlertTriangle,
  History
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenPricing,
}) => {
  const { user, refreshUser, logout } = useAuth();
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const [cancelNotice, setCancelNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setLoadingTx(true);
    try {
      const res = await api.getCreditsHistory();
      setTransactions(res.transactions || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoadingTx(false);
    }
  };

  const handleCancelSub = async () => {
    if (!confirm('Voulez-vous vraiment résilier votre abonnement actuel ?')) return;
    try {
      const res = await api.cancelSubscription();
      setCancelNotice(res.message);
      refreshUser();
    } catch (err: any) {
      alert(err?.message || 'Erreur lors de la résiliation');
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl glass-panel-glow rounded-3xl p-6 sm:p-8 space-y-6 border border-purple-500/40 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Card Top */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-cyan-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
            {user.name ? user.name.slice(0, 2).toUpperCase() : 'TK'}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">{user.name || 'Créateur'}</h2>
            <p className="text-xs text-slate-400 font-mono">{user.email}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold uppercase">
                Plan {user.plan}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-bold uppercase">
                Rôle : {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Credits & Subscription Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-2">
            <span className="text-xs text-slate-400 font-semibold block">Solde de Crédits</span>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="text-2xl font-black text-white">{user.credits}</span>
              <span className="text-xs text-slate-400">crédits</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenPricing();
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold"
            >
              + Recharger des crédits
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-xs text-slate-400 font-semibold block">Abonnement Actuel</span>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-lg font-bold text-white capitalize">{user.plan}</span>
            </div>
            {user.renewalDate && (
              <p className="text-[11px] text-slate-400">
                Renouvellement : {new Date(user.renewalDate).toLocaleDateString()}
              </p>
            )}
            {user.plan !== 'free' && (
              <button
                onClick={handleCancelSub}
                className="text-xs text-red-400 hover:text-red-300 font-medium block"
              >
                Résilier l'abonnement
              </button>
            )}
          </div>
        </div>

        {cancelNotice && (
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs">
            {cancelNotice}
          </div>
        )}

        {/* Credit History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <History className="w-4 h-4 text-purple-400" />
              <span>Historique des mouvements de crédits</span>
            </h3>
            <button onClick={loadHistory} className="text-slate-400 hover:text-white">
              <RefreshCw className={`w-3.5 h-3.5 ${loadingTx ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {transactions.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900/40 text-center text-xs text-slate-500">
                Aucun mouvement de crédits pour le moment.
              </div>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="text-slate-200 font-medium">{tx.description}</div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(tx.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div
                    className={`font-mono font-bold ${
                      tx.amount > 0 ? 'text-emerald-400' : 'text-pink-400'
                    }`}
                  >
                    {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Security & Logout */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Données privées sécurisées</span>
          </div>

          <button
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
  );
};
