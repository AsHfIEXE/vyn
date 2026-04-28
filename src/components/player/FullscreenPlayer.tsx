import React, { useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { audioController } from '../../audio/AudioController';
import { Play, Pause, SkipForward, SkipBack, Volume2, ChevronDown, Heart, Mic2, Shuffle, Repeat, ListMusic, MoreHorizontal } from 'lucide-react';

interface FullscreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullscreenPlayer: React.FC<FullscreenPlayerProps> = ({ isOpen, onClose }) => {
  const { currentTrack, isPlaying, togglePlay, volume, setVolume, currentTime, duration } = usePlayerStore();
  const [showLyrics, setShowLyrics] = useState(true);

  // Don't render if not open
  if (!isOpen) return null;

  const handlePlayPause = () => {
    if (isPlaying) audioController.pause(); else audioController.play();
    togglePlay();
  };

  const handlePrev = () => {
    usePlayerStore.getState().prevTrack();
    const track = usePlayerStore.getState().currentTrack;
    if (track?.path) {
      audioController.load(track.path, 'mp3');
      audioController.play();
    }
  };

  const handleNext = () => {
    usePlayerStore.getState().nextTrack();
    const track = usePlayerStore.getState().currentTrack;
    if (track?.path) {
      audioController.load(track.path, 'mp3');
      audioController.play();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07070d]">
      {/* Background with blur */}
      <div className="absolute inset-0 bg-[#6366f1]/20 blur-3xl" />
      {currentTrack?.artUrl && (
        <img 
          src={currentTrack.artUrl} 
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-3xl" 
          alt=""
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07070d]" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
          <ChevronDown className="w-6 h-6 text-white" />
        </button>
        <button 
          onClick={() => setShowLyrics(!showLyrics)} 
          className={`p-3 rounded-full transition-colors ${showLyrics ? 'bg-white/10 text-white' : 'text-white/40'}`}
        >
          <Mic2 className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 gap-6">
        
        {/* Album Art */}
        <div className="w-64 md:w-80 lg:w-96 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          {currentTrack?.artUrl ? (
            <img src={currentTrack.artUrl} className="w-full aspect-square object-cover" alt={currentTrack.title} />
          ) : (
            <div className="w-full aspect-square bg-[#141422] flex items-center justify-center">
              <div className="w-16 h-16 text-white/10">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="text-center w-full max-w-md">
          <p className="text-xs text-[#6366f1] uppercase tracking-widest mb-1">Now Playing</p>
          <h2 className="text-2xl md:text-3xl font-syne font-extrabold truncate">{currentTrack?.title || 'No Track'}</h2>
          <p className="text-lg text-white/60">{currentTrack?.artist || 'Unknown Artist'}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md space-y-2">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#6366f1] rounded-full transition-all" 
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/40 font-mono">
            <span>{Math.floor(currentTime / 60)}:{((currentTime % 60) | 0).toString().padStart(2, '0')}</span>
            <span>{Math.floor(duration / 60)}:{((duration % 60) | 0).toString().padStart(2, '0')}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 md:gap-6">
          <button onClick={handlePrev} className="text-white/60 hover:text-white p-2"><SkipBack className="w-6 h-6" /></button>
          <button onClick={handlePlayPause} className="w-12 h-12 md:w-14 md:h-14 bg-[#6366f1] rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 transition-transform">
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
          </button>
          <button onClick={handleNext} className="text-white/60 hover:text-white p-2"><SkipForward className="w-6 h-6" /></button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 w-full max-w-xs">
          <Volume2 className="w-4 h-4 text-white/30" />
          <input 
            type="range" min="0" max="1" step="0.01" 
            value={volume} 
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              audioController.setVolume(val);
            }}
            className="flex-1 h-1 bg-white/10 rounded appearance-none accent-[#6366f1]"
          />
        </div>

        {/* Lyrics Panel (Simplified) */}
        {showLyrics && (
          <div className="w-full h-64 md:h-80 mt-4 bg-white/5 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Mic2 className="w-8 h-8 text-white/20 mx-auto mb-2" />
              <p className="text-white/40">Lyrics panel - to be enhanced with am-lyrics</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};