import { motion } from 'framer-motion';
import { useAudio } from '../../context/AudioContext';
import {
  Play, Pause, SkipForward, SkipBack,
  Volume2, ChevronDown, ChevronUp, Music2,
} from 'lucide-react';

const WAVEFORM_BARS = Array.from({ length: 18 }, () => ({
  maxH: Math.random() * 14 + 4,
  dur: 0.5 + Math.random() * 0.5,
}));

export default function AudioPlayer() {
  const {
    track, tracks, trackIdx, playing, progress, volume,
    minimized, setMinimized, setVolume, toggle, next, prev, setProgress,
    scTitle, scPlaying, scProgress, scToggle, scNext, scPrev, scSeek, scSetVolume,
  } = useAudio();

  /* ── Mode SC : branché sur SoundCloud ─────────────────────────── */
  const sc = !!scTitle;

  /* En standby (pas de SC actif), on affiche le Live Set comme invitation */
  const displayTitle    = sc ? scTitle         : playing ? track.title : 'Live Set 2026';
  const displaySub      = sc ? 'SoundCloud'    : playing ? `${track.album} · ${track.duration}` : '↓ Section Musique';
  const displayProgress = sc ? scProgress      : progress;
  const isPlaying       = sc ? scPlaying       : playing;

  const handleToggle = sc ? scToggle : toggle;
  const handleNext   = sc ? scNext   : next;
  const handlePrev   = sc ? scPrev   : prev;

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = ((e.clientX - rect.left) / rect.width) * 100;
    if (sc) scSeek(pct);
    else    setProgress(pct);
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (sc) scSetVolume(v);
  };

  const barH = minimized ? 52 : 80;

  return (
    <motion.div
      initial={{ y: 120 }}
      animate={{ y: 0 }}
      transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 800,
        height: barH,
        background: 'rgba(4,4,14,0.96)',
        backdropFilter: 'blur(24px)',
        borderTop: `1px solid ${sc ? 'rgba(74,143,255,0.35)' : 'rgba(74,143,255,0.18)'}`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'height 0.3s ease, border-color 0.4s ease',
        cursor: 'none',
      }}
    >
      {/* ── Barre de progression ──────────────────────────────────── */}
      <div
        onClick={handleProgressClick}
        style={{ height: 2, background: 'rgba(74,143,255,0.15)', cursor: 'none' }}
      >
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #4a8fff, #8ab4ff)',
          width: `${displayProgress}%`,
          transition: 'width 0.25s linear',
        }} />
      </div>

      {/* ── Ligne principale ──────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
        gap: '1.5rem',
      }}>
        {/* Info track */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: 0, flex: 1 }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: 6,
            background: sc ? 'rgba(74,143,255,0.18)' : 'rgba(74,143,255,0.12)',
            border: `1px solid ${sc ? 'rgba(74,143,255,0.45)' : 'rgba(74,143,255,0.25)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.3s, border-color 0.3s',
          }}>
            <Music2 size={16} color="#4a8fff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {displayTitle}
            </div>
            {!minimized && (
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>
                {displaySub}
              </div>
            )}
          </div>
        </div>

        {/* Contrôles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CtrlBtn onClick={handlePrev}><SkipBack size={15} /></CtrlBtn>
          <motion.button
            onClick={handleToggle}
            whileTap={{ scale: 0.92 }}
            style={{
              background: '#4a8fff',
              border: 'none',
              borderRadius: '50%',
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'none',
              color: '#fff',
            }}
          >
            {isPlaying ? <Pause size={15} fill="#fff" /> : <Play size={15} fill="#fff" />}
          </motion.button>
          <CtrlBtn onClick={handleNext}><SkipForward size={15} /></CtrlBtn>
        </div>

        {/* Volume + minimiser */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: 1, justifyContent: 'flex-end' }}>
          {!minimized && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Volume2 size={13} color="rgba(255,255,255,0.4)" />
              <input
                type="range"
                min={0} max={1} step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                style={{ width: 70, accentColor: '#4a8fff', cursor: 'none' }}
              />
            </div>
          )}

          {/* Dots (cachés en mode SC — il n'y a pas de "liste" locale) */}
          {!minimized && !sc && (
            <div style={{ display: 'flex', gap: 4 }}>
              {tracks.map((_, i) => (
                <div key={i} style={{
                  width: 5, height: 5,
                  borderRadius: '50%',
                  background: i === trackIdx ? '#4a8fff' : 'rgba(255,255,255,0.2)',
                  transition: 'background 0.2s',
                }} />
              ))}
            </div>
          )}

          <CtrlBtn onClick={() => setMinimized(m => !m)}>
            {minimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </CtrlBtn>
        </div>
      </div>

      {/* Waveform (local ou SC) */}
      {!minimized && isPlaying && (
        <div style={{
          position: 'absolute',
          bottom: 0, left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 2, height: 18,
          opacity: 0.3,
          pointerEvents: 'none',
        }}>
          {WAVEFORM_BARS.map((bar, i) => (
            <motion.div
              key={i}
              animate={{ height: [4, bar.maxH, 4] }}
              transition={{ duration: bar.dur, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 2, background: '#4a8fff', borderRadius: 1 }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function CtrlBtn({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ color: '#4a8fff' }}
      whileTap={{ scale: 0.9 }}
      style={{
        background: 'none', border: 'none',
        cursor: 'none',
        color: 'rgba(255,255,255,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'color 0.2s',
      }}
    >
      {children}
    </motion.button>
  );
}
