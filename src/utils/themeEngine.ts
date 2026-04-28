import { usePlayerStore } from '../store/playerStore';

export const themeEngine = {
  async updateTheme(imageUrl: string | null) {
    const defaultColor = '#6366f1';
    
    if (!imageUrl) {
      this.applyColor(defaultColor);
      return;
    }

    try {
      // Use the specific browser entry point as suggested by the error message
      const VibrantModule = await import('node-vibrant');
      
      // node-vibrant often exports as a named property 'Vibrant' or as a default
      const Vibrant = VibrantModule.Vibrant || VibrantModule.default || VibrantModule;
      
      if (!Vibrant || typeof Vibrant.from !== 'function') {
        throw new Error('Vibrant.from function not found in module');
      }

      const palette = await Vibrant.from(imageUrl).getPalette();
      const vibrantColor = palette.Vibrant?.hex || defaultColor;
      this.applyColor(vibrantColor);
    } catch (error) {
      console.error('Theme extraction failed:', error);
      this.applyColor(defaultColor);
    }
  },

  applyColor(color: string) {
    usePlayerStore.getState().setAccentColor(color);
    document.documentElement.style.setProperty('--accent-color', color);
    document.documentElement.style.setProperty('--accent-glow', `${color}33`);
  }
};
