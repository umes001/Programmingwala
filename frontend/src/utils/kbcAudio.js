// Web Audio API Synthesizer for Kaun Banega Crorepati (KBC) Experience
// Works 100% offline, zero latency, no broken CDN links

class KbcSoundManager {
  constructor() {
    this.ctx = null;
    this.droneOsc = null;
    this.droneGain = null;
    this.isMuted = false;
    this.currentAudio = null;
    this.clockAudio = null;
    this.lockAudio = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.stopDrone();
      this.stopClock();
      this.stopLockSuspense();
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // 1. Clock Ticking Countdown Audio (Tik-Tiki Ji) using uploaded authentic KBC clock
  startClock() {
    this.stopLockSuspense();
    if (this.isMuted) return;
    this.stopClock();
    try {
      const audio = new Audio('/kbc-clock.mp3');
      audio.volume = 0.9;
      audio.loop = true;
      this.clockAudio = audio;
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {});
      }
    } catch (e) {
      console.warn('Clock audio play error:', e);
    }
  }

  stopClock() {
    if (this.clockAudio) {
      try {
        this.clockAudio.pause();
        this.clockAudio.currentTime = 0;
      } catch (e) {}
      this.clockAudio = null;
    }
  }

  // 1. Clock Tick sound (Tik-Tiki Ji)
  playTick(isUrgent = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = isUrgent ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isUrgent ? 1100 : 750, now);
      osc.frequency.exponentialRampToValueAtTime(isUrgent ? 400 : 250, now + 0.04);

      gain.gain.setValueAtTime(isUrgent ? 0.35 : 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 2. Suspense Drone / Heartbeat
  startDrone() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx || this.droneOsc) return;

    try {
      const now = this.ctx.currentTime;
      this.droneOsc = this.ctx.createOscillator();
      this.droneGain = this.ctx.createGain();

      this.droneOsc.type = 'sawtooth';
      this.droneOsc.frequency.setValueAtTime(55, now); // Low A1

      // Low-pass filter for deep cinematic suspense
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      this.droneGain.gain.setValueAtTime(0.01, now);
      this.droneGain.gain.linearRampToValueAtTime(0.08, now + 1.5);

      this.droneOsc.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc.start();
    } catch (e) {
      console.warn('Drone start error:', e);
    }
  }

  stopDrone() {
    if (this.droneOsc) {
      try {
        if (this.droneGain && this.ctx) {
          const now = this.ctx.currentTime;
          this.droneGain.gain.linearRampToValueAtTime(0.001, now + 0.3);
          setTimeout(() => {
            if (this.droneOsc) {
              this.droneOsc.stop();
              this.droneOsc.disconnect();
              this.droneOsc = null;
              this.droneGain = null;
            }
          }, 320);
        } else {
          this.droneOsc.stop();
          this.droneOsc = null;
          this.droneGain = null;
        }
      } catch (e) {
        this.droneOsc = null;
      }
    }
  }

  // 3. Option Selection Sound
  playSelect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  // 4. "Lock Kiya Jaaye" - Dramatic Suspense Lock Music (Loops until admin reveals answer)
  startLockSuspense() {
    if (this.isMuted) return;
    this.stopClock();
    this.stopDrone();
    this.stopLockSuspense();
    try {
      if (this.currentAudio) {
        try { this.currentAudio.pause(); } catch (e) {}
        this.currentAudio = null;
      }
      const audio = new Audio('/kbc-lock.mp3');
      audio.volume = 0.95;
      audio.loop = true;
      this.lockAudio = audio;
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {});
      }
    } catch (e) {
      console.warn('Suspense lock audio error:', e);
    }
  }

  stopLockSuspense() {
    if (this.lockAudio) {
      try {
        this.lockAudio.pause();
        this.lockAudio.currentTime = 0;
      } catch (e) {}
      this.lockAudio = null;
    }
  }

  playLock() {
    this.startLockSuspense();
  }

  // 5. Correct Answer Victory Chime (Plays authentic KBC Correct Answer MP3)
  playCorrect() {
    this.stopLockSuspense();
    if (this.isMuted) return;
    this.stopClock();
    this.init();
    this.stopDrone();
    try {
      if (this.currentAudio) {
        try { this.currentAudio.pause(); } catch (e) {}
        this.currentAudio = null;
      }
      const audio = new Audio('/kbc-correct.mp3');
      audio.volume = 0.95;
      this.currentAudio = audio;
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          this.playCorrectSynth();
        });
      }
    } catch (e) {
      this.playCorrectSynth();
    }
  }

  playCorrectSynth() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);

        gain.gain.setValueAtTime(0.3, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.65);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.7);
      });
    } catch (e) {}
  }

  // 6. Question Arrival Theme / Screen Entrance Music
  playQuestionArrival() {
    this.stopLockSuspense();
    if (this.isMuted) return;
    this.stopClock();
    this.init();
    this.stopDrone();
    try {
      if (this.currentAudio) {
        try { this.currentAudio.pause(); } catch (e) {}
        this.currentAudio = null;
      }
      const audio = new Audio('/kbc-question.mp3');
      audio.volume = 0.85;
      this.currentAudio = audio;
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {});
      }
      // Resume subtle drone after theme plays
      setTimeout(() => {
        this.startDrone();
      }, 5500);
    } catch (e) {
      console.warn('Question arrival audio notice:', e);
    }
  }

  // 7. Wrong Answer Sound Effect (Contestant Laptop & Hotseat)
  playWrong() {
    this.stopLockSuspense();
    if (this.isMuted) return;
    this.stopClock();
    this.init();
    this.stopDrone();
    try {
      if (this.currentAudio) {
        try { this.currentAudio.pause(); } catch (e) {}
        this.currentAudio = null;
      }
      const audio = new Audio('/kbc-wrong.mp3');
      audio.volume = 0.9;
      this.currentAudio = audio;
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          this.playWrongSynth();
        });
      }
    } catch (e) {
      this.playWrongSynth();
    }
  }

  playWrongSynth() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';

      osc1.frequency.setValueAtTime(110, now); // A2
      osc1.frequency.exponentialRampToValueAtTime(65, now + 0.8);

      osc2.frequency.setValueAtTime(104, now); // Dissonant beating
      osc2.frequency.exponentialRampToValueAtTime(60, now + 0.8);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.9);
      osc2.stop(now + 0.9);
    } catch (e) {}
  }

  // 7. Lifeline Chime (Magical Harp Sweep)
  playLifeline() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [392, 523.25, 659.25, 783.99, 987.77, 1174.66]; // G4, C5, E5, G5, B5, D6

      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.25, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.55);
      });
    } catch (e) {}
  }

  // 8. High Points Victory Tune (Plays authentic "SAAT CRORE!!" audio on high points / milestone questions)
  playHighPoints() {
    this.stopLockSuspense();
    if (this.isMuted) return;
    this.stopClock();
    this.init();
    this.stopDrone();
    try {
      if (this.currentAudio) {
        try { this.currentAudio.pause(); } catch (e) {}
        this.currentAudio = null;
      }
      const audio = new Audio('/kbc-high-points.mp3');
      audio.volume = 1.0;
      this.currentAudio = audio;
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          this.playFanfare();
        });
      }
    } catch (e) {
      this.playFanfare();
    }
  }

  playSaatCrore() {
    this.playHighPoints();
  }

  // 8B. Laser Upward Sweep & Studio Lights FX
  playLaserSweep() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.85);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.22, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.85);
      filter.Q.setValueAtTime(6, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.95);
    } catch (e) {}
  }

  // 9. 7 Crore / Milestone Grand Fanfare
  playFanfare() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chords = [
        { time: 0, notes: [261.63, 329.63, 392.00] },       // C major
        { time: 0.25, notes: [293.66, 369.99, 440.00] },    // D major
        { time: 0.50, notes: [329.63, 415.30, 493.88] },    // E major
        { time: 0.80, notes: [523.25, 659.25, 783.99, 1046.5] } // High C major triumph
      ];

      chords.forEach(c => {
        c.notes.forEach(note => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note, now + c.time);

          gain.gain.setValueAtTime(0.28, now + c.time);
          gain.gain.exponentialRampToValueAtTime(0.001, now + c.time + 1.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(now + c.time);
          osc.stop(now + c.time + 1.3);
        });
      });
    } catch (e) {}
  }

  // 9. Quit / Walk Away Chime
  playQuit() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25]; // A major pleasant chime
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.22, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.7);
      });
    } catch (e) {}
  }
}

export const kbcAudio = new KbcSoundManager();
