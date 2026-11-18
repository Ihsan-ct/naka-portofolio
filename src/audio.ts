// Web Audio API Procedural Sound Synthesizer
// Zero external audio assets - 100% mathematically synthesized in real time.

class SoundFX {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private listeners: Set<(m: boolean) => void> = new Set();

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isMuted(): boolean { return this.muted; }
  public setMuted(m: boolean): void { this.muted = m; this.listeners.forEach(fn => fn(this.muted)); }
  public toggleMute(): boolean { this.setMuted(!this.muted); return this.muted; }
  public subscribe(fn: (m: boolean) => void): () => void { this.listeners.add(fn); return () => this.listeners.delete(fn); }

  public playHover(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(1300, now + 0.035);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  public playClick(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch {}
  }

  public playAttack(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.09);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.095);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  public playHit(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = "triangle";
      bass.frequency.setValueAtTime(160, now);
      bass.frequency.exponentialRampToValueAtTime(45, now + 0.12);
      bassGain.gain.setValueAtTime(0.12, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      bass.connect(bassGain);
      bassGain.connect(ctx.destination);
      bass.start(now);
      bass.stop(now + 0.13);

      const chime = ctx.createOscillator();
      const chimeGain = ctx.createGain();
      chime.type = "sine";
      chime.frequency.setValueAtTime(880, now + 0.02);
      chime.frequency.exponentialRampToValueAtTime(1320, now + 0.15);
      chimeGain.gain.setValueAtTime(0.06, now + 0.02);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      chime.connect(chimeGain);
      chimeGain.connect(ctx.destination);
      chime.start(now + 0.02);
      chime.stop(now + 0.16);
    } catch {}
  }

  public playMiss(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      osc.type = "sine";
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(55, now + 0.14);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  public playSuccess(): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99];
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteStart = now + idx * 0.06;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, noteStart);
        gain.gain.setValueAtTime(0.04, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteStart);
        osc.stop(noteStart + 0.15);
      });
    } catch {}
  }
}

export const soundFX = new SoundFX();
