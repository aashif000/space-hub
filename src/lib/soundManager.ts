// Sound effects utility for Space Hub
export class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.3;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported', error);
    }
  }

  private async resumeAudioContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Generate synthetic sounds using Web Audio API
  private generateTone(frequency: number, duration: number, type: OscillatorType = 'sine'): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not available');

    const sampleRate = this.audioContext.sampleRate;
    const numSamples = duration * sampleRate;
    const buffer = this.audioContext.createBuffer(1, numSamples, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;
      
      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          sample = 2 * (t * frequency - Math.floor(t * frequency)) - 1;
          break;
        case 'triangle':
          sample = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency)) - 1) - 1;
          break;
      }
      
      // Apply envelope (fade in/out)
      const fadeTime = 0.01;
      const fadeIn = Math.min(t / fadeTime, 1);
      const fadeOut = Math.min((duration - t) / fadeTime, 1);
      sample *= fadeIn * fadeOut;
      
      channelData[i] = sample * this.volume;
    }

    return buffer;
  }

  // Generate space-themed sounds
  private generateSpaceSound(type: string): AudioBuffer {
    if (!this.audioContext) throw new Error('AudioContext not available');

    switch (type) {
      case 'click':
        return this.generateTone(800, 0.1, 'sine');
      
      case 'hover':
        return this.generateTone(600, 0.08, 'sine');
      
      case 'success':
        // Happy ascending tone
        const successBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.5, this.audioContext.sampleRate);
        const successData = successBuffer.getChannelData(0);
        for (let i = 0; i < successData.length; i++) {
          const t = i / this.audioContext.sampleRate;
          const frequency = 400 + (t * 400); // Rising frequency
          successData[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 3) * this.volume;
        }
        return successBuffer;
      
      case 'launch':
        // Rocket launch sound (white noise with low-pass filter)
        const launchBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 2, this.audioContext.sampleRate);
        const launchData = launchBuffer.getChannelData(0);
        for (let i = 0; i < launchData.length; i++) {
          const t = i / this.audioContext.sampleRate;
          const noise = (Math.random() * 2 - 1) * Math.exp(-t * 0.5);
          const rumble = Math.sin(2 * Math.PI * 60 * t) * Math.exp(-t * 0.3);
          launchData[i] = (noise * 0.3 + rumble * 0.7) * this.volume;
        }
        return launchBuffer;
      
      case 'alien':
        // Quirky alien beep
        const alienBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.3, this.audioContext.sampleRate);
        const alienData = alienBuffer.getChannelData(0);
        for (let i = 0; i < alienData.length; i++) {
          const t = i / this.audioContext.sampleRate;
          const freq1 = 800 + Math.sin(t * 30) * 200;
          const freq2 = 400 + Math.sin(t * 50) * 100;
          alienData[i] = (Math.sin(2 * Math.PI * freq1 * t) + Math.sin(2 * Math.PI * freq2 * t)) * 0.5 * this.volume;
        }
        return alienBuffer;
      
      case 'sparkle':
        // Magical sparkle sound
        const sparkleBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.4, this.audioContext.sampleRate);
        const sparkleData = sparkleBuffer.getChannelData(0);
        for (let i = 0; i < sparkleData.length; i++) {
          const t = i / this.audioContext.sampleRate;
          const frequency = 1200 + Math.sin(t * 40) * 300;
          sparkleData[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 5) * this.volume;
        }
        return sparkleBuffer;
      
      default:
        return this.generateTone(440, 0.1);
    }
  }

  // Initialize sounds
  async init() {
    if (!this.audioContext) return;

    await this.resumeAudioContext();
    
    // Pre-generate common sounds
    const soundTypes = ['click', 'hover', 'success', 'launch', 'alien', 'sparkle'];
    
    for (const type of soundTypes) {
      try {
        const buffer = this.generateSpaceSound(type);
        this.sounds.set(type, buffer);
      } catch (error) {
        console.warn(`Failed to generate sound: ${type}`, error);
      }
    }
  }

  // Play a sound
  async play(soundName: string, options: { volume?: number, playbackRate?: number } = {}) {
    if (!this.enabled || !this.audioContext) return;

    await this.resumeAudioContext();
    
    const buffer = this.sounds.get(soundName);
    if (!buffer) {
      console.warn(`Sound not found: ${soundName}`);
      return;
    }

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = buffer;
      source.playbackRate.value = options.playbackRate || 1;
      gainNode.gain.value = options.volume || 1;
      
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      source.start();
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }

  // Enable/disable sounds
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // Set volume (0-1)
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Get current settings
  isEnabled(): boolean {
    return this.enabled;
  }

  getVolume(): number {
    return this.volume;
  }
}

// Create a singleton instance
export const soundManager = new SoundManager();

// Initialize on first user interaction
let initialized = false;
export const initSoundOnInteraction = () => {
  if (initialized) return;
  
  const initHandler = async () => {
    await soundManager.init();
    initialized = true;
    document.removeEventListener('click', initHandler);
    document.removeEventListener('touchstart', initHandler);
    document.removeEventListener('keydown', initHandler);
  };
  
  document.addEventListener('click', initHandler, { once: true });
  document.addEventListener('touchstart', initHandler, { once: true });
  document.addEventListener('keydown', initHandler, { once: true });
};

// React hook for using sounds
export const useSound = () => {
  const playSound = (soundName: string, options?: { volume?: number, playbackRate?: number }) => {
    soundManager.play(soundName, options);
  };

  const enable = () => soundManager.setEnabled(true);
  const disable = () => soundManager.setEnabled(false);
  const setVolume = (volume: number) => soundManager.setVolume(volume);
  
  return {
    playSound,
    enable,
    disable,
    setVolume,
    isEnabled: soundManager.isEnabled(),
    volume: soundManager.getVolume()
  };
};
