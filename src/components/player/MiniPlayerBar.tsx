import React from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { audioController } from '../../audio/AudioController';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Maximize2, 
  Heart, 
  Shuffle, 
  Repeat, 
  Disc 
} from 'lucide-react';

export const MiniPlayerBar: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    volume, 
    setVolume, 
    nextTrack, 
    prevTrack,
    setFullscreen,
    currentTime,
    duration,
    setCurrentTime,
    isShuffled,
    repeatMode,
    // We'll assume these exist or add them to store in next step
    setShuffled: setShuffle, 
    setRepeatMode: setRepeat 
  } = usePlayerStore();

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) audioController.pause();
    else audioController.play();
    togglePlay();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    audioController.seek(newTime);
  };

  const toggleRepeat = () => {
    const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
    const nextMode = modes[(modes.indexOf(repeatMode) + 1) % modes.length];
    setRepeat?.(nextMode);
  };

  return (
    <footer className="fixed bottom-20 md:bottom-0 left-0 right-0 bg-[#07070d]/95 backdrop-blur-xl border-t border-white/5 z-30 transition-all duration-300">
      {/* Top Progress Bar (Spotify Style) */}
      <div className="absolute top-0 left-0 right-0 h-1 group cursor-pointer">
        <input 
          type="range" 
          min="0" 
          max={duration} 
          step="0.1" 
          value={currentTime} 
          onChange={handleSeek}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="absolute top-0 left-0 h-full bg-white/10 w-full" />
        <div 
          className="absolute top-0 left-0 h-full bg-accent group-hover:bg-white transition-colors" 
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-2 md:py-3 h-16 md:h-20">
        {/* Left: Track Info & Like */}
        <div className="flex items-center gap-3 w-1/3 min-w-0">
          <div className="w-12 h-12 bg-surface-1 rounded-md shrink-0 overflow-hidden shadow-lg relative group">
            {currentTrack.artUrl ? (
              <img src={currentTrack.artUrl} className="w-full h-full object-cover" alt={currentTrack.title} />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Disc className="w-5 h-5 text-white/10" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold truncate hover:underline cursor-pointer">
              {currentTrack.title}
            </div>
            <div className="text-xs text-white/50 truncate hover:underline cursor-pointer">
              {currentTrack.artist}
            </div>
          </div>
          <button className="text-white/40 hover:text-green-500 transition-colors shrink-0 ml-2">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Main Controls */}
        <div className="flex flex-col items-center justify-center gap-1 flex-1">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setShuffle?.(!isShuffled)} 
              className={`transition-colors ${isShuffled ? 'text-accent' : 'text-white/40 hover:text-white'}`}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            
            <button onClick={prevTrack} className="text-white/60 hover:text-white transition-colors">
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            
            <button 
              onClick={handlePlayPause} 
              className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 ml-0.5 fill-current" />}
            </button>
            
            <button onClick={nextTrack} className="text-white/60 hover:text-white transition-colors">
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            
            <button 
              onClick={toggleRepeat} 
              className={`transition-colors ${repeatMode !== 'off' ? 'text-accent' : 'text-white/40 hover:text-white'}`}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          
          {/* Time Stamps */}
          <div className="hidden md:flex items-center gap-2 text-[10px] font-mono text-white/30 w-full max-w-md justify-center">
            <span>{formatTime(currentTime)}</span>
            <div className="flex-1 h-[1px] bg-white/10 mx-2" />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Fullscreen */}
        <div className="flex items-center justify-end gap-3 w-1/3">
          <div className="hidden md:flex items-center gap-2 group">
            <Volume2 className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
            <input 
              type="range" min="0" max="1" step="0.01" 
              value={volume} 
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setVolume(val);
                audioController.setVolume(val);
              }}
              className="w-24 h-1 bg-white/10 rounded-full appearance-none accent-white hover:accent-accent transition-colors cursor-pointer"
            />
          </div>
          <button 
            onClick={() => setFullscreen(true)} 
            className="p-2 text-white/40 hover:text-white transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
