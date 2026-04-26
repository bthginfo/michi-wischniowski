import { useState, useEffect } from 'react'

const DEFAULTS = {
  filmography: {
    Theater: [],
    'Film / TV': [],
    Audio: [],
  },
  awards: [],
  skills: {
    Sprachen: [],
    Gesang: [],
    Sport: [],
    Sonstiges: [],
  },
}

const API = '/api/vita'

export default function VitaAdmin() {
  const [pw, setPw] = useState('')
  const [authed, setAuthed] = useState(false)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState('filmography')
  const [filmCat, setFilmCat] = useState('Theater')
  const [skillCat, setSkillCat] = useState('Sprachen')

  const login = async () => {
    setLoading(true)
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pw}` },
        body: JSON.stringify({}),
      })
      if (res.ok) {
        setAuthed(true)
        loadData()
      } else {
        setMsg('Falsches Passwort!')
      }
    } catch {
      setMsg('Verbindungsfehler')
    }
    setLoading(false)
  }

  const loadData = async () => {
    try {
      const res = await fetch(API)
      const json = await res.json()
      setData(json && json.filmography ? json : DEFAULTS)
    } catch {
      setData(DEFAULTS)
    }
  }

  useEffect(() => { loadData() }, [])

  const save = async () => {
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${pw}` },
        body: JSON.stringify(data),
      })
      if (res.ok) setMsg('✅ Gespeichert!')
      else setMsg('❌ Fehler beim Speichern')
    } catch {
      setMsg('❌ Verbindungsfehler')
    }
    setLoading(false)
  }

  if (!authed) {
    return (
      <div style={styles.loginWrap}>
        <div style={styles.loginBox}>
          <h1 style={styles.h1}>🎭 Vita Admin</h1>
          <p style={styles.sub}>Passwort eingeben um Vita-Daten zu bearbeiten</p>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Admin-Passwort"
            style={styles.input}
            autoFocus
          />
          <button onClick={login} disabled={loading || !pw} style={styles.btnPrimary}>
            {loading ? '...' : 'Einloggen'}
          </button>
          {msg && <p style={styles.err}>{msg}</p>}
        </div>
      </div>
    )
  }

  if (!data) return <div style={styles.loginWrap}><p>Lade...</p></div>

  const filmEntries = data.filmography?.[filmCat] || []
  const skillEntries = data.skills?.[skillCat] || []
  const filmCategories = Object.keys(data.filmography || {})
  const skillCategories = Object.keys(data.skills || {})

  const updateFilmEntry = (idx, field, value) => {
    const updated = [...filmEntries]
    updated[idx] = { ...updated[idx], [field]: value }
    setData({ ...data, filmography: { ...data.filmography, [filmCat]: updated } })
  }

  const addFilmEntry = () => {
    const updated = [{ year: new Date().getFullYear().toString(), title: '', role: '', director: '', house: '' }, ...filmEntries]
    setData({ ...data, filmography: { ...data.filmography, [filmCat]: updated } })
  }

  const removeFilmEntry = (idx) => {
    const updated = filmEntries.filter((_, i) => i !== idx)
    setData({ ...data, filmography: { ...data.filmography, [filmCat]: updated } })
  }

  const addFilmCategory = () => {
    const name = prompt('Name der neuen Kategorie:')
    if (name && !data.filmography[name]) {
      setData({ ...data, filmography: { ...data.filmography, [name]: [] } })
      setFilmCat(name)
    }
  }

  const updateAward = (idx, field, value) => {
    const updated = [...(data.awards || [])]
    updated[idx] = { ...updated[idx], [field]: value }
    setData({ ...data, awards: updated })
  }

  const addAward = () => {
    setData({ ...data, awards: [{ year: new Date().getFullYear().toString(), title: '' }, ...(data.awards || [])] })
  }

  const removeAward = (idx) => {
    setData({ ...data, awards: (data.awards || []).filter((_, i) => i !== idx) })
  }

  const updateSkill = (idx, field, value) => {
    const updated = [...skillEntries]
    updated[idx] = { ...updated[idx], [field]: value }
    setData({ ...data, skills: { ...data.skills, [skillCat]: updated } })
  }

  const addSkill = () => {
    const updated = [{ name: '', level: '', pro: false }, ...skillEntries]
    setData({ ...data, skills: { ...data.skills, [skillCat]: updated } })
  }

  const removeSkill = (idx) => {
    const updated = skillEntries.filter((_, i) => i !== idx)
    setData({ ...data, skills: { ...data.skills, [skillCat]: updated } })
  }

  const addSkillCategory = () => {
    const name = prompt('Name der neuen Kategorie:')
    if (name && !data.skills[name]) {
      setData({ ...data, skills: { ...data.skills, [name]: [] } })
      setSkillCat(name)
    }
  }

  const moveEntry = (list, idx, dir, setter) => {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= list.length) return
    const updated = [...list]
    ;[updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]]
    setter(updated)
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h1 style={styles.h1}>🎭 Vita Admin</h1>
        <div style={styles.headerRight}>
          {msg && <span style={styles.msgInline}>{msg}</span>}
          <button onClick={save} disabled={loading} style={styles.btnSave}>
            {loading ? 'Speichert...' : '💾 Speichern'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {['filmography', 'awards', 'skills'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={tab === t ? { ...styles.tab, ...styles.tabActive } : styles.tab}>
            {t === 'filmography' ? '🎬 Rollen' : t === 'awards' ? '🏆 Preise' : '💪 Skills'}
          </button>
        ))}
      </div>

      {/* Filmography Tab */}
      {tab === 'filmography' && (
        <div>
          <div style={styles.catRow}>
            {filmCategories.map(cat => (
              <button key={cat} onClick={() => setFilmCat(cat)}
                style={filmCat === cat ? { ...styles.catBtn, ...styles.catBtnActive } : styles.catBtn}>
                {cat} ({(data.filmography[cat] || []).length})
              </button>
            ))}
            <button onClick={addFilmCategory} style={styles.catBtnAdd}>+ Kategorie</button>
          </div>
          <button onClick={addFilmEntry} style={styles.btnAdd}>+ Neue Rolle</button>
          <div style={styles.list}>
            {filmEntries.map((entry, i) => (
              <div key={i} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardNum}>#{i + 1}</span>
                  <div style={styles.cardActions}>
                    <button onClick={() => moveEntry(filmEntries, i, -1, (u) => setData({ ...data, filmography: { ...data.filmography, [filmCat]: u } }))} disabled={i === 0} style={styles.btnSmall}>↑</button>
                    <button onClick={() => moveEntry(filmEntries, i, 1, (u) => setData({ ...data, filmography: { ...data.filmography, [filmCat]: u } }))} disabled={i === filmEntries.length - 1} style={styles.btnSmall}>↓</button>
                    <button onClick={() => removeFilmEntry(i)} style={styles.btnDel}>✕</button>
                  </div>
                </div>
                <div style={styles.fields}>
                  <Field label="Jahr" value={entry.year} onChange={v => updateFilmEntry(i, 'year', v)} width="100px" />
                  <Field label="Titel" value={entry.title} onChange={v => updateFilmEntry(i, 'title', v)} />
                  <Field label="Rolle" value={entry.role} onChange={v => updateFilmEntry(i, 'role', v)} />
                  <Field label="Regie" value={entry.director} onChange={v => updateFilmEntry(i, 'director', v)} />
                  <Field label="Haus" value={entry.house} onChange={v => updateFilmEntry(i, 'house', v)} />
                </div>
              </div>
            ))}
            {filmEntries.length === 0 && <p style={styles.empty}>Keine Einträge. Klicke "+ Neue Rolle" um eine hinzuzufügen.</p>}
          </div>
        </div>
      )}

      {/* Awards Tab */}
      {tab === 'awards' && (
        <div>
          <button onClick={addAward} style={styles.btnAdd}>+ Neuer Preis</button>
          <div style={styles.list}>
            {(data.awards || []).map((award, i) => (
              <div key={i} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardNum}>#{i + 1}</span>
                  <button onClick={() => removeAward(i)} style={styles.btnDel}>✕</button>
                </div>
                <div style={styles.fields}>
                  <Field label="Jahr" value={award.year} onChange={v => updateAward(i, 'year', v)} width="100px" />
                  <Field label="Titel" value={award.title} onChange={v => updateAward(i, 'title', v)} />
                </div>
              </div>
            ))}
            {(!data.awards || data.awards.length === 0) && <p style={styles.empty}>Keine Preise.</p>}
          </div>
        </div>
      )}

      {/* Skills Tab */}
      {tab === 'skills' && (
        <div>
          <div style={styles.catRow}>
            {skillCategories.map(cat => (
              <button key={cat} onClick={() => setSkillCat(cat)}
                style={skillCat === cat ? { ...styles.catBtn, ...styles.catBtnActive } : styles.catBtn}>
                {cat} ({(data.skills[cat] || []).length})
              </button>
            ))}
            <button onClick={addSkillCategory} style={styles.catBtnAdd}>+ Kategorie</button>
          </div>
          <button onClick={addSkill} style={styles.btnAdd}>+ Neuer Skill</button>
          <div style={styles.list}>
            {skillEntries.map((skill, i) => (
              <div key={i} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.cardNum}>#{i + 1}</span>
                  <div style={styles.cardActions}>
                    <button onClick={() => removeSkill(i)} style={styles.btnDel}>✕</button>
                  </div>
                </div>
                <div style={styles.fields}>
                  <Field label="Name" value={skill.name} onChange={v => updateSkill(i, 'name', v)} />
                  <Field label="Level" value={skill.level} onChange={v => updateSkill(i, 'level', v)} width="150px" />
                  <label style={styles.checkLabel}>
                    <input type="checkbox" checked={skill.pro || false} onChange={e => updateSkill(i, 'pro', e.target.checked)} />
                    Professionell
                  </label>
                </div>
              </div>
            ))}
            {skillEntries.length === 0 && <p style={styles.empty}>Keine Skills.</p>}
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, value, onChange, width }) {
  return (
    <label style={{ ...styles.field, ...(width ? { width } : { flex: 1 }) }}>
      <span style={styles.fieldLabel}>{label}</span>
      <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} style={styles.fieldInput} />
    </label>
  )
}

