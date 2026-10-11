import React, { useState } from 'react';
import {
  Crown,
  Check,
  Zap,
  CreditCard,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  X,
  Sparkles,
  RefreshCw,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { PlanType } from '../types';

interface PricingViewProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ isModal = false, onClose }) => {
  const { user, refreshUser, setIsAuthModalOpen } = useAuth();

  const [currency, setCurrency] = useState<'EUR' | 'USD'>('EUR');
  const [activeTab, setActiveTab] = useState<'plans' | 'packs'>('plans');

  // Checkout modal state
  const [selectedItem, setSelectedItem] = useState<{
    type: 'subscription' | 'credit_pack';
    id: string;
    title: string;
    price: number;
    credits: number;
  } | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile_money' | 'paypal'>('card');
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState('');
  const [mobileMoneyProvider, setMobileMoneyProvider] = useState('wave');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const plans = [
    {
      id: 'free' as PlanType,
      name: 'Gratuit',
      priceEur: 0,
      priceUsd: 0,
      period: 'à vie',
      monthlyCredits: 5,
      badge: 'Découverte',
      features: [
        '5 crédits de bienvenue offerts',
        'Générateur de scripts TikTok IA',
        'Accroches & Hooks 0-3s optimisés',
        'Export des textes et prompts',
        'Support communautaire'
      ],
      cta: 'Forfait Actuel',
      recommended: false
    },
    {
      id: 'creator' as PlanType,
      name: 'Creator',
      priceEur: 5,
      priceUsd: 5,
      period: 'par mois',
      monthlyCredits: 100,
      badge: 'Le Plus Populaire 🔥',
      features: [
        '100 crédits par mois',
        'Scripts & Scènes 9:16 illimités',
        'Prompts Veo & IA vidéo haute précision',
        'Générateur de vidéos TikTok 9:16',
        'Historique étendu et téléchargement',
        'Accès prioritaire aux modèles IA'
      ],
      cta: 'Passer à Creator (5 €)',
      recommended: true
    },
    {
      id: 'pro' as PlanType,
      name: 'Pro Studio',
      priceEur: 15,
      priceUsd: 15,
      period: 'par mois',
      monthlyCredits: 350,
      badge: 'Performance Max',
      features: [
        '350 crédits par mois',
        'Tous les outils Creator inclus',
        'File de rendu vidéo ultra-rapide',
        'Génération multi-variations A/B test',
        'Formats personnalisés Shorts & Reels',
        'Support VIP dédié en direct'
      ],
      cta: 'Passer à Pro (15 €)',
      recommended: false
    }
  ];

  const creditPacks = [
    {
      id: 'pack_50',
      title: 'Pack 50 Crédits',
      priceEur: 3,
      priceUsd: 3,
      credits: 50,
      desc: 'Idéal pour 50 scripts ou 25 vidéos 9:16'
    },
    {
      id: 'pack_150',
      title: 'Pack 150 Crédits',
      priceEur: 7,
      priceUsd: 7,
      credits: 150,
      desc: 'Meilleur rapport qualité-prix pour créateurs réguliers',
      popular: true
    },
    {
      id: 'pack_500',
      title: 'Pack 500 Crédits VIP',
      priceEur: 19,
      priceUsd: 19,
      credits: 500,
      desc: 'Volume important pour agences et chaînes TikTok'
    }
  ];

  const handleOpenCheckout = (item: {
    type: 'subscription' | 'credit_pack';
    id: string;
    title: string;
    price: number;
    credits: number;
  }) => {
    setSelectedItem(item);
    setCheckoutSuccess(null);
    setCheckoutError(null);
  };

  const handleProcessPayment = async () => {
    if (!selectedItem) return;

    setIsProcessing(true);
    setCheckoutError(null);

    try {
      const res = await api.createCheckout({
        itemType: selectedItem.type,
        itemId: selectedItem.id,
        method: paymentMethod,
        currency,
      });

      if (res.success) {
        setCheckoutSuccess(res.message);
        refreshUser();
        setTimeout(() => {
          setSelectedItem(null);
          setCheckoutSuccess(null);
          if (onClose) onClose();
        }, 2500);
      }
    } catch (err: any) {
      setCheckoutError(err?.message || 'Erreur lors du traitement du paiement.');
    } finally {
      setIsProcessing(false);
    }
  };

