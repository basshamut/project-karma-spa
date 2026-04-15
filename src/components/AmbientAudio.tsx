import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Frecuencias de la escala de 432 Hz — armónicas cósmicas
const DRONES = [108, 144, 216, 288, 432];
const BELL_FREQS = [528, 639, 741, 852, 963];

const AmbientAudio = () => {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const belltimeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const createReverb = (ctx: AudioContext): ConvolverNode => {
    const convolver = ctx.createConvolver();
    const rate = ctx.sampleRate;
    const length = rate * 3;
    const ir = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = ir.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5);
      }
    }
    convolver.buffer = ir;
    return convolver;
  };

  const schedulebell = useCallback((ctx: AudioContext, reverb: ConvolverNode, masterGain: GainNode) => {
    const freq = BELL_FREQS[Math.floor(Math.random() * BELL_FREQS.length)];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);
    osc.connect(gain);
    gain.connect(reverb);
    gain.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 4);
    nodesRef.current.push(osc, gain);

    const nextDelay = 3000 + Math.random() * 7000;
    belltimeRef.current = setTimeout(() => schedulebell(ctx, reverb, masterGain), nextDelay);
  }, []);

  const start = useCallback(() => {
    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 3);
    masterGain.connect(ctx.destination);

    const reverb = createReverb(ctx);
    reverb.connect(masterGain);

    // Drone layer: slow LFO-modulated pads
    for (const freq of DRONES) {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = freq < 200 ? "sine" : "triangle";
      osc.frequency.value = freq;

      lfo.type = "sine";
      lfo.frequency.value = 0.05 + Math.random() * 0.08;
      lfoGain.gain.value = 0.015;

      const baseVol = freq < 200 ? 0.04 : 0.015;
      gainNode.gain.value = baseVol;

      lfo.connect(lfoGain);
      lfoGain.connect(gainNode.gain);
      osc.connect(gainNode);
      gainNode.connect(reverb);
      gainNode.connect(masterGain);

      lfo.start();
      osc.start();
      nodesRef.current.push(osc, gainNode, lfo, lfoGain);
    }

    // Subtle pink-noise shimmer
    const bufferSize = ctx.sampleRate * 4;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      data[i] = (b0 + b1 + b2) * 0.05;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.018;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "highpass";
    noiseFilter.frequency.value = 800;
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(reverb);
    noiseSource.start();
    nodesRef.current.push(noiseSource, noiseGain, noiseFilter);

    // Bells
    belltimeRef.current = setTimeout(() => schedulebell(ctx, reverb, masterGain), 3000);
  }, [schedulebell]);

  const stop = useCallback(() => {
    if (belltimeRef.current) clearTimeout(belltimeRef.current);
    const ctx = ctxRef.current;
    if (!ctx) return;
    // Fade out
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(1, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
    setTimeout(() => {
      nodesRef.current.forEach((n) => {
        try { (n as OscillatorNode).stop?.(); } catch { /* already stopped */ }
      });
      nodesRef.current = [];
      ctx.close();
      ctxRef.current = null;
    }, 2200);
  }, []);

  const toggle = () => {
    if (playing) {
      stop();
      setPlaying(false);
    } else {
      start();
      setPlaying(true);
    }
  };

  return (
    <motion.button
      onClick={toggle}
      title={playing ? "Silenciar ambiente" : "Activar ambiente místico"}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full border border-gold/40 bg-background/70 backdrop-blur-sm flex items-center justify-center text-lg hover:border-gold/80 hover:bg-background/90 transition-colors duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
    >
      <AnimatePresence mode="wait">
        {playing ? (
          <motion.span
            key="on"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="text-gold"
          >
            ♪
          </motion.span>
        ) : (
          <motion.span
            key="off"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="text-muted-foreground"
          >
            ♪
          </motion.span>
        )}
      </AnimatePresence>
      {playing && (
        <motion.span
          className="absolute inset-0 rounded-full border border-gold/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        />
      )}
    </motion.button>
  );
};

export default AmbientAudio;
