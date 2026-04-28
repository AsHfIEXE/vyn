import { create } from 'zustand';
import { db, type Playlist } from '../db/database';

interface PlaylistState {
  playlists: Playlist[];
  activePlaylistId: number | null;

  loadPlaylists: () => Promise<void>;
  createPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (id: number) => Promise<void>;
  addSongToPlaylist: (playlistId: number, songId: number) => Promise<void>;
  removeSongFromPlaylist: (playlistId: number, songId: number) => Promise<void>;
  setActivePlaylist: (id: number | null) => void;
}

export const usePlaylistStore = create<PlaylistState>()((set, get) => ({
  playlists: [],
  activePlaylistId: null,

  loadPlaylists: async () => {
    const playlists = await db.playlists.toArray();
    set({ playlists });
  },

  createPlaylist: async (name: string) => {
    const id = await db.playlists.add({ name, songIds: [] });
    const newPlaylist: Playlist = { id, name, songIds: [] };
    set((state) => ({ playlists: [...state.playlists, newPlaylist] }));
  },

  deletePlaylist: async (id: number) => {
    await db.playlists.delete(id);
    set((state) => ({ playlists: state.playlists.filter(p => p.id !== id) }));
  },

  addSongToPlaylist: async (playlistId: number, songId: number) => {
    const playlist = await db.playlists.get(playlistId);
    if (playlist) {
      const newSongIds = [...playlist.songIds, songId];
      await db.playlists.update(playlistId, { songIds: newSongIds });
      set((state) => ({
        playlists: state.playlists.map(p => 
          p.id === playlistId ? { ...p, songIds: newSongIds } : p
        )
      }));
    }
  },

  removeSongFromPlaylist: async (playlistId: number, songId: number) => {
    const playlist = await db.playlists.get(playlistId);
    if (playlist) {
      const newSongIds = playlist.songIds.filter(id => id !== songId);
      await db.playlists.update(playlistId, { songIds: newSongIds });
      set((state) => ({
        playlists: state.playlists.map(p => 
          p.id === playlistId ? { ...p, songIds: newSongIds } : p
        )
      }));
    }
  },

  setActivePlaylist: (id: number | null) => set({ activePlaylistId: id }),
}));