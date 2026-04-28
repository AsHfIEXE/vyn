import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayerStore } from '../../store/playerStore';
import { audioController } from '../../audio/AudioController';
import { Play, Plus, Sparkles, Clock, Heart, TrendingUp, Library, ListMusic, Disc, ChevronRight } from 'lucide-react';
import { parseMetadata } from '../../utils/metadataParser'; // Static import

export const HomeView: React.FC = () => {
  const navigate = useNavigate();
  const { setTrack } = usePlayerStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [songs, setSongs] = useState<any[]>([]);
  
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const parsedSongs = await Promise.all(files.map(async (file, i) => {
      try {
        const metadata = await parseMetadata(file);
        
        let artUrl = null;
        if (metadata.picture) {
          const blob = new Blob([metadata.picture.data], { type: metadata.picture.format });
          artUrl = URL.createObjectURL(blob);
        }

        return {
          id: Date.now() + i,
          title: metadata.title || file.name.replace(/\.[^/.]+$/, ''),
          artist: metadata.artist || 'Unknown Artist',
          album: metadata.album || 'Unknown Album',
          duration: metadata.duration || 0, // Ensure duration is a number
          path: URL.createObjectURL(file),
          artUrl: artUrl
        };
      } catch (err) {
        console.error('Metadata error:', err); // Log the actual error
        return {
          id: Date.now() + i,
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Unknown Artist',
          album: 'Unknown Album',
          duration: 0,
          path: URL.createObjectURL(file),
          artUrl: null
        };
      }
    }));
    setSongs(prev => [...prev, ...parsedSongs]);
  };

  const handlePlay = (song: any) => {
    setTrack(song);
    audioController.load(song.path, 'mp3');
    audioController.play();
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl p-6 md:p-8 bg-gradient-to-br from-[#0f0f18] via-[#141422] to-[#07070d] border border-white/5">
        <div className="absolute top-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-[#6366f1]/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[#6366f1] text-xs font-medium uppercase tracking-widest mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Immersive Audio</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-syne font-extrabold mb-2">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Vyn</span>
          </h1>
          <p className="text-white/50 text-sm mb-4 max-w-md">
            Experience music with word-by-word lyrics and dynamic visual themes.
          </p>
          <div className="flex gap-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Music
            </button>
            <button 
              onClick={() => navigate('/library')}
              className="btn-secondary flex items-center gap-2"
            >
              <Library className="w-4 h-4" />
              Browse
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              multiple 
              accept="audio/*" 
              className="hidden" 
              onChange={handleFileSelect} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <QuickCard icon={Clock} label="Recent" count={songs.length} onClick={() => navigate('/library')} />
        <QuickCard icon={Heart} label="Liked" count={0} onClick={() => navigate('/library')} />
        <QuickCard icon={ListMusic} label="Playlists" count={0} onClick={() => navigate('/playlists')} />
        <QuickCard icon={TrendingUp} label="Top Played" count={0} onClick={() => navigate('/library')} />
      </div>

      {songs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-syne font-bold">Recent</h2>
            <button onClick={() => navigate('/library')} className="text-xs text-white/40 hover:text-white flex items-center gap-1">
              See All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {songs.slice(0, 6).map((song, i) => (
              <div 
                key={song.id || i} 
                onClick={() => handlePlay(song)}
                className="group relative bg-[#141422] rounded-2xl overflow-hidden cursor-pointer hover:bg-[#1a1a2a] transition-all duration-300"
              >
                <div className="aspect-square bg-[#0f0f18] flex items-center justify-center">
                  {song.artUrl ? (
                    <img src={song.artUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={song.title} />
                  ) : (
                    <Disc className="w-8 h-8 text-white/10" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-[#6366f1] rounded-full flex items-center justify-center shadow-xl">
                      <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{song.title}</p>
                  <p className="text-xs text-white/40 truncate">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {songs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-[#141422] rounded-full flex items-center justify-center mb-6 ring-1 ring-white/5">
            <Disc className="w-10 h-10 text-white/20" />
          </div>
          <h2 className="text-2xl font-syne font-bold mb-2">Your library is empty</h2>
          <p className="text-white/40 max-w-sm mb-6">Drag and drop your favorite music files anywhere to build your collection.</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="btn-secondary px-6 py-3 rounded-full"
          >
            Import Files
          </button>
        </div>
      )}
    </div>
  );
};

const QuickCard = ({ icon: Icon, label, count, onClick }: { icon: any; label: string; count: number; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="group relative p-5 rounded-2xl bg-[#141422] border border-white/5 cursor-pointer overflow-hidden hover:border-white/10 transition-all text-left"
  >
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#6366f1]/20 to-transparent rounded-bl-full" />
    <Icon className="w-6 h-6 mb-3 text-white/40 group-hover:text-white transition-colors" />
    <p className="text-lg font-syne font-bold">{label}</p>
    <p className="text-sm text-white/40">{count} items</p>
  </button>
);