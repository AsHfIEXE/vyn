import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Library, ListMusic, Settings } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/library', icon: Library, label: 'Library' },
  { to: '/playlists', icon: ListMusic, label: 'Playlists' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-[#07070d]/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-4 pb-safe z-40">
      {navItems.map(({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        
        return (
          <NavLink 
            key={to} 
            to={to}
            className={`
              flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all duration-200
              ${isActive ? 'text-accent scale-110' : 'text-white/40 hover:text-white'}
            `}
          >
            <Icon className={`w-6 h-6 ${isActive ? 'fill-accent/20' : ''}`} />
            <span className={`text-[10px] font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
              {label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};
