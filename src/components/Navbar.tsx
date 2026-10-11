import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Video,
  FileText,
  FolderHeart,
  Crown,
  ShieldAlert,
  Zap,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenDeployGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenProfile,
  onOpenDeployGuide,
}) => {
  const { user, switchDemo, setIsPricingOpen, setIsAuthModalOpen, setAuthModalMode, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Accueil', icon: Sparkles },
    { id: 'script', label: 'Studio Script', icon: FileText },
    { id: 'video', label: 'Studio Vidéo 9:16', icon: Video },
    { id: 'library', label: 'Bibliothèque', icon: FolderHeart },
    { id: 'pricing', label: 'Tarifs & Offres', icon: Crown },
  ];

  if (user?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin', icon: ShieldAlert });
  }

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-[#090a0f] rounded-[10px] flex items-center justify-center">
              <Video className="w-5 h-5 text-cyan-400 group-hover:text-purple-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                TikTok <span className="tiktok-gradient-text">AI Studio</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-medium">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block -mt-1">
              Transforme tes idées en vidéos virales
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Credits, Demo Switcher, User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Credits pill */}
          <div className="flex items-center bg-slate-900/90 border border-purple-500/30 rounded-full px-2.5 sm:px-3 py-1 gap-2 shadow-inner">
            <div className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-mono text-xs sm:text-sm font-bold text-white">
                {user?.credits ?? 0}
              </span>
              <span className="text-[11px] text-slate-400 hidden xs:inline">crédits</span>
            </div>
            <button
              onClick={() => setIsPricingOpen(true)}
              className="text-[11px] bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-semibold px-2 py-0.5 rounded-full transition-all shadow-sm"
            >
              +
            </button>
          </div>

          {/* Quick Demo Profile Switcher */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => {
                setDemoDropdownOpen(!demoDropdownOpen);
                setUserDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 px-2.5 py-1.5 rounded-lg transition-colors"
              title="Changer de profil de test"
            >
              <span className="text-purple-400">Rôle :</span>
              <span className="font-semibold capitalize text-white">
                {user?.role === 'admin' ? 'Admin' : user?.plan || 'Gratuit'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {demoDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 glass-panel-glow rounded-xl p-2 z-50 shadow-2xl border border-purple-500/30 animate-in fade-in slide-in-from-top-2">
                <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Changer de profil (Test 1-clic)
                </div>
                <button
                  onClick={() => {
                    switchDemo('guest@demo.com');
                    setDemoDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-purple-600/20 text-slate-200 flex items-center justify-between"
                >
                  <span>Gratuit (5 crédits)</span>
                  {user?.plan === 'free' && <span className="text-cyan-400 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => {
                    switchDemo('creator@tiktokstudio.ai');
                    setDemoDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-purple-600/20 text-slate-200 flex items-center justify-between"
                >
                  <span>Creator (100 crédits)</span>
                  {user?.plan === 'creator' && <span className="text-cyan-400 font-bold">✓</span>}
                </button>
                <button
                  onClick={() => {
                    switchDemo('pro@tiktokstudio.ai');
                    setDemoDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-purple-600/20 text-slate-200 flex items-center justify-between"
                >
                  <span>Pro (350 crédits)</span>
                  {user?.plan === 'pro' && user?.role !== 'admin' && (
                    <span className="text-cyan-400 font-bold">✓</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    switchDemo('admin@tiktokstudio.ai');
                    setDemoDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-purple-600/20 text-amber-300 font-medium flex items-center justify-between border-t border-slate-700/50 mt-1 pt-1.5"
                >
                  <span>👑 Admin (Total accès)</span>
                  {user?.role === 'admin' && <span className="text-amber-400 font-bold">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setUserDropdownOpen(!userDropdownOpen);
                setDemoDropdownOpen(false);
              }}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-purple-500/50 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs uppercase shadow-md">
                {user?.name ? user.name.slice(0, 2) : <UserIcon className="w-4 h-4" />}
              </div>
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 glass-panel-glow rounded-xl p-2 z-50 shadow-2xl border border-purple-500/30 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-700/60">
                  <p className="text-xs font-bold text-white truncate">{user?.name || 'Visiteur'}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold uppercase">
                      Plan {user?.plan || 'gratuit'}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onOpenProfile();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-purple-600/20 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                    <span>Mon profil & Transactions</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsPricingOpen(true);
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-purple-600/20 flex items-center gap-2"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Abonnements & Crédits</span>
                  </button>
                  <button
                    onClick={() => {
                      onOpenDeployGuide();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-200 hover:bg-purple-600/20 flex items-center gap-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Guide de déploiement</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-700/60">
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-purple-900/40 px-4 pt-2 pb-5 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                    : 'text-slate-300 hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-4 h-4 text-purple-400" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              Changer de compte
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => {
                  switchDemo('guest@demo.com');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-300"
              >
                Gratuit (5 cr.)
              </button>
              <button
                onClick={() => {
                  switchDemo('creator@tiktokstudio.ai');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded bg-purple-900/30 border border-purple-700/40 text-purple-200"
              >
                Creator (100 cr.)
              </button>
              <button
                onClick={() => {
                  switchDemo('pro@tiktokstudio.ai');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded bg-blue-900/30 border border-blue-700/40 text-blue-200"
              >
                Pro (350 cr.)
              </button>
              <button
                onClick={() => {
                  switchDemo('admin@tiktokstudio.ai');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded bg-amber-900/30 border border-amber-700/40 text-amber-200"
              >
                Admin (999 cr.)
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
