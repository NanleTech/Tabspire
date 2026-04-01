interface AudioServiceConfig {
  elevenLabsApiKey: string;
  elevenLabsVoiceId: string;
}



class AudioService {
  private config: AudioServiceConfig;
  private audioContext: AudioContext | null = null;
  private currentAudio: AudioBufferSourceNode | null = null;

  constructor(config: AudioServiceConfig) {
    this.config = config;
  }

  async playText(text: string): Promise<void> {
    try {
      // First try ElevenLabs
      await this.playWithElevenLabs(text);
    } catch (error) {
      console.warn('ElevenLabs failed, falling back to Google TTS:', error);
      // Fallback to Google TTS
      await this.playWithGoogleTTS(text);
    }
  }

  private async playWithElevenLabs(text: string): Promise<void> {
    if (!this.config.elevenLabsVoiceId) {
      throw new Error('ElevenLabs voice ID missing');
    }

    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
    const response = await fetch(`${apiBaseUrl}/api/elevenlabs/tts`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        voiceId: this.config.elevenLabsVoiceId,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        throw new Error('ElevenLabs API key invalid or expired');
      }
      if (response.status === 429) {
        throw new Error('ElevenLabs API quota exceeded');
      }
      throw new Error(`ElevenLabs API error: ${errorData.detail || response.statusText}`);
    }

    const audioBlob = await response.blob();
    await this.playAudioBlob(audioBlob);
  }

  private async playWithGoogleTTS(text: string): Promise<void> {
    // Use the Web Speech API (Google TTS) as fallback
    if ('speechSynthesis' in window) {
      return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Get available voices and try to use a good one
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          // Try to find a voice that matches the current language or use the first available
          const preferredVoice = voices.find(voice => 
            voice.lang.startsWith('en') || voice.lang.startsWith('es') || voice.lang.startsWith('fr')
          ) || voices[0];
          
          utterance.voice = preferredVoice;
        }
        
        utterance.rate = 0.9; // Slightly slower for better clarity
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(new Error(`Google TTS error: ${event.error}`));
        
        speechSynthesis.speak(utterance);
      });
    }
    throw new Error('Speech synthesis not supported in this browser');
  }

  private async playAudioBlob(audioBlob: Blob): Promise<void> {
    // Convert blob to audio buffer and play
    const arrayBuffer = await audioBlob.arrayBuffer();
    
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    
    if (this.currentAudio) {
      this.currentAudio.stop();
      this.currentAudio.disconnect();
    }
    
    this.currentAudio = this.audioContext.createBufferSource();
    this.currentAudio.buffer = audioBuffer;
    this.currentAudio.connect(this.audioContext.destination);
    
    return new Promise((resolve, reject) => {
      if (this.currentAudio) {
        this.currentAudio.onended = () => resolve();
        // AudioBufferSourceNode doesn't have onerror, so we'll just resolve
        this.currentAudio.start(0);
      }
    });
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.stop();
      this.currentAudio.disconnect();
      this.currentAudio = null;
    }
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    // Stop any ongoing speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  isPlaying(): boolean {
    return this.currentAudio !== null || speechSynthesis.speaking;
  }
}

export default AudioService;
