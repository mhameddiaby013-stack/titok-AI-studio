import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  DollarSign,
  Zap,
  TrendingUp,
  Sliders,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Save,
  RefreshCw,
  Search,
  FileText,
  CreditCard,
  Lock,
  Layers
} from 'lucide-react';
import { api } from '../api';
import { AdminStats, PlanConfig, PaymentTransaction, CreditTransaction } from '../types';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);
  const [creditLogs, setCreditLogs] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Sub-tabs in Admin
  const [adminTab, setAdminTab] = useState<'overview' | 'plans' | 'users' | 'audit'>('overview');

  // Search filter
  const [searchUser, setSearchUser] = useState('');

  // Credit adjust modal
  const [adjustTargetUser, setAdjustTargetUser] = useState<any | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Bonus fidélité');
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [adjustSuccess, setAdjustSuccess] = useState<string | null>(null);

  // Plans update feedback
  const [isUpdatingPlans, setIsUpdatingPlans] = useState(false);
  const [plansSavedNotice, setPlansSavedNotice] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, plansRes, usersRes, txRes] = await Promise.all([
        api.getAdminStats(),
        api.getPlans(),
        api.getAdminUsers(),
        api.getAdminTransactions(),
      ]);
      setStats(statsRes.stats);
      setPlans(plansRes.plans);
      setUsers(usersRes.users);
      setPayments(txRes.payments);
      setCreditLogs(txRes.creditTransactions);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAdjustCredits = async () => {
    if (!adjustTargetUser) return;
    setIsAdjusting(true);
    try {
      const res = await api.adjustCredits(adjustTargetUser.id, adjustAmount, adjustReason);
      if (res.success) {
        setAdjustSuccess(`Solde de ${adjustTargetUser.email} mis à jour : ${res.newBalance} crédits`);
        fetchAdminData();
        setTimeout(() => {
          setAdjustTargetUser(null);
          setAdjustSuccess(null);
        }, 2000);
      }
    } catch (err: any) {
      alert(err?.message || 'Erreur lors de l\'ajustement');
    } finally {
      setIsAdjusting(false);
    }
  };

  const handlePlanChange = (planId: string, field: keyof PlanConfig, value: any) => {
    setPlans(prev =>
      prev.map(p => (p.id === planId ? { ...p, [field]: value } : p))
    );
  };

  const handleSavePlans = async () => {
    setIsUpdatingPlans(true);
    setPlansSavedNotice(null);
    try {
      const res = await api.updatePlans(plans);
      if (res.success) {
        setPlansSavedNotice('Grille tarifaire et quotas mis à jour avec succès.');
        setTimeout(() => setPlansSavedNotice(null), 3000);
      }
    } catch (err: any) {
      alert(err?.message || 'Erreur de sauvegarde des forfaits');
    } finally {
      setIsUpdatingPlans(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-900/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Tableau de Bord <span className="tiktok-gradient-text">Administrateur</span>
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Gestion sécurisée des utilisateurs, forfaits, quotas, crédits et revenus confirmés
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs w-full sm:w-auto overflow-x-auto">
        <button
          onClick={() => setAdminTab('overview')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            adminTab === 'overview'
              ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Vue Globale & Métriques
        </button>
        <button
          onClick={() => setAdminTab('plans')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            adminTab === 'plans'
              ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Gestion Forfaits & Quotas
        </button>
        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            adminTab === 'users'
              ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Gestion Utilisateurs ({users.length})
        </button>
        <button
          onClick={() => setAdminTab('audit')}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            adminTab === 'audit'
              ? 'bg-amber-600/30 text-amber-200 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Audit Transactions & Paiements
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-xs text-slate-400">Chargement des données administrateur...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {adminTab === 'overview' && stats && (
            <div className="space-y-6">
              {/* KPIs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-panel p-5 rounded-2xl border-purple-500/20 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Total Utilisateurs</span>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-white">{stats.totalUsers}</span>
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {stats.activeUsers} utilisateurs actifs
                  </span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border-emerald-500/20 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Revenus Confirmés</span>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-emerald-400">
                      {stats.totalRevenueUsd.toFixed(2)} $
                    </span>
                    <DollarSign className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {stats.premiumSubscribers} abonnements actifs
                  </span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border-cyan-500/20 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Crédits Consommés</span>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-cyan-400">
                      {stats.totalCreditsUsed}
                    </span>
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {stats.successfulGenerations} générations réussies
                  </span>
                </div>

                <div className="glass-panel p-5 rounded-2xl border-pink-500/20 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Coût Estimé Gemini API</span>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-pink-400">
                      {stats.estimatedApiCostUsd.toFixed(3)} $
                    </span>
                    <TrendingUp className="w-6 h-6 text-pink-400" />
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    Marge brute : +
                    {(
                      stats.totalRevenueUsd - stats.estimatedApiCostUsd
                    ).toFixed(2)}{' '}
                    $
                  </span>
                </div>
              </div>

              {/* Status summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Santé du Système
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900/60">
                      <span className="text-slate-400">Modèle Script :</span>
                      <span className="font-mono text-cyan-300">gemini-3.8-flash (En ligne)</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900/60">
                      <span className="text-slate-400">Moteur Vidéo 9:16 :</span>
                      <span className="font-mono text-purple-300">Veo 3.1 Lite & Canvas</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900/60">
                      <span className="text-slate-400">Stockage Base de Données :</span>
                      <span className="text-emerald-400 font-medium">Persistance atomique /data</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl space-y-3">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Répartition des Abonnements
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900/60">
                      <span className="text-slate-400">Forfait Gratuit :</span>
                      <span className="font-bold text-white">
                        {users.filter(u => u.plan === 'free').length}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900/60">
                      <span className="text-purple-300 font-semibold">Forfait Creator (5 $/mo) :</span>
                      <span className="font-bold text-purple-300">
                        {users.filter(u => u.plan === 'creator').length}
                      </span>
                    </div>
                    <div className="flex justify-between p-2 rounded-lg bg-slate-900/60">
                      <span className="text-cyan-300 font-semibold">Forfait Pro (15 $/mo) :</span>
                      <span className="font-bold text-cyan-300">
                        {users.filter(u => u.plan === 'pro').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PLANS EDITOR */}
          {adminTab === 'plans' && (
            <div className="glass-panel p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Configuration Dynamique des Forfaits & Quotas
                  </h3>
                  <p className="text-xs text-slate-400">
                    Modifiez les prix et quotas de crédits sans redémarrer le serveur ni toucher au code.
                  </p>
                </div>
                <button
                  onClick={handleSavePlans}
                  disabled={isUpdatingPlans}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les forfaits</span>
                </button>
              </div>

              {plansSavedNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
                  {plansSavedNotice}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="font-bold text-white text-sm uppercase">{p.name} ({p.id})</div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold">Prix en Euros (€)</label>
                      <input
                        type="number"
                        value={p.priceEur}
                        onChange={(e) => handlePlanChange(p.id, 'priceEur', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold">Prix en Dollars ($)</label>
                      <input
                        type="number"
                        value={p.priceUsd}
                        onChange={(e) => handlePlanChange(p.id, 'priceUsd', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold">Crédits par mois</label>
                      <input
                        type="number"
                        value={p.monthlyCredits}
                        onChange={(e) => handlePlanChange(p.id, 'monthlyCredits', parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-400 font-semibold">Badge public</label>
                      <input
                        type="text"
                        value={p.badge}
                        onChange={(e) => handlePlanChange(p.id, 'badge', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: USERS MANAGER */}
          {adminTab === 'users' && (
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-white">Comptes Utilisateurs</h3>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    placeholder="Chercher email..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="text-[11px] uppercase tracking-wider text-slate-400 bg-slate-900/60 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Utilisateur</th>
                      <th className="p-3">Rôle</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">Solde Crédits</th>
                      <th className="p-3">Créations</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30">
                        <td className="p-3">
                          <div className="font-bold text-white">{u.name || 'Anonyme'}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role === 'admin'
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.plan === 'pro'
                                ? 'bg-blue-950/60 text-blue-300'
                                : u.plan === 'creator'
                                ? 'bg-purple-950/60 text-purple-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {u.plan}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-white">
                          <span className="text-amber-400">⚡ {u.credits}</span>
                        </td>
                        <td className="p-3 text-slate-400">
                          {u.scriptsCount || 0} scripts • {u.videosCount || 0} vidéos
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setAdjustTargetUser(u);
                              setAdjustAmount(20);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-bold transition-colors"
                          >
                            Ajuster Crédits
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT LEDGER */}
          {adminTab === 'audit' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Payment transactions */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Journal des Paiements Confirmés ({payments.length})</span>
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {payments.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex justify-between font-bold text-white">
                        <span>{p.userEmail}</span>
                        <span className="text-emerald-400">
                          +{p.amount} {p.currency}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span className="capitalize">{p.method} • {p.itemType}</span>
                        <span>{new Date(p.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Credit logs */}
              <div className="glass-panel p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Journal des Mouvements de Crédits</span>
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                  {creditLogs.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-1"
                    >
                      <div className="flex justify-between">
                        <span className="text-slate-300">{c.description}</span>
                        <span
                          className={`font-mono font-bold ${
                            c.amount > 0 ? 'text-emerald-400' : 'text-pink-400'
                          }`}
                        >
                          {c.amount > 0 ? `+${c.amount}` : c.amount}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(c.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Adjust Credits Modal */}
          {adjustTargetUser && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="max-w-md w-full glass-panel-glow rounded-3xl p-6 space-y-4 border border-amber-500/40">
                <h3 className="text-lg font-bold text-white">
                  Ajustement manuel de crédits
                </h3>
                <p className="text-xs text-slate-300">
                  Compte cible : <strong className="text-amber-300">{adjustTargetUser.email}</strong> (Solde actuel : {adjustTargetUser.credits})
                </p>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold">Crédits à ajouter ou déduire</label>
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                  />
                  <span className="text-[10px] text-slate-500 block">
                    Utilisez un chiffre négatif pour retirer des crédits.
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold">Motif de l'ajustement</label>
                  <input
                    type="text"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>

                {adjustSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
                    {adjustSuccess}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setAdjustTargetUser(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAdjustCredits}
                    disabled={isAdjusting}
                    className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-white"
                  >
                    {isAdjusting ? 'Enregistrement...' : 'Valider'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
