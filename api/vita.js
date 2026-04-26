import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

const VITA_KEY = 'michi-vita'
const ADMIN_PW = process.env.ADMIN_PASSWORD || ''

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

// Default seed data (matches hardcoded values in App.jsx)
const SEED_DATA = {
  filmography: {
    Theater: [
      { year: '2026', title: 'Frau Yamamoto ist noch da', role: 'Nino', director: 'Alina Fluck', house: 'Theater Osnabrück' },
      { year: '2025', title: 'fünf minuten stille', role: '3', director: 'Anna Werner', house: 'Theater Osnabrück' },
      { year: '2025', title: 'Ödipus Exzellenz', role: 'Generalvikar', director: 'Lorenz Nolting, Sofie Boiten, Karl Haucke', house: 'Theater Osnabrück' },
      { year: '2025', title: 'Drei Winter', role: 'Marko Horvath', director: 'Kathrin Mayr', house: 'Theater Osnabrück' },
      { year: '2025', title: 'Sonne / Luft / Asche', role: 'Luft / Asche', director: 'Christian Schlüter', house: 'Theater Osnabrück' },
      { year: '2024–25', title: 'Kohlhaas (Glück der Erde, Rücken der Pferde)', role: 'Das Pferd', director: 'Lorenz Nolting', house: 'Theater Osnabrück' },
      { year: '2024', title: 'Der große Gatsby', role: 'Jay Gatsby', director: 'Julia Prechsl', house: 'Theater Osnabrück' },
      { year: '2023–24', title: 'Draußen vor der Tür', role: 'Beckmann', director: 'Philipp Preuss', house: 'Saarl. Staatstheater' },
      { year: '2023–24', title: '#Peep!', role: 'Puppe zum halben Preis', director: 'Mona Sabaschus', house: 'Saarl. Staatstheater' },
      { year: '2023–24', title: 'Die Bettwurst - Das Musical', role: 'Weihnachtsbaum', director: 'Paul Spittler', house: 'Saarl. Staatstheater' },
      { year: '2023', title: 'Hamlet', role: 'Hamlet', director: 'Bettina Bruinier', house: 'Saarl. Staatstheater' },
      { year: '2022', title: 'Die Ratten', role: 'Bruno', director: 'Julia Prechsl', house: 'Saarl. Staatstheater' },
      { year: '2022', title: 'Jedermann.Bliesgau', role: 'Tod | Guter Gesell', director: 'Bettina Bruinier', house: 'Saarl. Staatstheater' },
      { year: '2022', title: 'Der große Gatsby', role: 'Nick Carraway', director: 'Bettina Bruinier', house: 'Saarl. Staatstheater' },
      { year: '2021–22', title: 'Spieler und Tod', role: 'Tod', director: 'Thorsten Köhler', house: 'Saarl. Staatstheater' },
      { year: '2020–22', title: 'Trüffel Trüffel Trüffel', role: 'Frédéric Ratinois', director: 'Julia Prechsl', house: 'Saarl. Staatstheater' },
      { year: '2021', title: 'Der Besuch der alten Dame', role: 'Pfarrer', director: 'Gustav Rueb', house: 'Saarl. Staatstheater' },
      { year: '2021', title: 'Der Geizige', role: 'Mariane', director: 'Matthias Rippert', house: 'Saarl. Staatstheater' },
      { year: '2019–20', title: 'Hoffnung', role: 'Egon Starck', director: 'Krzystof Minkowski', house: 'Saarl. Staatstheater' },
      { year: '2019–20', title: 'Frühlings Erwachen', role: 'Melchior Gabor', director: 'Magali Tosato', house: 'Saarl. Staatstheater' },
      { year: '2019', title: 'Dosenfleisch', role: 'Rolf', director: 'Niklas Ritter', house: 'Saarl. Staatstheater' },
      { year: '2018–19', title: 'Der Streit', role: 'Adine', director: 'Matthias Rippert', house: 'Saarl. Staatstheater' },
      { year: '2018–19', title: 'Das achte Leben (für Brilka)', role: 'Simon | Ramas | Andro | Miqa | Vaso | Lascha', director: 'Bettina Bruinier', house: 'Saarl. Staatstheater' },
      { year: '2018', title: 'Dantons Tod', role: 'Camille Desmoulins', director: 'Christoph Mehler', house: 'Saarl. Staatstheater' },
      { year: '2018', title: 'Wir sind die Guten', role: 'Soldat ohne Kopf | Brian', director: 'Bettina Bruinier', house: 'Saarl. Staatstheater' },
      { year: '2017–18', title: 'Der Große Preis - Songs für Europa', role: 'Italien', director: 'Thorsten Köhler', house: 'Saarl. Staatstheater' },
      { year: '2017', title: 'Kabale und Liebe', role: 'Ferdinand', director: 'Achim Lenz', house: 'Gandersheimer Domfestspiele' },
      { year: '2016–17', title: 'Die Borderline Prozession', role: 'Mann im Auto | Soldat | Lolita', director: 'Kay Voges', house: 'Schauspiel Dortmund' },
      { year: '2015–16', title: 'Der Impresario von Smyrna', role: 'Maccario', director: 'Marco Massafra', house: 'Schauspielhaus Bochum' },
      { year: '2016', title: 'Preparadise sorry now', role: 'Andere Rollen', director: 'Anne-Kathrine Münnich', house: 'Folkwang Theaterzentrum' },
    ],
    'Film / TV': [
      { year: '2016', title: 'Restless', role: 'Vincent', director: 'Julia Schubeius', house: 'FH Dortmund' },
    ],
    Audio: [
      { year: '2017–18', title: 'Weltenbummler und Meisterdiebe', role: 'Fanta', director: 'Stefan Oberle', house: '' },
    ],
  },
  awards: [
    { year: '2023', title: 'SponsorClubPreis' },
    { year: '2017', title: 'Einladung Berliner Theatertreffen' },
  ],
  skills: {
    Sprachen: [
      { name: 'Deutsch', level: 'Muttersprache', pro: true },
      { name: 'Polnisch', level: '', pro: true },
      { name: 'Englisch', level: '', pro: true },
    ],
    Gesang: [
      { name: 'Musical', level: '', pro: true },
      { name: 'Pop', level: '', pro: true },
      { name: 'Rap', level: '', pro: true },
    ],
    Sport: [
      { name: 'Fechten (Bühne)', level: '', pro: true },
      { name: 'Handball', level: '' },
      { name: 'Tanzsport', level: '' },
    ],
    Sonstiges: [
      { name: 'Stimmlage: Bariton', level: '', pro: true },
      { name: 'Führerschein Klasse B', level: '' },
    ],
  },
}

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    // GET: public, no auth needed — auto-seed if empty
    if (req.method === 'GET') {
      let data = await redis.get(VITA_KEY)
      if (!data) {
        await redis.set(VITA_KEY, SEED_DATA)
        data = SEED_DATA
      }
      return res.status(200).json(data)
    }

    // POST: requires admin password
    if (req.method === 'POST') {
      const auth = req.headers.authorization
      if (!ADMIN_PW || auth !== 'Bearer ' + ADMIN_PW) {
        return res.status(401).json({ error: 'Falsches Passwort' })
      }

      const { filmography, awards, skills } = req.body || {}

      // Validate structure
      if (filmography && typeof filmography !== 'object') {
        return res.status(400).json({ error: 'Ungueltige Filmography-Daten' })
      }
      if (awards && !Array.isArray(awards)) {
        return res.status(400).json({ error: 'Ungueltige Awards-Daten' })
      }
      if (skills && typeof skills !== 'object') {
        return res.status(400).json({ error: 'Ungueltige Skills-Daten' })
      }

      // Sanitize all string fields
      const sanitize = (s) => typeof s === 'string' ? s.replace(/[<>]/g, '').trim().slice(0, 500) : ''

      const sanitizeEntry = (e) => ({
        year: sanitize(e.year),
        title: sanitize(e.title),
        role: sanitize(e.role || ''),
        director: sanitize(e.director || ''),
        house: sanitize(e.house || ''),
      })

      const sanitizeAward = (a) => ({
        year: sanitize(a.year),
        title: sanitize(a.title),
      })

      const sanitizeSkill = (s) => ({
        name: sanitize(s.name),
        level: sanitize(s.level || ''),
        pro: !!s.pro,
      })

      const cleanData = {}
      if (filmography) {
        cleanData.filmography = {}
        for (const [cat, entries] of Object.entries(filmography)) {
          const safeCat = sanitize(cat).slice(0, 50)
          if (Array.isArray(entries)) {
            cleanData.filmography[safeCat] = entries.map(sanitizeEntry)
          }
        }
      }
      if (awards) {
        cleanData.awards = awards.map(sanitizeAward)
      }
      if (skills) {
        cleanData.skills = {}
        for (const [cat, entries] of Object.entries(skills)) {
          const safeCat = sanitize(cat).slice(0, 50)
          if (Array.isArray(entries)) {
            cleanData.skills[safeCat] = entries.map(sanitizeSkill)
          }
        }
      }

      // Merge with existing data
      const existing = await redis.get(VITA_KEY) || {}
      const merged = { ...existing, ...cleanData }
      await redis.set(VITA_KEY, merged)

      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('Vita API error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}
