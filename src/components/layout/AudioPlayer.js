import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../context/AudioContext';
import {
  Play, Pause, SkipForward, SkipBack,
  Volume2, ChevronDown, ChevronUp, Music2,
  Repeat, Repeat1,
} from 'lucide-react';

/* Répéter : off → all → one → off */
const REPEAT_MODES = ['off', 'all', 'one'];

const WAVEFORM_BARS = Array.from({ length: 18 }, () => ({
  maxH: Math.random() * 14 + 4,
  dur: 0.5 + Math.random() * 0.5,
}));

/* Formate des secondes en mm:ss */
function fmtTime(sec) {
  if (!sec || isNaN(sec)) return '--:--';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function AudioPlayer() {
  const {
    track, tracks, trackIdx, playing, progress, volume,
    minimized, setMinimized, setVolume, toggle, next, prev, setProgress,
    scTitle, scPlaying, scProgress, scCurrentTime, scDuration,
    scToggle, scNext, scPrev, scSeek, scSetVolume, playFirst,
  } = useAudio();

  const [repeatMode, setRepeatMode] = useState(0); // index in REPEAT_MODES
  const cycleRepeat = useCallback(() => setRepeatMode(m => (m + 1) % REPEAT_MODES.length), []);

  /* ── Mode SC ─────────────────────────────────────────────────── */
  const sc = !!scTitle;

  const displayTitle    = sc ? scTitle         : playing ? track.title : 'Live Set 2026';
  const displaySub      = sc ? 'SoundCloud'    : playing ? `${track.album} · ${track.duration}` : '↓ Section Musique';
  const displayProgress = sc ? scProgress      : progress;
  const isPlaying       = sc ? scPlaying       : playing;

  const handleToggle = sc ? scToggle : playFirst;
  const handleNext   = sc ? scNext   : next;
  const handlePrev   = sc ? scPrev   : prev;

  /* Durée estimée de la piste locale (en secondes) */
  const localDurationSec = track?.duration
    ? parseInt(track.duration.split(':')[0]) * 60 + parseInt(track.duration.split(':')[1])
    : 0;
  const localElapsedSec = localDurationSec ? (progress / 100) * localDurationSec : 0;

  const handleProgressClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct  = ((e.clientX - rect.left) / rect.width) * 100;
    if (sc) scSeek(pct);
    else    setProgress(pct);
  }, [sc, scSeek, setProgress]);

  const handleVolumeChange = useCallback((e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (sc) scSetVolume(v);
  }, [sc, scSetVolume, setVolume]);

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
        borderTop: `1px solid rgba(74,143,255,${sc ? 0.35 : 0.28})`,
        display: 'flex',
        flexDirection: 'column',
        transition: 'height 0.3s ease, border-color 0.4s ease',
        cursor: 'none',
      }}
    >
      {/* ── Barre de progression avec cercle indicateur ──────────── */}
      <div
        onClick={handleProgressClick}
        style={{
          height: 8,
          background: 'rgba(74,143,255,0.12)',
          cursor: 'none',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <div style={{
          height: '100%',
          background: 'linear-gradient(90deg, #4a8fff, #8ab4ff)',
          width: `${displayProgress}%`,
          transition: 'width 0.25s linear',
          position: 'relative',
        }}>
          {/* Cercle indicateur de position */}
          <div style={{
            position: 'absolute',
            right: -5,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#8ab4ff',
            boxShadow: '0 0 6px rgba(74,143,255,0.8)',
            pointerEvents: 'none',
          }} />
        </div>
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
          <motion.div
            animate={isPlaying
              ? { scale: [1, 1.06, 1] }
              : { scale: [1, 1.03, 1] }  /* pulsation douce même en standby */
            }
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 36, height: 36,
              borderRadius: 6,
              background: 'rgba(74,143,255,0.16)',
              border: '1px solid rgba(74,143,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 8px rgba(74,143,255,0.25)',
              transition: 'background 0.3s, border-color 0.3s',
            }}
          >
            <Music2 size={16} color="#4a8fff" />
          </motion.div>

          <div style={{ minWidth: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={displayTitle}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#fff',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {displayTitle}
              </motion.div>
            </AnimatePresence>
            {!minimized && (
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em' }}>
                {displaySub}
              </div>
            )}
          </div>
        </div>

        {/* Temps écoulé / total */}
        {!minimized && (
          <div style={{
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.35)',
            letterSpacing: '0.06em',
            fontVariantNumeric: 'tabular-nums',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {sc
              ? `${fmtTime(scCurrentTime / 1000)} / ${fmtTime(scDuration / 1000)}`
              : localDurationSec > 0 ? `${fmtTime(localElapsedSec)} / ${track.duration}` : null
            }
          </div>
        )}

        {/* Contrôles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CtrlBtn onClick={handlePrev}><SkipBack size={15} /></CtrlBtn>
          <motion.button
            onClick={handleToggle}
            whileTap={{ scale: 0.92 }}
            animate={isPlaying ? { boxShadow: ['0 0 0px rgba(74,143,255,0)', '0 0 10px rgba(74,143,255,0.5)', '0 0 0px rgba(74,143,255,0)'] } : {}}
            transition={isPlaying ? { duration: 1.8, repeat: Infinity, ease: 'easeInOut' } : {}}
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

        {/* Volume + repeat + minimiser */}
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

          {/* Bouton repeat */}
          {!minimized && (
            <CtrlBtn onClick={cycleRepeat}>
              {REPEAT_MODES[repeatMode] === 'one'
                ? <Repeat1 size={14} color="#4a8fff" />
                : <Repeat size={14} color={REPEAT_MODES[repeatMode] === 'all' ? '#4a8fff' : 'rgba(255,255,255,0.3)'} />
              }
            </CtrlBtn>
          )}

          {/* Dots (mode local uniquement) */}
          {!minimized && !sc && (
            <div style={{ display: 'flex', gap: 4 }}>
              {tracks.map((_, i) => (
                <motion.div
                  key={i}
                  animate={i === trackIdx && isPlaying
                    ? { opacity: [0.4, 1, 0.4], scale: [1, 1.3, 1] }
                    : {}
                  }
                  transition={i === trackIdx && isPlaying
                    ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
                    : {}
                  }
                  style={{
                    width: 5, height: 5,
                    borderRadius: '50%',
                    background: i === trackIdx ? '#4a8fff' : 'rgba(255,255,255,0.2)',
                    transition: 'background 0.2s',
                  }}
                />
              ))}
            </div>
          )}

          <CtrlBtn onClick={() => setMinimized(m => !m)}>
            {minimized ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </CtrlBtn>
        </div>
      </div>

      {/* Waveform */}
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
