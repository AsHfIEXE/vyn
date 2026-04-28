import React from 'react';
import { Song } from '../../db/database';
import { Play, Heart } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { audioController } from '../../audio/AudioController';

interface SongCardProps {
  song: Song;
  onClick: (song: Song) => void;
}

export const SongCard: React.FC<SongCardProps> = ({ song, onClick }) => {
  return (
    <div 
      onClick={() => onClick(song)}
      className="group relative aspect-square bg-card rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ring-1 ring-white/10"
    >
      {song.artBlob ? (
        <img 
          src={URL.createObjectURL(song.artBlob)} 
          alt={song.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-accent/20 to-midnight flex items-center justify-center">
          <div className="w-12 h-12 bg-white/5 rounded-full animate-pulse" />
        </div>
      )}

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-midnight via-midnight/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 overflow-hidden mr-2">
            <div className="text-sm font-syne font-semibold truncate text-white">{song.title}</div>
            <div className="text-xs text-white/70 truncate">{song.artist}</div>
          </div>
          <button className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white shadow-lg shadow-accent/30 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-out">
            <Play className="w-5 h-5 ml-1" />
          </button>
        </div>
      </div>

      {/* Like Button */}
      <button className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white/60 hover:text-accent transition-colors opacity-0 group-hover:opacity-100">
        <Heart className="w-4 h-4" fill={song.isLiked ? "currentColor" : "none"} />
      </button>
    </div>
  );
};
