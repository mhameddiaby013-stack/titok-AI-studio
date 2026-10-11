import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { ScriptGenerator } from './components/ScriptGenerator';
import { VideoStudio } from './components/VideoStudio';
import { Library } from './components/Library';
import { PricingView } from './components/PricingView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { Scene } from './types';
import {
  Sparkles,
  Video,
  FileText,
  FolderHeart,
  Crown,
  ShieldCheck,
  Heart
} from 'lucide-react';

const MainApp: React.FC = () => {
  const { user, isPricingOpen, setIsPricingOpen } = useAuth();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [deployGuideOpen, setDeployGuideOpen] = useState(false);

  // Cross-component state: transferring generated script prompt to video studio
  const [videoStudioPrompt, setVideoStudioPrompt] = useState<string>('');
  const [videoStudioScenes, setVideoStudioScenes] = useState<Scene[]>([]);

  const handleSendToVideoStudio = (prompt: string, scenes: Scene[]) => {
    setVideoStudioPrompt(prompt);
    setVideoStudioScenes(scenes);
    setCurrentTab('video');
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenDeployGuide={() => setDeployGuideOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 pb-20 md:pb-12">
        {currentTab === 'home' && (
          <HomeHero
            onStartCreation={() => setCurrentTab('script')}
            onGoToVideo={() => setCurrentTab('video')}
            onGoToPricing={() => setCurrentTab('pricing')}
          />
        )}

        {currentTab === 'script' && (
          <ScriptGenerator onSendToVideoStudio={handleSendToVideoStudio} />
        )}

        {currentTab === 'video' && (
          <VideoStudio
            initialPrompt={videoStudioPrompt}
            initialScenes={videoStudioScenes}
          />
        )}

        {currentTab === 'library' && (
          <Library
            onOpenVideoStudio={(prompt, scenes) => {
              setVideoStudioPrompt(prompt);
              setVideoStudioScenes(scenes || []);
              setCurrentTab('video');
            }}
          />
        )}

        {currentTab === 'pricing' && <PricingView />}

        {currentTab === 'admin' && (
          user?.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 glass-panel rounded-2xl text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto" />
              <h2 className="text-lg font-bold text-white">Accès Réservé aux Administrateurs</h2>
              <p className="text-xs text-slate-400">
                Vous devez être connecté avec un compte administrateur pour accéder à cette interface.
              </p>
              <button
                onClick={() => setCurrentTab('home')}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white"
              >
                Retour à l'accueil
              </button>
            </div>
          )
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-panel border-t border-purple-900/40 px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
            currentTab === 'home' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Accueil</span>
        </button>

        <button
          onClick={() => setCurrentTab('script')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
            currentTab === 'script' ? 'text-purple-400' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Script</span>
        </button>

        <button
          onClick={() => setCurrentTab('video')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
            currentTab === 'video' ? 'text-pink-400' : 'text-slate-400'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Vidéo 9:16</span>
        </button>

        <button
          onClick={() => setCurrentTab('library')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
            currentTab === 'library' ? 'text-purple-300' : 'text-slate-400'
          }`}
        >
          <FolderHeart className="w-4 h-4" />
          <span>Mes Vidéos</span>
        </button>

        <button
          onClick={() => setCurrentTab('pricing')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-semibold transition-colors ${
            currentTab === 'pricing' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>Tarifs</span>
        </button>
      </nav>

      {/* Footer */}
      <footer className="border-t border-purple-900/20 glass-panel py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white">TikTok AI Studio</span>
            <span>—</span>
            <span>« Transforme tes idées en vidéos IA. »</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setDeployGuideOpen(true)}
              className="text-cyan-400 hover:underline"
            >
              Guide Déploiement Gratuit
            </button>
            <button
              onClick={() => setIsPricingOpen(true)}
              className="hover:text-slate-200"
            >
              Tarifs & Quotas
            </button>
            <span>Propulsé par Google Gemini</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <AuthModal />
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onOpenPricing={() => setIsPricingOpen(true)}
      />
      <DeployGuideModal
        isOpen={deployGuideOpen}
        onClose={() => setDeployGuideOpen(false)}
      />
      {isPricingOpen && (
        <PricingView
          isModal={true}
          onClose={() => setIsPricingOpen(false)}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
