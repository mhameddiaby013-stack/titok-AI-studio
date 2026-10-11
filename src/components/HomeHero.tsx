import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Play,
  Pause,
  Heart,
  MessageCircle,
  Share2,
  Music,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Video,
  Flame,
  Wand2,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HomeHeroProps {
  onStartCreation: () => void;
  onGoToVideo: () => void;
  onGoToPricing: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onStartCreation,
  onGoToVideo,
  onGoToPricing,
}) => {
  const { user, switchDemo } = useAuth();
  const [isPlaying, setIsPlaying] = useState(true);
  const [likes, setLikes] = useState(24800);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="relative overflow-hidden pt-6 pb-16 lg:pt-12 lg:pb-24">
      {/* Background ambient neon glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-pink-600/10 to-cyan-500/20 blur-[130px] -z-10 rounded-full pointer-events-none" />
      <div className="absolute -top-10 left-10 w-72 h-72 bg-purple-700/15 blur-[100px] -z-10 rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-600/15 blur-[110px] -z-10 rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-semibold backdrop-blur-md shadow-sm">
              <Flame className="w-4 h-4 text-pink-400" />
              <span>Générateur IA TikTok & Shorts 9:16</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            </div>

            {/* Slogan & Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Transforme tes idées en{' '}
              <span className="tiktok-gradient-text">vidéos IA</span> virales.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Crée des scripts hypnotiques en 3 secondes, des découpages de scènes
              cinématiques et des vidéos verticales prêtes pour TikTok, Reels et Shorts.
              Profite de crédits gratuits dès l'inscription.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onStartCreation}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-base shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
              >
                <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>Créer ma première vidéo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onGoToVideo}
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-purple-500/50 text-slate-200 font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Video className="w-5 h-5 text-cyan-400" />
                <span>Studio Vidéo 9:16</span>
              </button>
            </div>

            {/* Micro assurances */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>5 crédits offerts à l'inscription</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sans carte bancaire requise</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Format 9:16 vertical natif</span>
              </div>
            </div>

            {/* Quick Demo Switcher Strip */}
            <div className="pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Essai instantané :</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    onClick={() => switchDemo('guest@demo.com')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      user?.plan === 'free'
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Visiteur Gratuit (5 cr.)
                  </button>
                  <button
                    onClick={() => switchDemo('creator@tiktokstudio.ai')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      user?.plan === 'creator'
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Creator (100 cr.)
                  </button>
                  <button
                    onClick={() => switchDemo('pro@tiktokstudio.ai')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      user?.plan === 'pro' && user?.role !== 'admin'
                        ? 'bg-blue-600/30 text-blue-200 border border-blue-500/50'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Pro (350 cr.)
                  </button>
                  <button
                    onClick={() => switchDemo('admin@tiktokstudio.ai')}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                      user?.role === 'admin'
                        ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50'
                        : 'bg-slate-800/80 text-amber-300/80 hover:bg-slate-800'
                    }`}
                  >
                    Admin Total (999 cr.)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Realistic TikTok 9:16 Smartphone Mockup with Interactive Player */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[300px] sm:w-[320px] aspect-[9/18] rounded-[42px] p-3 bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 shadow-2xl shadow-purple-950/80 border-4 border-slate-700/80">
              {/* Phone Speaker Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center">
                <div className="w-10 h-1.5 bg-slate-800 rounded-full" />
                <div className="w-2.5 h-2.5 bg-slate-900 rounded-full ml-3" />
              </div>

              {/* Inside Screen 9:16 */}
              <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-black flex flex-col justify-between">
                {/* Visual Background (Cinematic Loop representation) */}
                <div className="absolute inset-0 z-0">
                  <img
                    src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&q=80"
                    alt="Aperçu vidéo TikTok IA"
                    className={`w-full h-full object-cover transition-transform duration-1000 ${
                      isPlaying ? 'scale-105 filter brightness-105' : 'scale-100 filter brightness-90'
                    }`}
                  />
                  {/* Subtle dark overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90" />
                </div>

                {/* Top Live Bar */}
                <div className="relative z-10 pt-7 px-4 flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="font-semibold text-[11px]">STUDIO 9:16</span>
                  </div>
                  <div className="font-mono text-[11px] text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                    Gemini 3.8
                  </div>
                </div>

                {/* Center Animated Subtitles & Play Toggle */}
                <div className="relative z-10 px-4 text-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-14 h-14 mx-auto rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 shadow-xl"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                  </button>

                  <div className="mt-4 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-purple-500/40 shadow-lg">
                    <span className="text-[11px] uppercase tracking-wider text-pink-400 font-extrabold block">
                      Accroche Virale 0-3s
                    </span>
                    <p className="text-white text-sm font-black leading-snug mt-0.5">
                      « ARRÊTE DE SCROLLER ! 90% font cette erreur... »
                    </p>
                  </div>
                </div>

                {/* Bottom TikTok Metadata & Right Engagement Icons */}
                <div className="relative z-10 p-4 pb-6 flex items-end justify-between">
                  {/* Bottom Creator Info */}
                  <div className="space-y-1.5 max-w-[75%]">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-[10px] font-bold text-white">
                        IA
                      </div>
                      <span className="text-white text-xs font-bold drop-shadow">@tiktok.ai.studio</span>
                    </div>
                    <p className="text-white text-xs font-medium leading-tight line-clamp-2 drop-shadow">
                      3 astuces psychologiques pour exploser la rétention 🧠 #tiktokfrance #ia
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-300">
                      <Music className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                      <span className="truncate">Son original - Beat Phonk Viral</span>
                    </div>
                  </div>

                  {/* Right Social Actions */}
                  <div className="flex flex-col items-center gap-3.5 text-white">
                    <button
                      onClick={handleLike}
                      className="flex flex-col items-center gap-0.5 group"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                          hasLiked ? 'bg-pink-600 text-white' : 'bg-black/50 text-white group-hover:bg-black/70'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${hasLiked ? 'fill-white' : ''}`} />
                      </div>
                      <span className="text-[10px] font-bold">{(likes / 1000).toFixed(1)}k</span>
                    </button>

                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold">428</span>
                    </div>

                    <div className="flex flex-col items-center gap-0.5">
                      <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold">1.2k</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Step Workflow Process */}
        <div className="mt-20 lg:mt-28">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-purple-400 font-extrabold">
              Fonctionnement en 3 étapes simples
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              De l'idée brute à la vidéo prête à publier
            </h2>
            <p className="text-sm text-slate-400">
              Notre intelligence artificielle structure ton contenu selon les algorithmes de recommandation actuels.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="glass-panel p-6 rounded-2xl relative border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300 font-extrabold text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Idée & Script Viral</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tape ton sujet. Gemini 3.8 Flash compose une accroche (hook) 0-3s, un script minuté mot-à-mot et des titres A/B conçus pour maximiser le taux de rétention.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-6 rounded-2xl relative border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-extrabold text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Prompts & Studio 9:16</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Chaque phrase est découpée en scènes visuelles détaillées avec prompts optimisés pour Veo et les générateurs vidéo modernes en format vertical immersif.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-6 rounded-2xl relative border-pink-500/20 hover:border-pink-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-pink-600/30 border border-pink-500/40 flex items-center justify-center text-pink-300 font-extrabold text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Export & Publication</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Télécharge le script, les prompts Veo, la description optimisée SEO, les hashtags ciblés et visionne le rendu dynamique directement dans le lecteur TikTok.
              </p>
            </div>
          </div>
        </div>

        {/* Plan Comparison Teaser */}
        <div className="mt-20 p-8 glass-panel-glow rounded-3xl text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl font-extrabold text-white">
              Une offre gratuite pour débuter, des forfaits adaptés pour grandir
            </h3>
            <p className="text-sm text-slate-300">
              Démarre avec 5 crédits offerts, puis accède à Creator (5 $/mois) ou Pro (15 $/mois) pour débloquer des quotas de crédits supérieurs.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onGoToPricing}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              Voir la grille tarifaire complète
            </button>
            <button
              onClick={onStartCreation}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
            >
              Tester le générateur maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
