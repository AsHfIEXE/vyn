import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/ui/Layout';
import { HomeView } from './components/home/HomeView';
import { LibraryView } from './components/library/LibraryView';
import { PlaylistView } from './components/playlist/PlaylistView';
import { SettingsView } from './components/settings/SettingsView';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomeView />} />
          <Route path="library" element={<LibraryView />} />
          <Route path="playlists" element={<PlaylistView />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;