  const content = (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-semibold">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Abonnements & Recharge de Crédits</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Investis dans ta <span className="tiktok-gradient-text">croissance TikTok</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Sans engagement. Change de forfait ou résilie à tout moment en 1 clic.
        </p>

        {/* Currency & Mode toggles */}
        <div className="pt-2 flex items-center justify-center gap-4">
          <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'plans'
                  ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Abonnements Mensuels
            </button>
            <button
              onClick={() => setActiveTab('packs')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'packs'
                  ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Recharges de Crédits (À la carte)
            </button>
          </div>

          <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setCurrency('EUR')}
              className={`px-2.5 py-1 rounded-lg font-bold ${
                currency === 'EUR' ? 'bg-slate-700 text-white' : 'text-slate-400'
              }`}
            >
              € EUR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1 rounded-lg font-bold ${
                currency === 'USD' ? 'bg-slate-700 text-white' : 'text-slate-400'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>
      </div>

      {/* Plans View */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {plans.map((p) => {
            const isCurrent = user?.plan === p.id;
            const price = currency === 'USD' ? p.priceUsd : p.priceEur;
            const currencySymbol = currency === 'USD' ? '$' : '€';

            return (
              <div
                key={p.id}
                className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all ${
                  p.recommended
                    ? 'glass-panel-glow border-purple-500/50 shadow-2xl shadow-purple-950/60 scale-100 md:-translate-y-2'
                    : 'glass-panel border-slate-800 hover:border-slate-700'
                }`}
              >
                {p.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      p.recommended
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {p.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="pt-2">
                    <h3 className="text-xl font-extrabold text-white">{p.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-4xl font-black text-white">
                        {price}
                        {currencySymbol}
                      </span>
                      <span className="text-xs text-slate-400">/{p.period}</span>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs font-bold">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{p.monthlyCredits} crédits / mois</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
                    {p.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  {isCurrent ? (
                    <div className="w-full py-3 rounded-xl bg-slate-800 border border-slate-700 text-center text-xs font-bold text-slate-400">
                      Forfait Actuel
                    </div>
                  ) : p.priceEur === 0 ? (
                    <div className="w-full py-3 rounded-xl bg-slate-800 text-center text-xs font-bold text-slate-400">
                      Inclus par défaut
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        handleOpenCheckout({
                          type: 'subscription',
                          id: p.id,
                          title: `Abonnement ${p.name}`,
                          price,
                          credits: p.monthlyCredits,
                        })
                      }
                      className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all cursor-pointer ${
                        p.recommended
                          ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-purple-600/30 hover:scale-[1.02]'
                          : 'bg-slate-800 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      {p.cta}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Credit Packs View */}
      {activeTab === 'packs' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {creditPacks.map((pack) => {
            const price = currency === 'USD' ? pack.priceUsd : pack.priceEur;
            const currencySymbol = currency === 'USD' ? '$' : '€';

            return (
              <div
                key={pack.id}
                className={`glass-panel rounded-3xl p-6 flex flex-col justify-between border transition-all ${
                  pack.popular
                    ? 'border-cyan-500/50 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                    : 'border-slate-800'
                }`}
              >
                <div className="space-y-4">
                  {pack.popular && (
                    <div className="inline-block px-3 py-0.5 rounded-full bg-cyan-950 border border-cyan-500 text-cyan-300 text-[10px] font-extrabold uppercase">
                      Recommandé Créateurs
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-extrabold text-white">{pack.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{pack.desc}</p>
                    <div className="flex items-baseline gap-1 mt-3">
                      <span className="text-3xl font-black text-white">
                        {price}
                        {currencySymbol}
                      </span>
                      <span className="text-xs text-slate-400">paiement unique</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>+{pack.credits} crédits immédiats</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Crédits valables à vie sans expiration.
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() =>
                      handleOpenCheckout({
                        type: 'credit_pack',
                        id: pack.id,
                        title: pack.title,
                        price,
                        credits: pack.credits,
                      })
                    }
                    className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    Acheter (+{pack.credits} cr.)
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Checkout Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg glass-panel-glow rounded-3xl p-6 space-y-5 border border-purple-500/40 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-white text-lg">{selectedItem.title}</h3>
                <p className="text-xs text-slate-400">
                  Total : {selectedItem.price} {currency === 'USD' ? '$' : '€'} ({selectedItem.credits} crédits)
                </p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Moyen de paiement
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl text-center border transition-all ${
                    paymentMethod === 'card'
                      ? 'border-purple-500 bg-purple-950/40 text-white'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-purple-400" />
                  <span className="text-[11px] font-bold block">Carte Bancaire</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('mobile_money')}
                  className={`p-3 rounded-xl text-center border transition-all ${
                    paymentMethod === 'mobile_money'
                      ? 'border-cyan-500 bg-cyan-950/40 text-white'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                  <span className="text-[11px] font-bold block">Mobile Money</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-xl text-center border transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-blue-500 bg-blue-950/40 text-white'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400'
                  }`}
                >
                  <Zap className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                  <span className="text-[11px] font-bold block">PayPal</span>
                </button>
              </div>
            </div>

            {/* Gateway form details */}
            {paymentMethod === 'card' && (
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Numéro de carte</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Expiration</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-slate-700 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">CVC</label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'mobile_money' && (
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Opérateur</label>
                  <select
                    value={mobileMoneyProvider}
                    onChange={(e) => setMobileMoneyProvider(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-slate-700 text-xs text-white"
                  >
                    <option value="wave">Wave (Sénégal, Côte d'Ivoire)</option>
                    <option value="orange">Orange Money (Afrique de l'Ouest / Centrale)</option>
                    <option value="mtn">MTN MoMo</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Numéro de téléphone</label>
                  <input
                    type="tel"
                    value={mobileMoneyPhone}
                    onChange={(e) => setMobileMoneyPhone(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-blue-200">
                Vous serez redirigé vers l'interface sécurisée PayPal pour valider la transaction.
              </div>
            )}

            {/* Sandbox Notice */}
            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-start gap-2 text-xs text-purple-300">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                <strong>Mode Sandbox Sécurisé :</strong> La transaction est vérifiée côté serveur, vos crédits sont ajoutés instantanément et un reçu officiel est enregistré dans votre historique.
              </span>
            </div>

            {checkoutError && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>{checkoutError}</span>
              </div>
            )}

            {checkoutSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{checkoutSuccess}</span>
              </div>
            )}

            {/* Confirm button */}
            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isProcessing
                  ? 'bg-slate-800 text-slate-400'
                  : 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Traitement sécurisé du paiement...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    Confirmer le paiement ({selectedItem.price} {currency === 'USD' ? '$' : '€'})
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md overflow-y-auto p-4 sm:p-6 flex items-center justify-center">
        <div className="relative w-full max-w-5xl glass-panel-glow rounded-3xl p-6 sm:p-8 my-8 border border-purple-500/40 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900/80 border border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {content}
    </div>
  );
};
