import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Library, ListMusic, Settings, Music } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-16 md:w-56 h-screen bg-[#07070d] border-r border-white/5 flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 p-3 md:p-4">
        <div className="w-8 h-8 bg-gradient-to-br from-[#6366f1] to-purple-500 rounded-lg flex items-center justify-center shrink-0">
          <Music className="w-4 h-4 text-white" />
        </div>
        <span className="hidden md:block text-lg font-bold tracking-tight">Vyn</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 p-2">
        <NavLink to="/" className={({ isActive }) => 
          `flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm ${isActive ? 'bg-white/10 text-white' : 'text-[#9090b8] hover:text-white hover:bg-white/5'}`
        }>
          <Home className="w-5 h-5 shrink-0" />
          <span className="hidden md:block">Home</span>
        </NavLink>
        <NavLink to="/library" className={({ isActive }) => 
          `flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm ${isActive ? 'bg-white/10 text-white' : 'text-[#9090b8] hover:text-white hover:bg-white/5'}`
        }>
          <Library className="w-5 h-5 shrink-0" />
          <span className="hidden md:block">Library</span>
        </NavLink>
        <NavLink to="/playlists" className={({ isActive }) => 
          `flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm ${isActive ? 'bg-white/10 text-white' : 'text-[#9090b8] hover:text-white hover:bg-white/5'}`
        }>
          <ListMusic className="w-5 h-5 shrink-0" />
          <span className="hidden md:block">Playlists</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => 
          `flex items-center gap-3 p-2.5 rounded-lg transition-colors text-sm ${isActive ? 'bg-white/10 text-white' : 'text-[#9090b8] hover:text-white hover:bg-white/5'}`
        }>
          <Settings className="w-5 h-5 shrink-0" />
          <span className="hidden md:block">Settings</span>
        </NavLink>
      </nav>

      {/* Now Playing */}
      <div className="hidden md:block m-3 p-3 bg-white/5 rounded-lg border border-white/5">
        <p className="text-xs text-white/50 uppercase tracking-wider mb-2">Now Playing</p>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#141422] rounded shrink-0" />
          <div className="text-sm truncate">Select track</div>
        </div>
      </div>
    </aside>
  );
};
