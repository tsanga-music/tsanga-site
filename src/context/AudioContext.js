import { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext(null);

const TRACKS = [
  { id: 1, title: 'Cendres I', album: 'Cendres', duration: '4:32', src: null },
  { id: 2, title: 'Fracture Lente', album: 'Fractures', duration: '3:58', src: null },
  { id: 3, title: 'Abysses', album: 'Abysses', duration: '5:14', src: null },
  { id: 4, title: 'Brume Noire', album: 'Nuit Blanche', duration: '6:01', src: null },
];

export function AudioProvider({ children }) {
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [minimized, setMinimized] = useState(false);
  const [scTitle, setScTitle] = useState(null);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const track = TRACKS[trackIdx];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const toggle = () => {
    if (!audioRef.current?.src) {
      // No real audio — just animate the player
      setPlaying((p) => !p);
      return;
    }
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlaying((p) => !p);
  };

  const next = () => {
    setTrackIdx((i) => (i + 1) % TRACKS.length);
    setProgress(0);
  };

  const prev = () => {
    setTrackIdx((i) => (i - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  // Simulate progress when no real audio
  useEffect(() => {
    if (playing && !audioRef.current?.src) {
      intervalRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) { next(); return 0; }
          return p + 0.1;
        });
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing]);

  return (
    <AudioContext.Provider value={{
      track, tracks: TRACKS, trackIdx, playing, progress, volume,
      minimized, setMinimized, setVolume, toggle, next, prev, setProgress, audioRef,
      scTitle, setScTitle,
    }}>
      {children}
      <audio ref={audioRef} onEnded={next} />
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
