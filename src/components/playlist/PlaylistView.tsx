import React, { useState } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { Play, Plus, Disc, MoreVertical, ListMusic } from 'lucide-react';
import { motion } from 'framer-motion';

export const PlaylistView: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  const handleCreate = () => {
    if (!newName.trim()) return;
    setPlaylists([...playlists, { id: Date.now(), name: newName, songs: [] }]);
    setNewName('');
    setShowCreate(false);
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Playlists</h1>
          <p className="text-sm text-white/40">{playlists.length} playlists</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="bg-accent hover:bg-accent-bright px-4 py-2 rounded-full text-sm">
          <Plus className="w-4 h-4 inline mr-1" />
          New
        </button>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div initial={{scale:0.9}} animate={{scale:1}} className="bg-surface-2 p-5 rounded-xl w-80">
            <h3 className="font-bold mb-3">Create Playlist</h3>
            <input 
              type="text" 
              placeholder="Name..." 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-midnight border border-white/10 rounded-lg px-3 py-2 text-sm mb-3"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowCreate(false)} className="text-white/40 text-sm">Cancel</button>
              <button onClick={handleCreate} className="bg-accent px-3 py-1 rounded-lg text-sm">Create</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Content */}
      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-surface-2 rounded-xl flex items-center justify-center mb-4">
            <ListMusic className="w-8 h-8 text-white/20" />
          </div>
          <h2 className="text-lg font-bold mb-2">No playlists</h2>
          <p className="text-white/40 text-sm mb-4">Create your first playlist</p>
          <button onClick={() => setShowCreate(true)} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm">
            Create Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-20">
          {playlists.map(playlist => (
            <div key={playlist.id} className="bg-surface-2 rounded-xl overflow-hidden hover:bg-surface-3">
              <div className="aspect-square bg-surface-1 flex items-center justify-center">
                <Disc className="w-10 h-10 text-white/10" />
              </div>
              <div className="p-3">
                <p className="font-medium truncate">{playlist.name}</p>
                <p className="text-xs text-white/40">{playlist.songs?.length || 0} songs</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};