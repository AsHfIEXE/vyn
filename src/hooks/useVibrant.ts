import { useEffect } from 'react';

export const useVibrant = (imageSrc: string, onColorChange: (hsl: string) => void) => {
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageSrc;
    
    img.onload = () => {
      try {
        // Simple color extraction using canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        canvas.width = 1;
        canvas.height = 1;
        ctx.drawImage(img, 0, 0, 1, 1);
        
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        const hslStr = rgbToHsl(r, g, b);
        onColorChange(hslStr);
      } catch {
        // Fallback color on error
        onColorChange('250, 100%, 50%');
      }
    };
    
    img.onerror = () => {
      onColorChange('250, 100%, 50%');
    };
  }, [imageSrc]);
};

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}