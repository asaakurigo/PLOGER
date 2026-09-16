import { AudioFeedbackSound } from "../types";

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playAudioFeedback(sound: AudioFeedbackSound, enabled: boolean = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  try {
    switch (sound) {
      case "shutter": {
        // Mechanical shutter click & curtain slap
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1800, now);
        filter.Q.setValueAtTime(3.0, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.7, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);

        // Click transient
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.05);
        oscGain.gain.setValueAtTime(0.5, now);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.06);
        break;
      }

      case "digicam_beep": {
        // Vintage 2000s digicam dual beep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(1480, now);
        osc.frequency.setValueAtTime(1760, now + 0.04);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.setValueAtTime(0.12, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      }

      case "pop_chime": {
        // Bubble pop sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.07);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }

      case "cyber_chirp": {
        // Futuristic cyber blip
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(2400, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
    }
  } catch {
    // Ignore audio context errors
  }

  // Trigger haptic if enabled
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate(15);
    } catch {
      // Ignore vibration error
    }
  }
}

let activeAmbientNodes: { stop: () => void }[] = [];

export function stopCurrentAmbientTrack() {
  activeAmbientNodes.forEach((n) => {
    try {
      n.stop();
    } catch {}
  });
  activeAmbientNodes = [];
}

export function playAmbientTrack(
  presetId: "indie_bedroom" | "city_rain" | "club_subbass" | "skate_bowl" | "custom_voice",
  durationSec: number = 5,
  onEnded?: () => void
): () => void {
  stopCurrentAmbientTrack();

  const ctx = getAudioContext();
  if (!ctx) return () => {};

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.01, now);
  masterGain.gain.linearRampToValueAtTime(0.35, now + 0.5);
  masterGain.gain.setValueAtTime(0.35, now + durationSec - 0.6);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);
  masterGain.connect(ctx.destination);

  const localNodes: { stop: () => void }[] = [];

  try {
    if (presetId === "indie_bedroom") {
      // Warm chord progression (Lo-Fi bedroom pop synth chords)
      const chordFrequencies = [261.63, 329.63, 392.0, 523.25]; // C, E, G, C
      chordFrequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const chordGain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);
        // Add subtle detune for vintage chorus wobble
        osc.detune.setValueAtTime(idx % 2 === 0 ? 6 : -6, now);

        chordGain.gain.setValueAtTime(0.2, now);
        osc.connect(chordGain);
        chordGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + durationSec);
        localNodes.push(osc);
      });
    } else if (presetId === "city_rain") {
      // Gentle filtered rain texture with distant rumble
      const bufferSize = ctx.sampleRate * durationSec;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(900, now);
      bandpass.Q.setValueAtTime(1.5, now);

      noise.connect(bandpass);
      bandpass.connect(masterGain);
      noise.start(now);
      noise.stop(now + durationSec);
      localNodes.push(noise);
    } else if (presetId === "club_subbass") {
      // 808 Sub-bass bounce
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(55, now); // A1
      osc.frequency.setValueAtTime(65.41, now + 1.25); // C2
      osc.frequency.setValueAtTime(49.0, now + 2.5); // G1
      osc.frequency.setValueAtTime(55, now + 3.75); // A1

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(160, now);

      osc.connect(filter);
      filter.connect(masterGain);
      osc.start(now);
      osc.stop(now + durationSec);
      localNodes.push(osc);
    } else if (presetId === "skate_bowl") {
      // Wooden bowl rumble and rhythm clacks
      const osc = ctx.createOscillator();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(90, now);
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(250, now);
      osc.connect(filter);
      filter.connect(masterGain);
      osc.start(now);
      osc.stop(now + durationSec);
      localNodes.push(osc);
    } else {
      // Custom voice memo simulation (pleasant melodic voice blips)
      [440, 523.25, 659.25, 587.33].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now + i * 1.1);
        g.gain.setValueAtTime(0, now + i * 1.1);
        g.gain.linearRampToValueAtTime(0.2, now + i * 1.1 + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 1.1 + 0.9);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now + i * 1.1);
        osc.stop(now + i * 1.1 + 1.0);
        localNodes.push(osc);
      });
    }
  } catch {}

  activeAmbientNodes = localNodes;

  const timer = setTimeout(() => {
    stopCurrentAmbientTrack();
    if (onEnded) onEnded();
  }, durationSec * 1000);

  return () => {
    clearTimeout(timer);
    stopCurrentAmbientTrack();
  };
}
