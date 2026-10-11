import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Play,
  Pause,
  RotateCcw,
  Download,
  Zap,
  Sparkles,
  Layers,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Film,
  Sliders,
  Share2,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { VideoProject, Scene } from '../types';

interface VideoStudioProps {
  initialPrompt?: string;
  initialScenes?: Scene[];
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  initialPrompt = '',
  initialScenes = [],
}) => {
  const { user, refreshUser, setIsPricingOpen } = useAuth();

  const [prompt, setPrompt] = useState(initialPrompt);
  const [style, setStyle] = useState('Cinématique Réaliste');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [durationSeconds, setDurationSeconds] = useState(5);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentVideo, setCurrentVideo] = useState<VideoProject | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Player state
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const styles = [
    { id: 'Cinématique Réaliste', desc: 'Éclairage cinéma, bokeh 35mm, textures 4k', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500&q=80' },
    { id: 'Cyberpunk Futuriste', desc: 'Néons vifs, reflets holographiques, ambiance nuit', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&q=80' },
    { id: '3D Disney/Pixar', desc: 'Animation stylisée, couleurs vibrantes, personnages expressifs', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80' },
    { id: 'Anime Japonais', desc: 'Lignes épurées, esthétique Shonen / Ghibli dynamique', img: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&q=80' },
    { id: 'Rétro VHS', desc: 'Grain vintage 90s, glitch analogique, nostalgie', img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=80' },
    { id: 'Studio Photo', desc: 'Lumière diffuse blanche, contraste moderne, ultra net', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&q=80' },
  ];

  // Auto rotate scene cues when playing
  useEffect(() => {
    if (!isPlaying || !currentVideo?.scenes || currentVideo.scenes.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSceneIndex((prev) => (prev + 1) % (currentVideo.scenes?.length || 1));
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying, currentVideo]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Veuillez décrire la scène ou le sujet de la vidéo.');
      return;
    }

    if ((user?.credits ?? 0) < 2 && user?.role !== 'admin') {
      setError('Solde insuffisant (2 crédits requis). Veuillez recharger vos crédits.');
      setIsPricingOpen(true);
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgressPercent(15);
    setProgressStep('Analyse sémantique du prompt 9:16...');

    try {
      setTimeout(() => {
        setProgressPercent(40);
        setProgressStep('Connexion au pipeline vidéo (Veo / Studio Engine)...');
      }, 700);

      setTimeout(() => {
        setProgressPercent(75);
        setProgressStep('Composition des trames verticales & sous-titres dynamiques...');
      }, 1500);

      const res = await api.generateVideo({
        prompt,
        style,
        aspectRatio,
        durationSeconds,
        scenes: initialScenes,
      });

      setProgressPercent(100);
      setProgressStep('Vidéo prête !');

      if (res.video) {
        setCurrentVideo(res.video);
        refreshUser();
      }
    } catch (err: any) {
      console.error('Video generation error:', err);
      setError(err?.message || 'Erreur lors de la génération. Veuillez vérifier votre solde et réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentScene = currentVideo?.scenes?.[activeSceneIndex] || currentVideo?.scenes?.[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-900/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/30">
              <Film className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Studio Vidéo <span className="tiktok-gradient-text">9:16 Vertical</span>
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Générateur vidéo alimenté par Veo & modèles verticaux TikTok, Shorts et Reels
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-900/90 border border-cyan-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">Coût :</span>
          <span className="font-bold text-white">2 crédits</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Solde : {user?.credits ?? 0}</span>
        </div>
      </div>

      {/* Main Grid: Controls Left, 9:16 Vertical Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border-cyan-500/20 space-y-5">
            {/* Prompt description */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                1. Description ou Prompt de la Vidéo
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex : Un créateur moderne dans un bureau néon futuriste expliquant avec énergie une astuce virale, zoom dynamique, éclairage violet et cyan 9:16..."
                rows={4}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-white placeholder-slate-500 text-sm resize-none transition-colors"
              />
            </div>

            {/* Visual Style Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                2. Style Visuel
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setStyle(s.id)}
                    className={`relative p-2.5 rounded-xl text-left border transition-all overflow-hidden group ${
                      style === s.id
                        ? 'border-cyan-400 bg-cyan-950/40 shadow-sm shadow-cyan-500/20 ring-1 ring-cyan-500'
                        : 'border-slate-800 bg-slate-900/70 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs text-white group-hover:text-cyan-300">
                      {s.id}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-1 line-clamp-2">
                      {s.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Format & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  3. Format d'Affichage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAspectRatio('9:16')}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                      aspectRatio === '9:16'
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white'
                        : 'bg-slate-900/70 text-slate-400 border border-slate-800'
                    }`}
                  >
                    9:16 Vertical (TikTok)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAspectRatio('16:9')}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                      aspectRatio === '16:9'
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white'
                        : 'bg-slate-900/70 text-slate-400 border border-slate-800'
                    }`}
                  >
                    16:9 Paysage (YouTube)
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  4. Durée du Rendu
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDurationSeconds(5)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                      durationSeconds === 5
                        ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/60'
                        : 'bg-slate-900/70 text-slate-400 border border-slate-800'
                    }`}
                  >
                    5 secondes (Rapide)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDurationSeconds(10)}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center ${
                      durationSeconds === 10
                        ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/60'
                        : 'bg-slate-900/70 text-slate-400 border border-slate-800'
                    }`}
                  >
                    10 secondes (HD)
                  </button>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Progress indicator during generation */}
            {isGenerating && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-cyan-300">{progressStep}</span>
                  <span className="font-mono text-cyan-400">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-pink-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isGenerating
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-500 hover:from-cyan-500 hover:to-pink-400 shadow-cyan-600/30 hover:scale-[1.01]'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Génération vidéo en cours...</span>
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  <span>Générer ma vidéo (2 crédits)</span>
                </>
              )}
            </button>
          </div>

          {/* Model & Quota Transparency Note */}
          <div className="glass-panel p-4 rounded-xl text-xs text-slate-300 border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-cyan-300">
              <Info className="w-4 h-4" />
              <span>Transparence & Intégration API Vidéo</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Le studio intègre les endpoints du modèle officiel Google Veo (<code className="text-cyan-300">veo-3.1-lite-generate-preview</code>).
              Sur les projets avec clé gratuite sans facturation Cloud activée, le studio active automatiquement
              l'aperçu haute résolution 9:16 avec prompts prêts à être exportés sans prétendre faussement avoir généré un MP4 Veo si le quota n'est pas actif.
            </p>
          </div>
        </div>

        {/* Right Panel: Interactive TikTok 9:16 Video Player */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-[300px] sm:w-[320px] aspect-[9/18] rounded-[40px] p-3 bg-gradient-to-b from-slate-700 via-slate-900 to-black shadow-2xl shadow-cyan-950/60 border-4 border-slate-700/80">
            {/* Phone speaker notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center">
              <div className="w-10 h-1.5 bg-slate-800 rounded-full" />
            </div>

            {/* Inside 9:16 Display */}
            <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-black flex flex-col justify-between">
              {/* Visual scene image / canvas */}
              <div className="absolute inset-0 z-0">
                <img
                  src={
                    currentVideo?.previewThumbnail ||
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&q=80'
                  }
                  alt="Aperçu vidéo 9:16"
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    isPlaying ? 'scale-105 brightness-100' : 'scale-100 brightness-75'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
              </div>

              {/* Top Controls */}
              <div className="relative z-10 pt-7 px-4 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-semibold text-[10px]">TIKTOK 9:16</span>
                </div>
                <div className="text-[10px] bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-700 text-slate-300">
                  {currentVideo ? `${durationSeconds}s` : 'En attente'}
                </div>
              </div>

              {/* Center Play Button & Active Subtitle */}
              <div className="relative z-10 px-4 text-center space-y-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 mx-auto rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105 shadow-2xl cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                </button>

                {currentScene && (
                  <div className="p-3 rounded-xl bg-black/70 backdrop-blur-md border border-cyan-500/30 shadow-lg">
                    <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold block">
                      {currentScene.timestamp || '00:00 - 00:05'}
                    </span>
                    <p className="text-white text-xs font-black leading-snug mt-1">
                      {currentScene.textOnScreen || currentScene.speech || prompt.slice(0, 40)}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Creator Info & Actions */}
              <div className="relative z-10 p-4 pb-6 space-y-3">
                <div className="space-y-1">
                  <div className="text-white text-xs font-bold drop-shadow">
                    {currentVideo?.title || 'TikTok AI Studio'}
                  </div>
                  <p className="text-slate-300 text-[11px] line-clamp-2 drop-shadow">
                    {currentVideo?.prompt || 'Générez votre première vidéo pour voir le rendu ici'}
                  </p>
                </div>

                {currentVideo && (
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={currentVideo.previewThumbnail || '#'}
                      download="tiktok-scene-916.jpg"
                      className="w-full py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger (.mp4 / frame)</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
