import Dexie, { type Table } from 'dexie';

export interface Song {
  id?: number;
  path: string;
  title: string;
  artist: string;
  album: string;
  year?: number;
  duration: number;
  artBlob?: Blob;
  playCount: number;
  dateAdded: number;
  isLiked: boolean;
  format?: string;
}

export interface Playlist {
  id?: number;
  name: string;
  songIds: number[];
  coverArt?: Blob;
}

export interface Setting {
  key: string;
  value: unknown;
}

export class VynDatabase extends Dexie {
  songs!: Table<Song>;
  playlists!: Table<Playlist>;
  settings!: Table<Setting>;

  constructor() {
    super('VynDB');
    this.version(1).stores({
      songs: '++id, path, title, artist, album, isLiked',
      playlists: '++id, name',
      settings: 'key'
    });
  }
}

export const db = new VynDatabase();