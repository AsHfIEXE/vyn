import * as mm from 'music-metadata-browser';

export interface Metadata {
  title: string;
  artist: string;
  album: string;
  year?: number;
  duration: number;
  picture?: {
    format: string;
    data: Uint8Array;
  };
}

export async function parseMetadata(file: File): Promise<Metadata> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const metadata = await mm.parseBuffer(uint8Array);
    const common = metadata.common;
    const format = metadata.format;

    // If we have any actual metadata, use it
    if (common && (common.title || common.artist || common.album)) {
      return {
        title: common.title || file.name.replace(/\.[^/.]+$/, ""),
        artist: common.artist || 'Unknown Artist',
        album: common.album || 'Unknown Album',
        year: common.year,
        duration: format.duration || 0,
        picture: common.picture && common.picture.length > 0 ? {
          format: common.picture[0].format,
          data: common.picture[0].data,
        } : undefined,
      };
    }
    
    return smartParseFilename(file, format.duration || 0);

  } catch (error) {
    // Log exactly which file failed for debugging
    console.warn(`Metadata parsing failed for ${file.name}:`, error);
    return smartParseFilename(file, 0);
  }
}

function smartParseFilename(file: File, duration: number): Metadata {
  const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
  
  // 1. Try splitting by common separators: " - ", " _ ", " — "
  const parts = fileName.split(/ - | _ | — /);

  if (parts.length >= 2) {
    return {
      title: parts[1].trim(),
      artist: parts[0].trim(),
      album: 'Unknown Album',
      duration: duration,
    };
  }

  // 2. Try to find a pattern like "Artist-Title" (no spaces)
  const simpleSplit = fileName.split('-');
  if (simpleSplit.length >= 2) {
    return {
      title: simpleSplit[1].trim(),
      artist: simpleSplit[0].trim(),
      album: 'Unknown Album',
      duration: duration,
    };
  }

  // 3. Absolute fallback: filename is title, artist is unknown
  return {
    title: fileName,
    artist: 'Unknown Artist',
    album: 'Unknown Album',
    duration: duration,
  };
}
