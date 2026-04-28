import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import '@uimaxbai/am-lyrics/src/index.ts'; // Import from src directly to bypass missing dist

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'am-lyrics': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        'song-title'?: string;
        'song-artist'?: string;
        'song-album'?: string;
        'song-duration'?: string;
        'currentTime'?: number;
      };
    }
  }
}

export const LyricsPanel: React.FC = () => {
  const { currentTrack, currentTime } = usePlayerStore();
  const lyricsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let frameId: number;
    const update = () => {
      if (lyricsRef.current) {
        try {
          (lyricsRef.current as any).currentTime = currentTime;
        } catch {
          // Fallback
        }
      }
      frameId = requestAnimationFrame(update);
    };
    
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [currentTime]);

  if (!currentTrack) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 w-full h-full">
        <am-lyrics 
          ref={lyricsRef}
          song-title={currentTrack.title}
          song-artist={currentTrack.artist}
          song-album={currentTrack.album}
          song-duration={currentTrack.duration?.toString()}
          className="w-full h-full block"
        />
      </div>

      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
    </div>
  );
};
