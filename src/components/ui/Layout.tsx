import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MiniPlayerBar } from '../player/MiniPlayerBar';
import { FullscreenPlayer } from '../player/FullscreenPlayer';
import { BottomNav } from './BottomNav';
import { usePlayerStore } from '../../store/playerStore';
import { themeEngine } from '../../utils/themeEngine';

export const Layout: React.FC = () => {
  const { isFullscreen, setFullscreen, currentTrack } = usePlayerStore();

  useEffect(() => {
    if (currentTrack?.artUrl) {
      themeEngine.updateTheme(currentTrack.artUrl);
    } else {
      themeEngine.updateTheme(null);
    }
  }, [currentTrack]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07070d] text-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full">
        <Sidebar />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-40 md:pb-24">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <BottomNav />
      </div>
      
      {/* Mini Player - Positioned above BottomNav on mobile */}
      <MiniPlayerBar />
      
      {/* Fullscreen Player */}
      <FullscreenPlayer 
        isOpen={isFullscreen} 
        onClose={() => setFullscreen(false)} 
      />
    </div>
  );
};
