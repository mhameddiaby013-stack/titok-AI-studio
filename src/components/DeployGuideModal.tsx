import React from 'react';
import {
  X,
  Server,
  Cloud,
  Key,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Zap,
  Globe
} from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl glass-panel-glow rounded-3xl p-6 sm:p-8 space-y-6 border border-cyan-500/40 shadow-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <Cloud className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Guide de Déploiement & Hébergement Gratuit
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Instructions complètes pour déployer TikTok AI Studio au coût le plus bas possible.
          </p>
        </div>

        {/* Status of Features Table */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            État Réel des Fonctionnalités dans cette Version
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Générateur de Scripts : 100% Opérationnel</strong>
                <p className="text-[11px] text-slate-400">Connecté en direct au modèle Gemini 3.8 Flash.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Système de Crédits & Authentification</strong>
                <p className="text-[11px] text-slate-400">Validé côté serveur, hash sécurisé, persistance /data.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Lecteur Vidéo 9:16 & Prompts</strong>
                <p className="text-[11px] text-slate-400">Rendu interactif TikTok avec scènes et sous-titres.</p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-start gap-2">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Modèle Vidéo Veo</strong>
                <p className="text-[11px] text-slate-400">
                  Prêt et branché. Nécessite une clé avec facturation Google active pour générer du MP4 brut.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 1. Hosting Platforms */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
            <Server className="w-4 h-4" />
            <span>Options d'hébergement gratuit recommandées</span>
          </h3>

          {/* Option A: Render */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <strong className="text-white text-sm">Option 1 : Render.com (Web Service Gratuit)</strong>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                0 € / mois
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              1. Créez un compte sur <code className="text-cyan-300">render.com</code> et cliquez sur <em>New Web Service</em>.<br />
              2. Connectez votre dépôt GitHub contenant le projet.<br />
              3. Spécifiez :
            </p>
            <div className="p-2 rounded-lg bg-black/50 font-mono text-[11px] text-slate-300 space-y-0.5">
              <div>Build Command: <span className="text-cyan-300">npm run build</span></div>
              <div>Start Command: <span className="text-cyan-300">npm start</span></div>
              <div>Node Version: <span className="text-cyan-300">20+</span></div>
            </div>
          </div>

          {/* Option B: Railway / Fly.io */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <strong className="text-white text-sm">Option 2 : Railway ou Fly.io (Conteneur Fullstack)</strong>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                Crédits d'essai offerts
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Permet de monter un volume persistant sur <code className="text-cyan-300">/data</code> pour que les comptes, crédits et créations restent stockés durablement même après redémarrage.
            </p>
          </div>
        </div>

        {/* 2. Environment Variables */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-4 h-4" />
            <span>Variables d'Environnement Obligatoires</span>
          </h3>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-purple-500/30 text-xs font-mono space-y-2 text-slate-200">
            <div>
              <span className="text-purple-400 font-bold">GEMINI_API_KEY</span>="votre_cle_gemini"
              <span className="text-[11px] text-slate-500 block font-sans">
                Obtenue gratuitement sur Google AI Studio (aistudio.google.com).
              </span>
            </div>
            <div>
              <span className="text-purple-400 font-bold">PORT</span>=3000
              <span className="text-[11px] text-slate-500 block font-sans">
                Port d'écoute du serveur Node/Express (par défaut 3000).
              </span>
            </div>
            <div>
              <span className="text-purple-400 font-bold">APP_URL</span>="https://votre-app.onrender.com"
              <span className="text-[11px] text-slate-500 block font-sans">
                URL publique de votre instance en production.
              </span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Fermer le guide
          </button>
        </div>
      </div>
    </div>
  );
};
