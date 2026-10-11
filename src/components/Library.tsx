import React, { useState, useEffect } from 'react';
import {
  FolderHeart,
  FileText,
  Video,
  Download,
  Copy,
  Trash2,
  Check,
  Play,
  Clock,
  Sparkles,
  RefreshCw,
  Search
} from 'lucide-react';
import { api } from '../api';
import { GeneratedScript, VideoProject } from '../types';

interface LibraryProps {
  onOpenVideoStudio: (prompt: string, scenes?: any[]) => void;
}

export const Library: React.FC<LibraryProps> = ({ onOpenVideoStudio }) => {
  const [filter, setFilter] = useState<'all' | 'scripts' | 'videos'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [scripts, setScripts] = useState<GeneratedScript[]>([]);
  const [videos, setVideos] = useState<VideoProject[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchLibrary = async () => {
    setLoading(true);
    try {
      const data = await api.getLibrary();
      setScripts(data.scripts || []);
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Failed to load library:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  const handleDelete = async (type: 'script' | 'video', id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) return;
    try {
      await api.deleteLibraryItem(type, id);
      if (type === 'script') {
        setScripts(prev => prev.filter(s => s.id !== id));
      } else {
        setVideos(prev => prev.filter(v => v.id !== id));
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const copyScript = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredScripts = scripts.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.topic.toLowerCase().includes(search.toLowerCase()) ||
    s.hook.toLowerCase().includes(search.toLowerCase())
  );

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(search.toLowerCase()) ||
    v.prompt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-900/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <FolderHeart className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ma Bibliothèque de <span className="tiktok-gradient-text">Créations</span>
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Retrouve tous tes scripts viraux, hooks et rendus vidéo 9:16 enregistrés
          </p>
        </div>

        <button
          onClick={fetchLibrary}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Type tabs */}
        <div className="flex items-center bg-slate-900/90 border border-slate-800 p-1 rounded-xl text-xs w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tous ({scripts.length + videos.length})
          </button>
          <button
            onClick={() => setFilter('scripts')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'scripts'
                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Scripts ({scripts.length})
          </button>
          <button
            onClick={() => setFilter('videos')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg font-semibold transition-all ${
              filter === 'videos'
                ? 'bg-cyan-600/30 text-cyan-200 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Vidéos 9:16 ({videos.length})
          </button>
        </div>

        {/* Search field */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par titre ou mot-clé..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Grid Content */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-xs text-slate-400">Chargement de votre bibliothèque...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Scripts List */}
          {(filter === 'all' || filter === 'scripts') && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Scripts & Découpages ({filteredScripts.length})</span>
              </h2>

              {filteredScripts.length === 0 ? (
                <div className="p-8 rounded-2xl glass-panel text-center text-xs text-slate-400">
                  Aucun script trouvé.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredScripts.map((script) => (
                    <div
                      key={script.id}
                      className="glass-panel p-5 rounded-2xl border-purple-500/20 hover:border-purple-500/40 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold uppercase">
                            {script.category}
                          </span>
                          <h3 className="font-bold text-white text-sm mt-1">{script.title}</h3>
                        </div>
                        <button
                          onClick={() => handleDelete('script', script.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 italic">
                        « {script.hook} »
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                        <span>{new Date(script.createdAt).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyScript(script.fullScript, script.id)}
                            className="flex items-center gap-1 text-slate-300 hover:text-white"
                          >
                            {copiedId === script.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedId === script.id ? 'Copié' : 'Copier'}</span>
                          </button>

                          <button
                            onClick={() => onOpenVideoStudio(script.veoPrompt, script.scenes)}
                            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Ouvrir en Studio</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Videos List */}
          {(filter === 'all' || filter === 'videos') && (
            <div className="space-y-4 pt-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Video className="w-4 h-4" />
                <span>Rendus Vidéo 9:16 ({filteredVideos.length})</span>
              </h2>

              {filteredVideos.length === 0 ? (
                <div className="p-8 rounded-2xl glass-panel text-center text-xs text-slate-400">
                  Aucune vidéo trouvée.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => (
                    <div
                      key={video.id}
                      className="glass-panel rounded-2xl border-cyan-500/20 overflow-hidden space-y-3 p-3"
                    >
                      {/* 9:16 Video thumbnail */}
                      <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black group">
                        <img
                          src={video.previewThumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=720&q=80'}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-cyan-300">
                          9:16 • {video.style}
                        </div>

                        <button
                          onClick={() => onOpenVideoStudio(video.prompt, video.scenes)}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 ml-0.5" />
                          </div>
                        </button>
                      </div>

                      <div className="px-1 space-y-1">
                        <h4 className="font-bold text-white text-xs truncate">{video.title}</h4>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{video.prompt}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                        <span className="text-[11px] text-slate-500">
                          {new Date(video.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete('video', video.id)}
                            className="text-slate-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
