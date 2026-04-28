import React, { useState } from 'react';
import { Volume2, Palette, Keyboard, Globe, Save } from 'lucide-react';
import { usePlayerStore } from '../../store/playerStore';
import { audioController } from '../../audio/AudioController';
import { themeEngine } from '../../utils/themeEngine';

const sections = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'playback', label: 'Playback', icon: Volume2 },
  { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
  { id: 'about', label: 'About', icon: Globe },
];

export const SettingsView: React.FC = () => {
  const [activeSection, setActiveSection] = useState('appearance');
  const { volume, setVolume, accentColor, setAccentColor } = usePlayerStore();
  const [manualColor, setManualColor] = useState(accentColor);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    audioController.setVolume(newVol);
  };

  const handleColorSave = () => {
    setAccentColor(manualColor);
    themeEngine.applyColor(manualColor);
  };

  return (
    <div className="h-full animate-fade-in">
      <h1 className="text-3xl font-syne font-extrabold mb-8">Settings</h1>

      <div className="flex flex-col md:flex-row gap-8 h-full">
        {/* Sidebar Navigation */}
        <nav className="flex md:flex-col gap-2 w-full md:w-56 shrink-0">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`flex items-center gap-3 p-3 rounded-xl text-sm transition-all duration-200 ${
                activeSection === id 
                  ? 'bg-white/10 text-white shadow-lg shadow-black/20' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${activeSection === id ? 'text-accent' : ''}`} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div className="flex-1 pb-24">
          <div className="bg-[#141422] border border-white/5 rounded-2xl p-6 transition-all duration-300">
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-syne font-bold mb-1">Appearance</h2>
                  <p className="text-sm text-white/40 mb-6">Customize the look and feel of Vyn</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                    <div>
                      <p className="text-sm font-medium">Dynamic Theme</p>
                      <p className="text-xs text-white/30">Colors adapt to album art</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked readOnly className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>

                  <div className="p-4 bg-black/20 rounded-xl space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-3">Override Accent Color</p>
                      <div className="flex items-center gap-4">
                        <input 
                          type="color" 
                          value={manualColor} 
                          onChange={(e) => setManualColor(e.target.value)}
                          className="w-12 h-12 rounded-lg bg-transparent cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={manualColor} 
                          onChange={(e) => setManualColor(e.target.value)}
                          className="input-primary flex-1 py-2 text-sm font-mono" 
                        />
                        <button 
                          onClick={handleColorSave}
                          className="btn-primary p-2 rounded-lg"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'playback' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-syne font-bold mb-1">Playback</h2>
                  <p className="text-sm text-white/40 mb-6">Adjust how your music sounds</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-black/20 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">Master Volume</p>
                      <span className="text-xs font-mono text-white/40">{Math.round(volume * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={volume} 
                      onChange={handleVolumeChange}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl">
                    <div>
                      <p className="text-sm font-medium">Crossfade</p>
                      <p className="text-xs text-white/30">Smooth transitions between tracks</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'shortcuts' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-syne font-bold mb-1">Keyboard Shortcuts</h2>
                  <p className="text-sm text-white/40 mb-6">Quick keys for power users</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'Space', action: 'Play/Pause' },
                    { key: 'N', action: 'Next Track' },
                    { key: 'P', action: 'Previous' },
                    { key: 'F', action: 'Fullscreen' },
                    { key: 'M', action: 'Mute' },
                    { key: 'L', action: 'Toggle Lyrics' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                      <span className="text-sm">{item.action}</span>
                      <kbd className="px-2 py-1 bg-white/10 rounded text-[10px] uppercase font-bold tracking-wider">{item.key}</kbd>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'about' && (
              <div className="text-center space-y-6 py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-accent/20 rotate-3">
                  <span className="text-3xl font-bold text-white -rotate-3">V</span>
                </div>
                <div>
                  <h2 className="text-2xl font-syne font-bold">Vyn Music Player</h2>
                  <p className="text-sm text-white/40">Version 1.0.0 (Stable)</p>
                </div>
                <p className="text-sm text-white/30 max-w-xs mx-auto leading-relaxed">
                  An immersive audio experience designed for purity and depth.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
