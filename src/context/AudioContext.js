import { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';

const AudioContext = createContext(null);

const TRACKS = [
  { id: 1, title: 'Cendres I',      album: 'Cendres',      duration: '4:32', src: null },
  { id: 2, title: 'Fracture Lente', album: 'Fractures',    duration: '3:58', src: null },
  { id: 3, title: 'Abysses',        album: 'Abysses',      duration: '5:14', src: null },
  { id: 4, title: 'Brume Noire',    album: 'Nuit Blanche', duration: '6:01', src: null },
];

export function AudioProvider({ children }) {
  /* ── Local player (décoratif) ──────────────────────────────────── */
  const [trackIdx,   setTrackIdx]   = useState(0);
  const [playing,    setPlaying]    = useState(false);
  const [progress,   setProgress]   = useState(0);
  const [volume,     setVolume]     = useState(0.7);
  const [minimized,  setMinimized]  = useState(false);
  const audioRef   = useRef(null);
  const intervalRef = useRef(null);

  /* ── SoundCloud state ──────────────────────────────────────────── */
  const [scTitle,    setScTitle]    = useState(null);
  const [scPlaying,  setScPlaying]  = useState(false);
  const [scProgress, setScProgress] = useState(0);

  /* ── SoundCloud refs ───────────────────────────────────────────── */
  const scWidgetsRef    = useRef([]);   // SC.Widget instances (DOM order)
  const activeWidgetRef = useRef(null); // widget en cours
  const activeIdxRef    = useRef(-1);   // index dans scWidgetsRef

  const track = TRACKS[trackIdx];

  /* ── Local audio volume sync ───────────────────────────────────── */
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  /* ── Local controls ────────────────────────────────────────────── */
  const toggle = () => {
    if (!audioRef.current?.src) { setPlaying(p => !p); return; }
    if (playing) audioRef.current.pause(); else audioRef.current.play();
    setPlaying(p => !p);
  };

  const next = useCallback(() => { setTrackIdx(i => (i + 1) % TRACKS.length); setProgress(0); }, []);
  const prev = useCallback(() => { setTrackIdx(i => (i - 1 + TRACKS.length) % TRACKS.length); setProgress(0); }, []);

  useEffect(() => {
    if (playing && !audioRef.current?.src) {
      intervalRef.current = setInterval(() => {
        setProgress(p => { if (p >= 100) { next(); return 0; } return p + 0.1; });
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, next]);

  /* ── SC Widget : enregistrement ───────────────────────────────── */
  const registerWidget = useCallback((widget, idx) => {
    scWidgetsRef.current[idx] = widget;
    widget.setVolume(Math.round(volume * 100));
  }, [volume]);

  /* ── SC Widget : activation (PLAY déclenché) ───────────────────── */
  const activateWidget = useCallback((widget, idx) => {
    activeWidgetRef.current = widget;
    activeIdxRef.current    = idx;
  }, []);

  /* ── SC Controls ───────────────────────────────────────────────── */
  const scToggle = useCallback(() => {
    const w = activeWidgetRef.current;
    if (!w) return;
    w.isPaused(paused => { if (paused) w.play(); else w.pause(); });
  }, []);

  const scNext = useCallback(() => {
    const idx     = activeIdxRef.current;
    const widgets = scWidgetsRef.current;
    if (idx < 0 || idx >= widgets.length - 1) return;
    activeWidgetRef.current?.pause();
    const ni = idx + 1;
    activeIdxRef.current    = ni;
    activeWidgetRef.current = widgets[ni];
    widgets[ni]?.play();
  }, []);

  const scPrev = useCallback(() => {
    const idx     = activeIdxRef.current;
    const widgets = scWidgetsRef.current;
    if (idx <= 0) return;
    activeWidgetRef.current?.pause();
    const pi = idx - 1;
    activeIdxRef.current    = pi;
    activeWidgetRef.current = widgets[pi];
    widgets[pi]?.play();
  }, []);

  const scSeek = useCallback((pct) => {
    const w = activeWidgetRef.current;
    if (!w) return;
    w.getDuration(dur => w.seekTo(dur * pct / 100));
  }, []);

  const scSetVolume = useCallback((v) => {
    scWidgetsRef.current.forEach(w => w?.setVolume(Math.round(v * 100)));
  }, []);

  /* ── Démarre le premier widget SC disponible (Live Set) ─────────── */
  const playFirst = useCallback(() => {
    const w = scWidgetsRef.current[0];
    if (!w) return;
    activeWidgetRef.current = w;
    activeIdxRef.current    = 0;
    w.play();
  }, []);

  return (
    <AudioContext.Provider value={{
      /* local */
      track, tracks: TRACKS, trackIdx, playing, progress, volume,
      minimized, setMinimized, setVolume, toggle, next, prev, setProgress, audioRef,
      /* sc state */
      scTitle,    setScTitle,
      scPlaying,  setScPlaying,
      scProgress, setScProgress,
      /* sc controls */
      registerWidget, activateWidget,
      scToggle, scNext, scPrev, scSeek, scSetVolume, playFirst,
    }}>
      {children}
      <audio ref={audioRef} onEnded={next} />
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
