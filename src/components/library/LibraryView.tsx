import React, { useState, useRef } from 'react';
import { usePlayerStore } from '../../store/playerStore';
import { audioController } from '../../audio/AudioController';
import { Search, LayoutGrid, List, Plus, Music, Disc, Play, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { parseMetadata } from '../../utils/metadataParser';

type ViewMode = 'grid' | 'list';

export const LibraryView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const { setTrack } = usePlayerStore();
  const [songs, setSongs] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddMusic = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const parsedSongs = await Promise.all(files.map(async (file, i) => {
      try {
        const metadata = await parseMetadata(file);
        
        let artUrl = null;
        if (metadata.picture) {
          const blob = new Blob([metadata.picture.data], { type: metadata.picture.format });
          artUrl = URL.createObjectURL(blob);
        }

        const extension = file.name.split('.').pop() || 'mp3';

        return {
          id: Date.now() + i,
          title: metadata.title,
          artist: metadata.artist,
          album: metadata.album,
          duration: metadata.duration,
          path: URL.createObjectURL(file),
          artUrl: artUrl,
          format: extension
        };
      } catch {
        const extension = file.name.split('.').pop() || 'mp3';
        return {
          id: Date.now() + i,
          title: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Unknown Artist',
          album: 'Unknown Album',
          duration: 0,
          path: URL.createObjectURL(file),
          artUrl: null,
          format: extension
        };
      }
    }));
    setSongs(prev => [...prev, ...parsedSongs]);
  };

  const handlePlay = async (song: any) => {
    setTrack(song);
    // Use the stored format instead of hardcoded 'mp3'
    audioController.load(song.path, song.format);
    audioController.play();
  };

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-syne font-extrabold mb-1">Library</h1>
          <p className="text-sm text-white/40">{songs.length} tracks</p>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-primary pl-10"
            />
          </div>
          <div className="flex bg-surface-2 rounded-full p-1">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-full ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
          <button onClick={handleAddMusic} className="bg-accent hover:bg-accent-hover text-white p-2 rounded-full">
            <Plus className="w-4 h-4" />
          </button>
          <input ref={fileInputRef} type="file" multiple accept="audio/*" className="hidden" onChange={handleFileSelect} />
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {filteredSongs.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-20 h-20 bg-surface-2 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/5">
              <Music className="w-10 h-10 text-white/20" />
            </div>
            <h2 className="text-xl font-syne font-bold mb-2">No music yet</h2>
            <p className="text-white/40 text-sm mb-6">Add music to your library</p>
            <button onClick={handleAddMusic} className="btn-secondary">
              Import Music
            </button>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-24"
          >
            {filteredSongs.map((song, i) => (
              <SongCard key={song.id || i} song={song} index={i} onPlay={handlePlay} />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col pb-24"
          >
            <div className="grid grid-cols-[32px_1fr_1fr_60px] gap-3 px-3 py-2 text-xs text-white/30 uppercase">
              <div>#</div>
              <div>Title</div>
              <div>Artist</div>
              <div className="text-right">Time</div>
            </div>
            {filteredSongs.map((song, i) => (
              <div 
                key={song.id || i}
                onClick={() => handlePlay(song)}
                className="grid grid-cols-[32px_1fr_1fr_60px] gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer items-center transition-colors"
              >
                <div className="text-xs text-white/30">{i + 1}</div>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 bg-surface-2 rounded shrink-0 overflow-hidden">
                    {song.artUrl ? <img src={song.artUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Disc className="w-3 h-3 text-white/10" /></div>}
                  </div>
                  <span className="text-sm truncate">{song.title}</span>
                </div>
                <div className="text-sm text-white/50 truncate">{song.artist}</div>
                <div className="text-xs text-white/30 text-right font-mono">
                  {song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '--:--'}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SongCard = ({ song, index, onPlay }: { song: any; index: number; onPlay: (s: any) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: Math.min(index * 0.02, 0.3) }}
    onClick={() => onPlay(song)}
    className="group bg-surface-2 rounded-xl overflow-hidden cursor-pointer hover:bg-surface-3 transition-all"
  >
    <div className="aspect-square bg-surface-1 relative">
      {song.artUrl ? (
        <img src={song.artUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={song.title} />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Disc className="w-8 h-8 text-white/10" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
          <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
        </div>
      </div>
    </div>
    <div className="p-3">
      <p className="text-sm font-medium truncate">{song.title}</p>
      <p className="text-xs text-white/40 truncate">{song.artist}</p>
    </div>
  </motion.div>
);