const styles = {
  loginWrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#eee', fontFamily: 'system-ui, sans-serif' },
  loginBox: { background: '#1a1a1a', padding: '2rem', borderRadius: '12px', textAlign: 'center', maxWidth: '360px', width: '100%' },
  h1: { fontSize: '1.5rem', margin: '0 0 0.5rem', color: '#fff' },
  sub: { fontSize: '0.85rem', color: '#888', marginBottom: '1rem' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #333', background: '#111', color: '#eee', fontSize: '1rem', marginBottom: '0.75rem', boxSizing: 'border-box' },
  btnPrimary: { width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: '#e9c46a', color: '#111', fontWeight: 600, fontSize: '1rem', cursor: 'pointer' },
  err: { color: '#f44', fontSize: '0.85rem', marginTop: '0.5rem' },
  wrap: { minHeight: '100vh', background: '#0a0a0a', color: '#eee', fontFamily: 'system-ui, sans-serif', padding: '1rem', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  msgInline: { fontSize: '0.85rem', color: '#aaa' },
  btnSave: { padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#4caf50', color: '#fff', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer' },
  tabs: { display: 'flex', gap: '4px', marginBottom: '1rem', borderBottom: '1px solid #333', paddingBottom: '4px' },
  tab: { padding: '8px 16px', borderRadius: '8px 8px 0 0', border: 'none', background: 'transparent', color: '#888', fontSize: '0.9rem', cursor: 'pointer' },
  tabActive: { background: '#222', color: '#e9c46a', fontWeight: 600 },
  catRow: { display: 'flex', gap: '6px', marginBottom: '0.75rem', flexWrap: 'wrap' },
  catBtn: { padding: '6px 14px', borderRadius: '20px', border: '1px solid #333', background: '#111', color: '#aaa', fontSize: '0.8rem', cursor: 'pointer' },
  catBtnActive: { borderColor: '#e9c46a', color: '#e9c46a', background: '#1a1500' },
  catBtnAdd: { padding: '6px 14px', borderRadius: '20px', border: '1px dashed #444', background: 'transparent', color: '#666', fontSize: '0.8rem', cursor: 'pointer' },
  btnAdd: { padding: '8px 16px', borderRadius: '8px', border: '1px dashed #444', background: 'transparent', color: '#e9c46a', fontSize: '0.85rem', cursor: 'pointer', marginBottom: '0.75rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '8px' },
  card: { background: '#151515', border: '1px solid #222', borderRadius: '10px', padding: '12px' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  cardNum: { fontSize: '0.75rem', color: '#555' },
  cardActions: { display: 'flex', gap: '4px' },
  btnSmall: { width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: '#888', cursor: 'pointer', fontSize: '0.8rem' },
  btnDel: { width: '28px', height: '28px', borderRadius: '6px', border: '1px solid #522', background: '#200', color: '#f66', cursor: 'pointer', fontSize: '0.85rem' },
  fields: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'end' },
  field: { display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '80px' },
  fieldLabel: { fontSize: '0.7rem', color: '#666', textTransform: 'uppercase' },
  fieldInput: { padding: '6px 8px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: '#eee', fontSize: '0.85rem' },
  checkLabel: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#aaa', cursor: 'pointer' },
  empty: { color: '#555', fontSize: '0.85rem', textAlign: 'center', padding: '2rem' },
}
