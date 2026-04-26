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

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    // GET: public, no auth needed
    if (req.method === 'GET') {
      const data = await redis.get(VITA_KEY)
      if (!data) return res.status(200).json(null)
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
