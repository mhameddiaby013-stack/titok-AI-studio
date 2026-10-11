import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Copy,
  Check,
  Download,
  Film,
  ArrowRight,
  Clock,
  Hash,
  Music,
  Share2,
  Layers,
  Flame,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { GeneratedScript, Scene } from '../types';

interface ScriptGeneratorProps {
  onSendToVideoStudio: (prompt: string, scenes: Scene[]) => void;
}

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ onSendToVideoStudio }) => {
  const { user, refreshUser, setIsPricingOpen } = useAuth();

  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('motivation');
  const [language, setLanguage] = useState('Français');
  const [tone, setTone] = useState('Énergique & Captivant');
  const [targetDuration, setTargetDuration] = useState('30-60s');

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);

  // Copy feedback states
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const categories = [
    { id: 'motivation', label: 'Motivation & Réussite', icon: '🔥' },
    { id: 'histoires', label: 'Histoires & Storytelling', icon: '📖' },
    { id: 'humour', label: 'Humour & Divertissement', icon: '😂' },
    { id: 'faits', label: 'Faits & Mystères', icon: '🧠' },
    { id: 'documentaire', label: 'Documentaire Court', icon: '🌍' },
    { id: 'animation', label: 'Concept Visuel & 3D', icon: '🎨' },
    { id: 'education', label: 'Éducation & Tutos', icon: '🎓' },
    { id: 'marketing', label: 'Marketing & Vente', icon: '📈' },
  ];

  const languages = ['Français', 'English', 'Español', 'Deutsch', 'Italiano', 'Português', 'Arabe'];

  const tones = [
    'Énergique & Captivant',
    'Mystérieux & Sombre',
    'Drôle & Décalé',
    'Pédagogique & Clair',
    'Émouvant & Inspirant',
    'Luxe & Cinématique'
  ];

  const durations = [
    { id: '15-30s', label: 'Court (15-30s)', desc: 'Idéal pour retenir l\'attention' },
    { id: '30-60s', label: 'Standard (30-60s)', desc: 'Recommandé par l\'algorithme' },
    { id: '60-90s', label: 'Long (60-90s)', desc: 'Pour histoires et tutos profonds' },
  ];

  const quickIdeas = [
    '3 secrets psychologiques pour arrêter de procrastiner',
    'Pourquoi l\'intelligence artificielle va changer les métiers créatifs',
    'L\'erreur fatale que font 99% des débutants en musculation',
    'Une histoire vraie de cambriolage impossible résolue par un détail',
    '5 sites web gratuits tellement puissants qu\'ils devraient être illégaux',
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Veuillez entrer une idée ou un sujet de vidéo.');
      return;
    }

    if ((user?.credits ?? 0) < 1 && user?.role !== 'admin') {
      setError('Solde insuffisant (1 crédit requis). Veuillez recharger vos crédits.');
      setIsPricingOpen(true);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const res = await api.generateScript({
        topic,
        category,
        language,
        tone,
        targetDuration,
      });

      if (res.script) {
        setGeneratedScript(res.script);
        refreshUser();
      }
    } catch (err: any) {
      console.error('Error generating script:', err);
      setError(err?.message || 'Erreur lors de la génération du script. Réessayez dans un instant.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const downloadText = (script: GeneratedScript) => {
    const content = `=== TIKTOK AI STUDIO - SCRIPT OFFICIEL ===
TITRE: ${script.title}
TITRES ALTERNATIFS: ${script.alternativeTitles?.join(' | ') || 'N/A'}
ACCROCHE (HOOK 0-3S): ${script.hook}
DURÉE ESTIMÉE: ${script.estimatedDuration}

--- SCRIPT PARLÉ COMPLET ---
${script.fullScript}

--- DÉCOUPAGE EN SCÈNES 9:16 ---
${script.scenes.map(s => `[SCÈNE ${s.sceneNumber} - ${s.timestamp}]
Visuel 9:16: ${s.visualPrompt916}
Texte à l'écran: ${s.textOnScreen}
Paroles: ${s.speech}
Caméra: ${s.cameraAngle}
`).join('\n')}

--- PROMPT VÉO / MODÈLE VIDÉO IA 9:16 ---
${script.veoPrompt}

--- DESCRIPTION & HASHTAGS TIKTOK ---
${script.description}
${script.hashtags.join(' ')}

--- AMBIANCE SONORE RECOMMANDÉE ---
${script.soundSuggestion}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tiktok-script-${script.title.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-900/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Générateur de Scripts <span className="tiktok-gradient-text">Viraux IA</span>
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Propulsé par Google Gemini 3.8 Flash • Optimisé pour l'attention 9:16 TikTok, Shorts & Reels
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-900/90 border border-purple-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-slate-300">Coût :</span>
          <span className="font-bold text-white">1 crédit</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Solde : {user?.credits ?? 0}</span>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Config Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border-purple-500/20 space-y-5">
            {/* Topic Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                1. Sujet ou Idée de ta vidéo
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex : 3 habitudes quotidiennes qui détruisent secrètement ton cerveau..."
                rows={3}
                className="w-full px-3.5 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-slate-500 text-sm resize-none transition-colors"
              />

              {/* Quick suggestion chips */}
              <div className="space-y-1 pt-1">
                <span className="text-[11px] text-slate-400">Idées tendances rapides :</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickIdeas.map((idea, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTopic(idea)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 truncate max-w-full text-left transition-colors"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                2. Catégorie TikTok
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                      category === cat.id
                        ? 'bg-purple-600/30 text-purple-200 border border-purple-500/60 shadow-sm shadow-purple-500/20'
                        : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800/80 border border-slate-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span className="truncate">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone & Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  3. Ton & Ambiance
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs focus:border-purple-500"
                >
                  {tones.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                  4. Langue
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs focus:border-purple-500"
                >
                  {languages.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Target Duration */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
                5. Durée ciblée (Format vertical 9:16)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {durations.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setTargetDuration(d.id)}
                    className={`p-2 rounded-xl text-center transition-all ${
                      targetDuration === d.id
                        ? 'bg-gradient-to-r from-purple-600/30 to-cyan-500/30 text-white border border-purple-500/50'
                        : 'bg-slate-900/70 text-slate-400 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold">{d.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isGenerating
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-purple-600/30 hover:scale-[1.01]'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                  <span>Génération en cours via Gemini 3.8...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Générer le script IA (1 crédit)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7">
          {generatedScript ? (
            <div className="space-y-6">
              {/* Output Actions Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 glass-panel rounded-2xl border-purple-500/30">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-200">Script prêt à exploiter</span>
                  <span className="text-xs text-slate-400">({generatedScript.estimatedDuration})</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadText(generatedScript)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Télécharger (.txt)</span>
                  </button>

                  <button
                    onClick={() => onSendToVideoStudio(generatedScript.veoPrompt, generatedScript.scenes)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-xs font-bold text-white shadow-md transition-all"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Ouvrir en Studio Vidéo 9:16</span>
                  </button>
                </div>
              </div>

              {/* 1. Viral Hook (Accroche 0-3s) */}
              <div className="glass-panel-glow p-5 rounded-2xl space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-pink-400" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-pink-400">
                      Accroche Virale (Hook 0-3 secondes)
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generatedScript.hook, 'hook')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-black/30"
                  >
                    {copiedSection === 'hook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSection === 'hook' ? 'Copié' : 'Copier'}</span>
                  </button>
                </div>

                <p className="text-white text-base sm:text-lg font-black leading-snug">
                  « {generatedScript.hook} »
                </p>
                <p className="text-[11px] text-slate-400">
                  Cette phrase est conçue pour stopper immédiatement le pouce des utilisateurs TikTok.
                </p>
              </div>

              {/* 2. Titles & Alternatives */}
              <div className="glass-panel p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                    Titres Viraux Recommandés
                  </span>
                  <button
                    onClick={() => copyToClipboard(generatedScript.title, 'title')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-black/30"
                  >
                    {copiedSection === 'title' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copier le titre</span>
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-white font-bold text-sm">
                  {generatedScript.title}
                </div>
                {generatedScript.alternativeTitles && generatedScript.alternativeTitles.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-slate-400">Variantes pour A/B testing :</span>
                    <div className="space-y-1">
                      {generatedScript.alternativeTitles.map((alt, i) => (
                        <div key={i} className="text-xs text-slate-300 pl-3 border-l-2 border-slate-700 py-0.5">
                          {alt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Full Script */}
              <div className="glass-panel p-5 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Script Parlé Complet (Minuté)
                  </span>
                  <button
                    onClick={() => copyToClipboard(generatedScript.fullScript, 'fullScript')}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-black/30"
                  >
                    {copiedSection === 'fullScript' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copier le script</span>
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-line font-normal">
                  {generatedScript.fullScript}
                </div>
              </div>

              {/* 4. Scene by Scene Breakdown */}
              <div className="glass-panel p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                      Découpage des Scènes (Format 9:16)
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">{generatedScript.scenes?.length || 0} scènes</span>
                </div>

                <div className="space-y-3">
                  {generatedScript.scenes?.map((scene, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-purple-300">
                          Scène #{scene.sceneNumber} • {scene.timestamp}
                        </span>
                        <span className="text-[11px] text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {scene.cameraAngle}
                        </span>
                      </div>

                      <div className="text-xs text-slate-300 space-y-1">
                        <div>
                          <span className="text-slate-400 font-semibold">Visuel 9:16 : </span>
                          <span className="text-slate-200">{scene.visualPrompt916}</span>
                        </div>
                        {scene.textOnScreen && (
                          <div>
                            <span className="text-pink-400 font-bold">Texte à l'écran : </span>
                            <span className="bg-pink-950/40 text-pink-200 px-1.5 py-0.5 rounded text-[11px] font-mono">
                              {scene.textOnScreen}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-cyan-400 font-semibold">Paroles : </span>
                          <span className="italic text-slate-300">"{scene.speech}"</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Master Veo Video Prompt */}
              {generatedScript.veoPrompt && (
                <div className="glass-panel p-5 rounded-2xl space-y-2 border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      Master Prompt Veo / IA Vidéo 9:16
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedScript.veoPrompt, 'veoPrompt')}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-black/30"
                    >
                      {copiedSection === 'veoPrompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copier le prompt Veo</span>
                    </button>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 font-mono text-xs text-cyan-200/90 border border-cyan-500/30">
                    {generatedScript.veoPrompt}
                  </div>
                </div>
              )}

              {/* 6. Description, Hashtags & Audio */}
              <div className="glass-panel p-5 rounded-2xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Publication TikTok & SEO
                </span>
                <p className="text-xs text-slate-300">{generatedScript.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {generatedScript.hashtags?.map((tag, i) => (
                    <span key={i} className="text-xs text-cyan-400 font-mono bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                      {tag}
                    </span>
                  ))}
                </div>
                {generatedScript.soundSuggestion && (
                  <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                    <Music className="w-3.5 h-3.5 text-pink-400" />
                    <span>Ambiance sonore recommandée : {generatedScript.soundSuggestion}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty State Placeholder */
            <div className="h-full min-h-[460px] glass-panel rounded-2xl border-purple-500/10 flex flex-col items-center justify-center p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-900/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h3 className="text-lg font-bold text-white">Ton script apparaîtra ici</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Renseigne ton sujet sur la gauche et clique sur « Générer le script IA ».
                  L'intelligence artificielle va structurer ton accroche, tes scènes 9:16 et tes prompts prêts pour la vidéo.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
