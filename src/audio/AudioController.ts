import { Howl } from 'howler';
import { usePlayerStore } from '../store/playerStore';

class AudioController {
  private static instance: AudioController;
  private howl: Howl | null = null;
  private rafId: number | null = null;

  private constructor() {}

  static getInstance() {
    if (!AudioController.instance) {
      AudioController.instance = new AudioController();
    }
    return AudioController.instance;
  }

  load(src: string, format: string = 'mp3') {
    if (this.howl) {
      this.howl.unload();
    }

    this.howl = new Howl({
      src: [src],
      format: [format.toLowerCase()],
      html5: true,
      onplay: () => {
        usePlayerStore.getState().setPlaying(true);
        this.startProgressLoop();
      },
      onpause: () => {
        usePlayerStore.getState().setPlaying(false);
        this.stopProgressLoop();
      },
      onstop: () => {
        usePlayerStore.getState().setPlaying(false);
        this.stopProgressLoop();
      },
      onend: () => {
        usePlayerStore.getState().nextTrack();
      },
      onload: () => {
        if (this.howl) {
          usePlayerStore.getState().setDuration(this.howl.duration());
        }
      },
      onloaderror: (_id: any, error: any) => {
        console.error('Audio load error:', error);
      }
    });
  }

  play() {
    this.howl?.play();
  }

  pause() {
    this.howl?.pause();
  }

  seek(time: number) {
    this.howl?.seek(time);
  }

  setVolume(volume: number) {
    this.howl?.volume(volume);
  }

  private startProgressLoop = () => {
    const update = () => {
      if (this.howl && this.howl.playing()) {
        const time = this.howl.seek() as number;
        usePlayerStore.getState().setCurrentTime(time);
        this.rafId = requestAnimationFrame(update);
      }
    };
    this.rafId = requestAnimationFrame(update);
  }

  private stopProgressLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

export const audioController = AudioController.getInstance();