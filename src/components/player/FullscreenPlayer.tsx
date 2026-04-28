import React, { useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { audioController } from '../../audio/AudioController';
import { Play, Pause, SkipForward, SkipBack, Volume2, ChevronDown, Heart, Mic2, Shuffle, Repeat, ListMusic, MoreHorizontal } from 'lucide-react';
import { LyricsPanel } from './LyricsPanel';

interface FullscreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FullscreenPlayer: React.FC<FullscreenPlayerProps> = ({ isOpen, onClose }) => {
  const { currentTrack, isPlaying, togglePlay, volume, setVolume, currentTime, duration } = usePlayerStore();
  const [showLyrics, setShowLyrics] = useState(true);

  if (!isOpen) return null;

  const handlePlayPause = () => {
    if (isPlaying) audioController.pause(); else audioController.play();
    togglePlay();
  };

  const handlePrev = () => {
    usePlayerStore.getState().prevTrack();
    const track = usePlayerStore.getState().currentTrack;
    if (track?.path) {
      audioController.load(track.path, track.format || 'mp3');
      audioController.play();
    }
  };

  const handleNext = () => {
    usePlayerStore.getState().nextTrack();
    const track = usePlayerStore.getState().currentTrack;
    if (track?.path) {
      audioController.load(track.path, track.format || 'mp3');
      audioController.play();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#07070d] overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-accent/10 blur-[100px] transition-colors duration-700" />
      {currentTrack?.artUrl && (
        <img 
          src={currentTrack.artUrl} 
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-3xl scale-110" 
          alt=""
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between p-6">
        <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md">
          <ChevronDown className="w-6 h-6 text-white" />
        </button>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowLyrics(!showLyrics)} 
            className={`p-3 rounded-full transition-all duration-300 backdrop-blur-md ${showLyrics ? 'bg-white/20 text-white scale-110' : 'bg-white/5 text-white/40'}`}
          >
            <Mic2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row overflow-hidden">
        
        {/* Left Panel: Art & Controls */}
        <div className={`flex-1 flex flex-col items-center justify-center p-6 transition-all duration-500 ${showLyrics ? 'md:w-1/2' : 'w-full'}`}>
          
          {/* Album Art */}
          <div className="w-64 md:w-80 lg:w-[450px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 transition-transform duration-500 hover:scale-[1.02]">
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
          <div className="text-center w-full max-w-lg mt-8">
            <h2 className="text-3xl md:text-5xl font-syne font-extrabold truncate px-4">{currentTrack?.title || 'No Track'}</h2>
            <p className="text-xl text-white/60 mt-2 truncate px-4">{currentTrack?.artist || 'Unknown Artist'}</p>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-xl mt-10 space-y-3 px-6">
            <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden group cursor-pointer">
              <div 
                className="absolute h-full bg-accent rounded-full transition-all duration-100" 
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/40 font-mono">
              <span>{Math.floor(currentTime / 60)}:{((currentTime % 60) | 0).toString().padStart(2, '0')}</span>
              <span>{Math.floor(duration / 60)}:{((duration % 60) | 0).toString().padStart(2, '0')}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8 md:gap-12 mt-8">
            <button onClick={handlePrev} className="text-white/60 hover:text-white p-3 transition-colors">
              <SkipBack className="w-8 h-8 fill-current" />
            </button>
            <button onClick={handlePlayPause} className="w-16 h-16 md:w-20 md:h-20 bg-white text-black rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform">
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 ml-1 fill-current" />}
            </button>
            <button onClick={handleNext} className="text-white/60 hover:text-white p-3 transition-colors">
              <SkipForward className="w-8 h-8 fill-current" />
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-4 w-full max-w-xs mt-10 opacity-60 hover:opacity-100 transition-opacity">
            <Volume2 className="w-5 h-5 text-white/50" />
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={volume} 
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                audioController.setVolume(val);
              }}
              className="flex-1 h-1 bg-white/10 rounded appearance-none accent-white"
            />
          </div>
        </div>

        {/* Right Panel: Lyrics */}
        {showLyrics && (
          <div className="hidden md:flex md:w-1/2 h-full relative animate-fade-in">
            <LyricsPanel />
          </div>
        )}
      </div>

      {/* Mobile Lyrics (bottom half) */}
      {showLyrics && (
        <div className="md:hidden relative z-10 h-1/2 w-full">
          <LyricsPanel />
        </div>
      )}
    </div>
  );
};
