import { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react'

/* ═══════════════════════════════════════
   MUSIC ENGINE – Audio File Playback
   Uses WAV files from public/music/
   ═══════════════════════════════════════ */

const MusicContext = createContext(null)

export function useMusic() {
  return useContext(MusicContext)
}

const AUDIO_TRACKS = [
  { id: 'map',           title: 'Abenteuer-Theme',  file: '/music/The Field.wav' },
  { id: 'hamburg',       title: 'Hamburg',           file: '/music/Home Town.wav' },
  { id: 'essen',         title: 'Folkwang Essen',    file: '/music/Medieval City.wav' },
  { id: 'bochum',        title: 'Bochum',            file: '/music/Rustic Town.wav' },
  { id: 'dortmund',      title: 'Dortmund',          file: '/music/Damsel Theme.wav' },
  { id: 'saarbruecken',  title: 'Saarbrücken',       file: '/music/Regular Boss.wav' },
  { id: 'osnabrueck',    title: 'Osnabrück',         file: '/music/Regular Battle.wav' },
  { id: 'gdansk',        title: 'Gdańsk',            file: '/music/Win Theme.wav' },
  { id: 'wroclaw',       title: 'Wrocław',           file: '/music/Villain Theme.wav' },
  { id: 'bonus',         title: 'Bonus Arena',       file: '/music/Spooky Cave [COMBAT].wav' },
  { id: 'bonus2',        title: 'Bonus Breakout',    file: '/music/Abandoned Castle.wav' },
]

const getTrackFile = (id) => (AUDIO_TRACKS.find(t => t.id === id) || AUDIO_TRACKS[0]).file

export const RHYTHM_BEAT_PATTERN = [
  { time: 0, col: 0 }, { time: 2, col: 1 }, { time: 4, col: 2 }, { time: 6, col: 3 },
  { time: 8, col: 1 }, { time: 10, col: 2 }, { time: 12, col: 0 }, { time: 14, col: 3 },
  { time: 16, col: 2 }, { time: 18, col: 0 }, { time: 20, col: 1 }, { time: 22, col: 3 },
  { time: 24, col: 2 }, { time: 26, col: 1 }, { time: 28, col: 0 }, { time: 30, col: 2 },
  { time: 32, col: 0 }, { time: 34, col: 1 }, { time: 36, col: 2 }, { time: 38, col: 3 },
  { time: 40, col: 3 }, { time: 42, col: 2 }, { time: 44, col: 1 }, { time: 46, col: 0 },
  { time: 48, col: 1 }, { time: 50, col: 3 }, { time: 52, col: 0 }, { time: 54, col: 2 },
  { time: 56, col: 2 }, { time: 58, col: 1 }, { time: 60, col: 3 }, { time: 62, col: 0 },
  { time: 64, col: 0 }, { time: 66, col: 2 }, { time: 68, col: 1 }, { time: 70, col: 3 },
  { time: 72, col: 3 }, { time: 74, col: 0 }, { time: 76, col: 2 }, { time: 78, col: 1 },
  { time: 80, col: 1 }, { time: 82, col: 3 }, { time: 84, col: 0 }, { time: 86, col: 2 },
  { time: 88, col: 0 }, { time: 90, col: 1 }, { time: 92, col: 2 }, { time: 94, col: 3 },
]

/* ═══════ SFX ENGINE (Web Audio API) ═══════ */
let sfxCtx = null
function getSfxCtx() {
  if (!sfxCtx || sfxCtx.state === 'closed') {
    sfxCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (sfxCtx.state === 'suspended') sfxCtx.resume()
  return sfxCtx
}

function sfxTone(freq, duration, type = 'square', vol = 0.15) {
  const ctx = getSfxCtx(), t = ctx.currentTime
  const osc = ctx.createOscillator(), g = ctx.createGain()
  osc.type = type; osc.frequency.value = freq
  g.gain.setValueAtTime(vol, t)
  g.gain.linearRampToValueAtTime(0, t + duration)
  osc.connect(g).connect(ctx.destination)
  osc.start(t); osc.stop(t + duration + 0.01)
}

function sfxNoise(duration, vol = 0.08, filterFreq = 4000) {
  const ctx = getSfxCtx(), t = ctx.currentTime
  const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  const filt = ctx.createBiquadFilter()
  filt.type = 'highpass'; filt.frequency.value = filterFreq
  const g = ctx.createGain()
  g.gain.setValueAtTime(vol, t)
  g.gain.linearRampToValueAtTime(0, t + duration)
  src.connect(filt).connect(g).connect(ctx.destination)
  src.start(t); src.stop(t + duration + 0.01)
}

export const SFX = {
  hit_perfect() { sfxTone(880, 0.08); setTimeout(() => sfxTone(1320, 0.1), 60) },
  hit_great()   { sfxTone(660, 0.08); setTimeout(() => sfxTone(880, 0.08), 50) },
  hit_ok()      { sfxTone(440, 0.06) },
  correct()     { sfxTone(523, 0.08); setTimeout(() => sfxTone(659, 0.08), 80); setTimeout(() => sfxTone(784, 0.12), 160) },
  match()       { sfxTone(660, 0.06); setTimeout(() => sfxTone(880, 0.08), 70) },
  miss()        { sfxTone(180, 0.15, 'sawtooth', 0.1) },
  wrong()       { sfxTone(200, 0.1, 'sawtooth', 0.1); setTimeout(() => sfxTone(160, 0.15, 'sawtooth', 0.1), 100) },
  player_attack()  { sfxNoise(0.08, 0.12, 2000); sfxTone(300, 0.06, 'sawtooth', 0.08) },
  player_crit()    { sfxNoise(0.12, 0.15, 1500); sfxTone(600, 0.08, 'sawtooth', 0.12); setTimeout(() => sfxTone(900, 0.1), 80) },
  player_heal()    { sfxTone(440, 0.08, 'triangle', 0.12); setTimeout(() => sfxTone(660, 0.1, 'triangle', 0.12), 100); setTimeout(() => sfxTone(880, 0.12, 'triangle', 0.12), 200) },
  player_miss()    { sfxTone(220, 0.12, 'triangle', 0.06) },
  boss_attack()    { sfxTone(120, 0.15, 'sawtooth', 0.12); sfxNoise(0.1, 0.1, 800) },
  boss_heal()      { sfxTone(330, 0.1, 'triangle', 0.1); setTimeout(() => sfxTone(440, 0.12, 'triangle', 0.1), 120) },
  victory()     { [523,659,784,1047].forEach((f, i) => setTimeout(() => sfxTone(f, 0.15, 'square', 0.12), i * 120)) },
  defeat()      { [330,262,220,165].forEach((f, i) => setTimeout(() => sfxTone(f, 0.2, 'triangle', 0.1), i * 150)) },
  level_complete() { [523,659,784,1047,784,1047].forEach((f, i) => setTimeout(() => sfxTone(f, 0.12, 'square', 0.1), i * 100)) },
  unlock()      { sfxTone(440, 0.06, 'square', 0.08); setTimeout(() => sfxTone(880, 0.1, 'square', 0.08), 80) },
  flip()        { sfxTone(600, 0.04, 'square', 0.06) },
  click()       { sfxTone(800, 0.03, 'square', 0.05) },
}

/* ═══════ MUSIC PROVIDER ═══════ */

export function MusicProvider({ children }) {
  const [musicOn, setMusicOn] = useState(false)
  const [currentTrack, setCurrentTrack] = useState('map')
  const audioRef = useRef(null)
  const trackRef = useRef('map')
  const musicOnRef = useRef(false)

  const stopMusic = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
  }, [])

  const startTrack = useCallback((trackId) => {
    stopMusic()
    trackRef.current = trackId
    const file = getTrackFile(trackId)
    const audio = new Audio(file)
    audio.loop = true
    audio.volume = 0.5
    audioRef.current = audio
    if (musicOnRef.current) {
      audio.play().catch(() => {})
    }
  }, [stopMusic])

  const toggleMusic = useCallback(() => {
    if (musicOnRef.current) {
      stopMusic()
      musicOnRef.current = false
      setMusicOn(false)
    } else {
      musicOnRef.current = true
      setMusicOn(true)
      startTrack(trackRef.current)
    }
  }, [startTrack, stopMusic])

  const switchTrack = useCallback((trackId) => {
    trackRef.current = trackId
    setCurrentTrack(trackId)
    if (musicOnRef.current) {
      startTrack(trackId)
    }
  }, [startTrack])

  useEffect(() => () => stopMusic(), [stopMusic])

  const availableTracks = AUDIO_TRACKS.map(t => ({ id: t.id, title: t.title }))

  return (
    <MusicContext.Provider value={{ musicOn, toggleMusic, switchTrack, currentTrack, availableTracks }}>
      {children}
    </MusicContext.Provider>
  )
}

export function MusicToggle() {
  const { musicOn, toggleMusic } = useMusic()
  return (
    <button
      className="fun-btn-icon fun-music-toggle"
      onClick={toggleMusic}
      title={musicOn ? 'Musik aus' : 'Musik an'}
    >
      {musicOn ? '🔊' : '🔇'}
    </button>
  )
}
