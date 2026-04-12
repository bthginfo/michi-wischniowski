import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const IK = 'https://ik.imagekit.io/iu4cuvwazh/VM/'

const THEMES = {
  default: 'Dark Gold',
  saas: 'Modern SaaS',
  apple: 'Apple Minimal',
  editorial: 'Magazin Editorial',
}

const IMAGES = [
  'image00002.jpg','image00020.jpg','image00026.jpg','image00030.jpg',
  'image00031.jpg','image00034.jpg','image00042.jpg','image00059.jpg',
  'image00005.jpg','image00012.jpg','image00015.jpg','image00024.jpg',
  'image00032.jpg','image00044.jpg','image00048.jpg','image00055.jpg',
  'image00062.jpg','image00063.jpg','image00067.jpg','image00068.jpg',
  'image00072.jpg','image00073.jpg','image00075.jpg','image00083.jpg',
  'image00053.jpg','image00065.jpg','image00099.jpg','image00085.jpg',
  'image00022.jpg','image00037.jpg','image00088.jpg',
]

const HERO_IMAGES = [
  'image00088.jpg',
  'image00002.jpg',
  'image00031.jpg',
  'image00065.jpg',
  'image00059.jpg',
]

const GD = (id) => `https://drive.google.com/file/d/${id}/preview`

const VIDEOS = {
  about: GD('1HFtcqcMdDK4Lcy5YERqsTzObBx1np-Ef'),
  showreels: [
    { title: 'BZgA – Der Hirntod in der ethischen Diskussion', url: GD('11Cgt_VcCcwVYx3_TFJm-dM_9UzE-WniS') },
    { title: 'Die Galerie der vergessenen Berufe', url: GD('1dkrRdOedzAeAGzuqDIIkPQVoLtkuZsnI') },
    { title: 'Les Amoures', url: GD('1chRAKGXaJjxTNxvjeyWfbdcj3-oxOxvo') },
    { title: 'Die Überflüssigen', url: GD('1XbH-s3slBTefs_ZRhMkcTmDAbZjFsY8x') },
  ],
  audio: GD('12wfiX1kX3yLYNcvrdzYOKVf4afBsL6Iy'),
}

const SHOWREEL_POSTERS = [
  `${IK}Screenshot%202026-04-09%20145851.png`,
  `${IK}Screenshot%202026-04-09%20150143.png`,
  `${IK}Screenshot%202026-04-09%20150249.png`,
  `${IK}Screenshot%202026-04-09%20150340.png`,
]

const FILMOGRAPHY = {
  'Film / TV': [
    { year: '2025', title: 'Brunnstraße 52; 3. Stock links', details: 'HR, als: Annika, R: Anselm Dornier', type: 'Kurzfilm' },
    { year: '2023', title: 'BZgA – Der Hirntod in der ethischen Diskussion', details: 'R: Louisa', type: 'Bildung' },
    { year: '2021', title: 'Les amoures', details: 'als: Matilda, R: Luigjina Shkupa', type: 'Ausbildung' },
    { year: '2019', title: 'When In Doubt', details: 'HR, als: She, R: Christina Iberl & Kaj Lehner', type: 'Musikvideo' },
    { year: '2017', title: 'Die Galerie der vergessenen Berufe', details: 'HR, als: Alma, R: Willi Kubica', type: 'Film' },
    { year: '2016', title: 'Some Sunday Morning', details: 'HR, als: Vera, R: Oliver Haffner', type: 'Ausbildung' },
    { year: '2015', title: 'Wer Wir Sind', details: 'als: Lisa, R: Raphael Niederhauser', type: 'Kurzfilm' },
  ],
  Theater: [
    { year: '2025', title: 'Wie es euch gefällt', details: 'NR, als: Silvius, R: Christian Schlüter', type: 'Theater Osnabrück' },
    { year: '2024–25', title: 'Von Fischen und Frauen', details: 'HR, als: Anglerin 1, R: Theresa Thomasberger', type: 'Saarl. Staatstheater' },
    { year: '2025', title: 'Tod eines Handlungsreisenden', details: 'NR, als: The Woman, R: Christoph Mehler', type: 'Saarl. Staatstheater' },
    { year: '2024', title: 'Der Reichskanzler von Atlantis', details: 'NR, als: Frau Semmerling, R: Thorsten Köhler', type: 'Saarl. Staatstheater' },
    { year: '2024', title: 'Der Mann der lacht', details: 'als: Barkilphedro, R: Sébastien Jacobi', type: 'Saarl. Staatstheater' },
    { year: '2022–23', title: 'Die Ratten', details: 'HR, als: Frau John, R: Julia Prechsl', type: 'Saarl. Staatstheater' },
    { year: '2023', title: 'Broadway Danny Rose', details: 'als: Tina Vitale, R: Michael Schachermeier', type: 'Saarl. Staatstheater' },
    { year: '2023', title: 'Wie später ihre Kinder', details: 'als: Steph, R: Leyla-Claire Rabih', type: 'Saarl. Staatstheater' },
    { year: '2023', title: 'Die Kommune', details: 'NR, als: Emma, R: Bettina Bruinier', type: 'Saarl. Staatstheater' },
    { year: '2022', title: 'Die Dreigroschenoper', details: 'NR, als: Jenny, R: Klaus Kusenberg', type: 'Theater Regensburg' },
    { year: '2021', title: 'Richard III', details: 'als: Lady Anne, R: Georg Schmiedleitner', type: 'Theater Regensburg' },
    { year: '2021', title: 'Die Nibelungen', details: 'HR, als: Brunhild, R: Julia Prechsl', type: 'Theater Regensburg' },
    { year: '2019–20', title: 'Die Letzte Sau', details: 'als: Birgit, R: Julia Prechsl', type: 'Theater Regensburg' },
    { year: '2019–20', title: 'Am Königsweg', details: 'als: Volksstimme, R: Stephan Otteni', type: 'Theater Regensburg' },
    { year: '2020', title: 'The Who And The What', details: 'HR, als: Zarina, R: Daniela Wahl', type: 'Theater Regensburg' },
    { year: '2018–19', title: 'Wer hat Angst vorm weißen Mann', details: 'HR, als: Zita, R: Klaus Kusenberg', type: 'Theater Regensburg' },
    { year: '2017–18', title: 'Maria Stuart', details: 'HR, als: Maria Stuart, R: Mélanie Huber', type: 'Theater Regensburg' },
    { year: '2017–18', title: 'Winterreise', details: 'als: Natascha Kampusch, R: Mia Constantine', type: 'Theater Regensburg' },
    { year: '2017–18', title: 'The Black Rider', details: 'HR, als: Käthchen, R: Jan Langenheim', type: 'Theater Regensburg' },
    { year: '2018', title: 'Liliom', details: 'HR, als: Julie, R: Katrin Plötner', type: 'Theater Regensburg' },
    { year: '2016–17', title: 'Hamlet', details: 'als: Ophelia, R: Katrin Plötner', type: 'Theater Regensburg' },
    { year: '2016–17', title: 'Atmen', details: 'HR, als: Frau, R: Jona Manow', type: 'Theater Regensburg' },
    { year: '2017', title: 'Sisters of Swing', details: 'HR, als: Maxene, R: Uwe Schwarz', type: 'Theater Regensburg' },
    { year: '2016', title: 'Empört Euch Ihr Krähwinkler!', details: 'als: div. Rollen, R: Gernot Plass', type: 'TAG Wien' },
  ],
  Audio: [
    { year: '2024–25', title: 'Stimmen des Widerstands 1935', details: 'als: Lore Wolf, R: Finn Tödte', type: 'Hörspiel' },
    { year: '2016', title: 'Pearle – Werbespot', details: 'als: Sprecherin', type: 'Werbung' },
    { year: '2016', title: 'Lopoca Sportwetten', details: 'als: Sprecherin', type: 'Werbung' },
    { year: '2016', title: 'Schärdinger – "Meine Linie"', details: 'als: Sprecherin', type: 'Werbung' },
    { year: '2015', title: 'JUHU! T-mobile', details: 'als: Sprecherin', type: 'Werbung' },
    { year: '2015', title: 'Pearle Radiospot', details: 'als: Sprecherin', type: 'Werbung' },
    { year: '2014', title: 'Baymax – Riesiges Robowabohu', details: 'als: Studentin, R: Don Hall', type: 'Synchronisation' },
  ],
}

const AWARDS = [
  { year: '2020', title: 'Förderpreis der Theaterfreunde Regensburg' },
  { year: '2018', title: 'Science + Imagination Award', details: 'Sci-On Filmfestival Nevada – "Die Galerie der vergessenen Berufe"' },
  { year: '2018', title: '"Outstanding German Contribution"', details: 'Berlin Sci-Fi Filmfestival – "Die Galerie der vergessenen Berufe"' },
]

const SKILLS_DATA = {
  Sprachen: [
    { name: 'Deutsch', level: 'Muttersprache', pro: true },
    { name: 'Englisch', level: 'fließend', pro: true },
    { name: 'Latein', level: 'Grundkenntnisse' },
    { name: 'Polnisch', level: 'Grundkenntnisse' },
  ],
  'Dialekte & Akzente': [
    { name: 'Bairisch', level: 'Heimatdialekt', pro: true },
    { name: 'Britisch', level: 'Standard', pro: true },
    { name: 'Amerikanisch', level: 'Standard', pro: true },
  ],
  Gesang: [
    { name: 'Chanson', level: 'professionell', pro: true },
    { name: 'Musical', level: 'professionell', pro: true },
    { name: 'A cappella', level: 'professionell', pro: true },
    { name: 'Folk / Jazz / Country', level: 'gut' },
    { name: 'Soul / RnB / Klassisch', level: 'gut' },
  ],
  Tanz: [
    { name: 'Jazzdance', level: 'gut' },
    { name: 'Choreografie', level: 'gut' },
    { name: 'Modern Dance', level: 'gut' },
    { name: 'Ballett / Hip Hop / Steppen', level: 'Grundkenntnisse' },
  ],
  Instrumente: [
    { name: 'Klavier', level: 'gut' },
    { name: 'Gitarre', level: 'Grundkenntnisse' },
    { name: 'Querflöte', level: 'Grundkenntnisse' },
  ],
  Sport: [
    { name: 'Yoga', level: 'gut' },
    { name: 'Volleyball / Beachvolleyball', level: 'gut' },
    { name: 'Bühnenkampf / Fechten', level: 'Grundkenntnisse' },
  ],
}

/* ═══════ SHARED COMPONENTS ═══════ */

function FadeIn({ children, className, delay = 0 }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 })
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  )
}

function HeroSlideshow() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="hero-slideshow">
      <AnimatePresence mode="wait">
        <motion.img key={idx} src={`${IK}${HERO_IMAGES[idx]}?tr=w-1400,h-1000,fo-face`} alt="Verena Maria Bauer"
          initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }} />
      </AnimatePresence>
    </div>
  )
}

function VideoPlayer({ src, poster }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div className="video-wrapper">
      {!playing && poster ? (
        <div className="video-poster" onClick={() => setPlaying(true)}>
          <img src={poster} alt="" />
          <div className="video-play-btn">▶</div>
        </div>
      ) : (
        <iframe src={src + (src.includes('?') ? '&' : '?') + 'autoplay=1'} allow="autoplay; encrypted-media" allowFullScreen frameBorder="0" />
      )}
    </div>
  )
}

function AudioPlayer({ src }) {
  return (
    <div className="audio-wrapper">
      <iframe src={src} allow="autoplay" frameBorder="0" />
    </div>
  )
}

function Lightbox({ lightbox, setLightbox }) {
  return (
    <AnimatePresence>
      {lightbox !== null && (
        <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          <button className="lightbox-nav prev" onClick={e => { e.stopPropagation(); setLightbox(i => (i - 1 + IMAGES.length) % IMAGES.length) }}>‹</button>
          <motion.img key={lightbox} src={`${IK}${IMAGES[lightbox]}?tr=w-1400`} alt=""
            initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.35 }} onClick={e => e.stopPropagation()} />
          <button className="lightbox-nav next" onClick={e => { e.stopPropagation(); setLightbox(i => (i + 1) % IMAGES.length) }}>›</button>
          <div className="lightbox-counter">{lightbox + 1} / {IMAGES.length}</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ImpressumPage({ goHome }) {
  return (
    <section className="section legal-page">
      <div className="legal-content">
        <button className="legal-back" onClick={goHome}>← Zurück</button>
        <h1 className="heading-lg">Impressum</h1>
        <h3>Angaben gemäß § 5 TMG</h3>
        <p>Verena Maria Bauer<br />Schauspielerin<br />Osnabrück, Deutschland</p>
        <h3>Kontakt</h3>
        <p>E-Mail: kontakt@verenamariabauer.de</p>
        <h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
        <p>Verena Maria Bauer<br />Osnabrück, Deutschland</p>
        <h3>Haftungsausschluss</h3>
        <h4>Haftung für Inhalte</h4>
        <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.</p>
        <h4>Haftung für Links</h4>
        <p>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.</p>
        <h4>Urheberrecht</h4>
        <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.</p>
      </div>
    </section>
  )
}

function DatenschutzPage({ goHome }) {
  return (
    <section className="section legal-page">
      <div className="legal-content">
        <button className="legal-back" onClick={goHome}>← Zurück</button>
        <h1 className="heading-lg">Datenschutzerklärung</h1>
        <h3>1. Datenschutz auf einen Blick</h3>
        <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
        <h3>2. Hosting</h3>
        <p>Diese Website wird bei Vercel Inc. gehostet. Details: <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a></p>
        <h3>3. Verantwortliche Stelle</h3>
        <p>Verena Maria Bauer, Osnabrück, Deutschland<br />E-Mail: kontakt@verenamariabauer.de</p>
        <h3>4. Cookies</h3>
        <p>Diese Website verwendet ein Cookie, um Ihre Cookie-Präferenz zu speichern (Local Storage). Es werden keine personenbezogenen Daten an Dritte übermittelt.</p>
        <h3>5. Externe Dienste</h3>
        <p>ImageKit (CDN): <a href="https://imagekit.io/privacy" target="_blank" rel="noopener noreferrer">imagekit.io/privacy</a></p>
        <p>Google Fonts: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a></p>
      </div>
    </section>
  )
}

/* ═══════ LAYOUT 1: DEFAULT (Dark Gold) ═══════ */

function LayoutDefault({ scrollTo, activeShowreel, setActiveShowreel, activeTab, setActiveTab, setLightbox }) {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (<>
    <section className="hero" ref={heroRef}>
      <motion.div className="hero-bg" style={{ y: heroY }}><HeroSlideshow /></motion.div>
      <div className="hero-overlay" />
      <motion.div className="hero-content" style={{ opacity: heroOpacity }}>
        <motion.div initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <div className="hero-eyebrow">Schauspielerin · Sängerin · Performerin</div>
          <h1 className="hero-title">
            <span className="hero-title-line">Verena</span>
            <span className="hero-title-line accent">Maria Bauer</span>
          </h1>
          <p className="hero-tagline">Wandelbar. Leidenschaftlich. Auf jeder Bühne zuhause.</p>
          <div className="hero-actions">
            <a href="#reels" className="btn btn-primary" onClick={e => { e.preventDefault(); scrollTo('reels') }}>Showreels</a>
            <a href="#contact" className="btn btn-outline" onClick={e => { e.preventDefault(); scrollTo('contact') }}>Kontakt</a>
          </div>
        </motion.div>
      </motion.div>
      <motion.div className="hero-scroll" style={{ opacity: heroOpacity }}><div className="hero-scroll-line" /></motion.div>
    </section>

    <section id="about" className="section">
      <div className="about-layout">
        <FadeIn className="about-media">
          <div className="about-image-stack">
            <img src={`${IK}image00062.jpg?tr=w-500`} alt="Verena Maria Bauer" className="about-img-main" />
          </div>
        </FadeIn>
        <FadeIn className="about-content" delay={0.15}>
          <span className="label">Über mich</span>
          <h2 className="heading-lg">Zwischen den Welten<br /><em>zuhause</em></h2>
          <p className="body-text">Geboren 1991 in Ingolstadt, ausgebildet an der Musik und Kunst Privatuniversität der Stadt Wien. Über renommierte Häuser wie das Theater Regensburg und das Saarländische Staatstheater hat Verena sich als vielseitige Bühnenkünstlerin etabliert.</p>
          <p className="body-text">Von Shakespeares Ophelia über Maria Stuart bis hin zu zeitgenössischen Stoffen – ihre Mezzosopran-Stimme, professionelles Musical-Können und tänzerische Vielseitigkeit machen sie zur idealen Besetzung für spartenübergreifende Produktionen.</p>
          <div className="about-details">
            <div className="detail"><span>Spielalter</span><strong>28 – 37</strong></div>
            <div className="detail"><span>Größe</span><strong>176 cm</strong></div>
            <div className="detail"><span>Stimmlage</span><strong>Mezzosopran</strong></div>
            <div className="detail"><span>Wohnort</span><strong>Osnabrück</strong></div>
            <div className="detail"><span>Haarfarbe</span><strong>Braun, mittel</strong></div>
            <div className="detail"><span>Augenfarbe</span><strong>Dunkelbraun</strong></div>
          </div>
        </FadeIn>
      </div>
      <FadeIn delay={0.1}>
        <div className="about-video-section">
          <h3 className="heading-sm">Video-Visitenkarte</h3>
          <VideoPlayer src={VIDEOS.about} poster={`${IK}iconframe.jpg`} />
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="stats-row">
          {[['10+', 'Jahre Bühne'], ['30+', 'Theaterrollen'], ['3', 'Awards'], ['4', 'Sprachen']].map(([num, label]) => (
            <div className="stat" key={label}><span className="stat-number">{num}</span><span className="stat-label">{label}</span></div>
          ))}
        </div>
      </FadeIn>
    </section>

    <section id="reels" className="section section-dark">
      <FadeIn><span className="label">Showreels</span><h2 className="heading-lg">Videos & Reels</h2></FadeIn>
      <FadeIn delay={0.1}>
        <div className="reels-layout">
          <div className="reels-main">
            <VideoPlayer key={activeShowreel} src={VIDEOS.showreels[activeShowreel].url} poster={SHOWREEL_POSTERS[activeShowreel]} />
            <h3 className="reel-active-title">{VIDEOS.showreels[activeShowreel].title}</h3>
          </div>
          <div className="reels-list">
            {VIDEOS.showreels.map((reel, i) => (
              <button key={i} className={`reel-item ${i === activeShowreel ? 'active' : ''}`} onClick={() => setActiveShowreel(i)}>
                <span className="reel-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="reel-title">{reel.title}</span>
                {i === activeShowreel && <span className="reel-playing">▶</span>}
              </button>
            ))}
            <div className="reel-audio"><h4>Hörprobe</h4><p className="reel-audio-title">Die Nibelungen · R: Julia Prechsl · 2021</p><AudioPlayer src={VIDEOS.audio} /></div>
          </div>
        </div>
      </FadeIn>
    </section>

    <section id="gallery" className="section">
      <FadeIn><span className="label">Portfolio</span><h2 className="heading-lg">Galerie</h2></FadeIn>
      <FadeIn delay={0.1}>
        <div className="gallery-masonry">
          {IMAGES.map((img, i) => (
            <motion.div key={i} className="gallery-item" onClick={() => setLightbox(i)} whileHover={{ scale: 1.03 }} transition={{ duration: 0.35 }}>
              <img src={`${IK}${img}?tr=w-600`} alt={`Verena Maria Bauer – ${i + 1}`} loading="lazy" />
              <div className="gallery-overlay" />
            </motion.div>
          ))}
        </div>
      </FadeIn>
    </section>

    <section id="career" className="section section-dark">
      <FadeIn><span className="label">Karriere</span><h2 className="heading-lg">Filmografie &amp; Theater</h2></FadeIn>
      <FadeIn delay={0.1}>
        <div className="filmography-tabs">
          {Object.keys(FILMOGRAPHY).map(tab => (
            <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab}<span className="tab-count">{FILMOGRAPHY[tab].length}</span>
            </button>
          ))}
        </div>
      </FadeIn>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }} className="filmography-list">
          {FILMOGRAPHY[activeTab].map((item, i) => (
            <motion.div className="film-item" key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
              <span className="film-year">{item.year}</span>
              <div className="film-info"><div className="film-title">{item.title}</div><div className="film-details">{item.details}</div></div>
              <span className="film-type">{item.type}</span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      <FadeIn delay={0.1}>
        <div className="subsection">
          <span className="label">Auszeichnungen</span><h3 className="heading-sm">Preise & Awards</h3>
          {AWARDS.map((a, i) => (<div className="award-row" key={i}><span className="award-year">{a.year}</span><div><strong>{a.title}</strong>{a.details && <div className="body-text-sm">{a.details}</div>}</div></div>))}
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="subsection">
          <span className="label">Ausbildung</span>
          <div className="award-row"><span className="award-year">2012–16</span><div><strong>Musik und Kunst Privatuniversität der Stadt Wien</strong><div className="body-text-sm">Schauspielstudium</div></div></div>
        </div>
      </FadeIn>
    </section>

    <section id="skills" className="section">
      <FadeIn><span className="label">Fähigkeiten</span><h2 className="heading-lg">Skills & Talente</h2></FadeIn>
      <div className="skills-grid">
        {Object.entries(SKILLS_DATA).map(([cat, items], ci) => (
          <FadeIn key={cat} delay={ci * 0.04}>
            <div className="skill-card"><h3>{cat}</h3>
              {items.map((s, i) => (<div className="skill-row" key={i}><span>{s.name}</span><span className={`skill-badge ${s.pro ? 'pro' : ''}`}>{s.level}</span></div>))}
            </div>
          </FadeIn>
        ))}
      </div>
    </section>

    <section id="contact" className="section section-dark contact-section">
      <FadeIn>
        <div className="contact-inner">
          <span className="label center">Kontakt</span>
          <h2 className="heading-lg center">Let's work<br /><em>together</em></h2>
          <p className="body-text center">Für Casting-Anfragen, Kooperationen oder weitere Informationen.</p>
          <div className="contact-buttons">
            <a href="https://www.schauspielervideos.de/fullprofile/schauspieler-verena-maria-bauer.html" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Profil auf Schauspielervideos.de</a>
            <a href="mailto:kontakt@verenamariabauer.de" className="btn btn-outline">E-Mail schreiben</a>
          </div>
        </div>
      </FadeIn>
    </section>
  </>)
}

/* ═══════ LAYOUT 2: MODERN SAAS ═══════ */

function LayoutSaas({ scrollTo, activeShowreel, setActiveShowreel, activeTab, setActiveTab, setLightbox }) {
  return (<>
    {/* Split hero: text left, image right */}
    <section className="saas-hero" id="top">
      <div className="saas-hero-content">
        <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          <div className="saas-badge">Schauspielerin · Sängerin · Performerin</div>
          <h1 className="saas-hero-title">Verena Maria<br />Bauer</h1>
          <p className="saas-hero-sub">Wandelbar. Leidenschaftlich. Auf jeder Bühne zuhause – von Shakespeare bis Musical, von Film bis Hörspiel.</p>
          <div className="saas-hero-btns">
            <a href="#reels" className="saas-btn-primary" onClick={e => { e.preventDefault(); scrollTo('reels') }}>Showreels ansehen →</a>
            <a href="#contact" className="saas-btn-ghost" onClick={e => { e.preventDefault(); scrollTo('contact') }}>Kontakt aufnehmen</a>
          </div>
          <div className="saas-hero-stats">
            <div><strong>10+</strong><span>Jahre Bühne</span></div>
            <div><strong>30+</strong><span>Rollen</span></div>
            <div><strong>3</strong><span>Awards</span></div>
          </div>
        </motion.div>
      </div>
      <motion.div className="saas-hero-img" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }}>
        <img src={`${IK}image00062.jpg?tr=w-700`} alt="Verena Maria Bauer" />
      </motion.div>
    </section>

    {/* Trusted by / Feature strip */}
    <section className="saas-strip">
      <div className="saas-strip-inner">
        {['Theater Regensburg', 'Saarl. Staatstheater', 'Theater Osnabrück', 'TAG Wien', 'MUK Wien'].map(t => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </section>

    {/* About as feature cards */}
    <section id="about" className="saas-section">
      <FadeIn>
        <div className="saas-section-header">
          <span className="saas-overline">Über mich</span>
          <h2 className="saas-h2">Alles aus einer Hand.</h2>
          <p className="saas-p-lg">Schauspiel, Gesang, Tanz und Moderation – vielseitig ausgebildet und bühnenerprobt seit über einem Jahrzehnt.</p>
        </div>
      </FadeIn>
      <div className="saas-features">
        {[
          { icon: '🎭', title: 'Schauspiel', desc: 'Klassik bis Zeitgenössisch. Ophelia, Maria Stuart, Brunhild – Hauptrollen an renommierten Häusern.' },
          { icon: '🎤', title: 'Gesang', desc: 'Mezzosopran. Musical, Chanson, A cappella – professionell ausgebildet und bühnensicher.' },
          { icon: '💃', title: 'Tanz', desc: 'Jazzdance, Modern, Choreografie – vielseitig einsetzbar für jede Produktion.' },
          { icon: '🎬', title: 'Film & Synchron', desc: 'Kurzfilm, Musikvideo, Bildungsfilm – vor der Kamera ebenso zuhause wie auf der Bühne.' },
          { icon: '🎙️', title: 'Sprache & Stimme', desc: 'Deutsch/Englisch fließend, Bairisch, Britisch, Amerikanisch – Werbung und Hörspiel.' },
          { icon: '🏆', title: 'Ausgezeichnet', desc: 'Förderpreis Theaterfreunde, Science+Imagination Award, Outstanding German Contribution.' },
        ].map((f, i) => (
          <FadeIn key={i} delay={i * 0.05}>
            <div className="saas-feature-card">
              <div className="saas-feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>

    {/* Video-Visitenkarte as big centered section */}
    <section className="saas-section saas-section-dark">
      <FadeIn>
        <div className="saas-section-header">
          <span className="saas-overline">Video-Visitenkarte</span>
          <h2 className="saas-h2">Sehen ist glauben.</h2>
        </div>
        <div className="saas-video-center">
          <VideoPlayer src={VIDEOS.about} poster={`${IK}iconframe.jpg`} />
        </div>
      </FadeIn>
    </section>

    {/* Showreels as horizontal cards */}
    <section id="reels" className="saas-section">
      <FadeIn>
        <div className="saas-section-header">
          <span className="saas-overline">Showreels</span>
          <h2 className="saas-h2">Meine besten Momente.</h2>
        </div>
      </FadeIn>
      <div className="saas-reels-grid">
        {VIDEOS.showreels.map((reel, i) => (
          <FadeIn key={i} delay={i * 0.08}>
            <div className={`saas-reel-card ${i === activeShowreel ? 'active' : ''}`} onClick={() => setActiveShowreel(i)}>
              <img src={SHOWREEL_POSTERS[i]} alt={reel.title} />
              <div className="saas-reel-card-info">
                <span className="saas-reel-num">{String(i + 1).padStart(2, '0')}</span>
                <span>{reel.title}</span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      <div className="mobile-reel-nav">
        {VIDEOS.showreels.map((r, i) => (
          <button key={i} className={`mobile-reel-btn ${i === activeShowreel ? 'active' : ''}`} onClick={() => setActiveShowreel(i)}>{r.title}</button>
        ))}
      </div>
      <FadeIn delay={0.2}>
        <div className="saas-video-center" style={{ marginTop: '2rem' }}>
          <VideoPlayer key={activeShowreel} src={VIDEOS.showreels[activeShowreel].url} poster={SHOWREEL_POSTERS[activeShowreel]} />
        </div>
        <div className="audio-card">
          <div className="audio-card-label">
            <span className="audio-card-icon">🎙</span>
            <div><strong>Hörprobe</strong><span>Die Nibelungen · R: Julia Prechsl · 2021</span></div>
          </div>
          <div className="audio-card-player"><AudioPlayer src={VIDEOS.audio} /></div>
        </div>
      </FadeIn>
    </section>

    {/* Gallery as responsive grid */}
    <section id="gallery" className="saas-section saas-section-dark">
      <FadeIn>
        <div className="saas-section-header">
          <span className="saas-overline">Galerie</span>
          <h2 className="saas-h2">Impressionen.</h2>
        </div>
      </FadeIn>
      <div className="saas-gallery-grid">
        {IMAGES.map((img, i) => (
          <motion.div key={i} className="saas-gallery-item" onClick={() => setLightbox(i)} whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
            <img src={`${IK}${img}?tr=w-500`} alt={`Verena – ${i + 1}`} loading="lazy" />
          </motion.div>
        ))}
      </div>
    </section>

    {/* Steckbrief as two-column */}
    <section className="saas-section">
      <div className="saas-two-col">
        <FadeIn>
          <div>
            <span className="saas-overline">Steckbrief</span>
            <h2 className="saas-h2">Auf einen Blick.</h2>
            <div className="saas-info-grid">
              {[['Spielalter', '28 – 37'], ['Größe', '176 cm'], ['Stimmlage', 'Mezzosopran'], ['Wohnort', 'Osnabrück'], ['Haarfarbe', 'Braun, mittel'], ['Augenfarbe', 'Dunkelbraun']].map(([l, v]) => (
                <div key={l} className="saas-info-item"><span>{l}</span><strong>{v}</strong></div>
              ))}
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div>
            <span className="saas-overline">Skills</span>
            <h2 className="saas-h2">Vielseitig.</h2>
            <div className="saas-skills-tags">
              {Object.entries(SKILLS_DATA).flatMap(([, items]) => items).map((s, i) => (
                <span key={i} className={`saas-tag ${s.pro ? 'pro' : ''}`}>{s.name}</span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>

    {/* Career as timeline */}
    <section id="career" className="saas-section saas-section-dark">
      <FadeIn><div className="saas-section-header"><span className="saas-overline">Karriere</span><h2 className="saas-h2">Filmografie & Theater</h2></div></FadeIn>
      <div className="saas-tabs">
        {Object.keys(FILMOGRAPHY).map(tab => (
          <button key={tab} className={`saas-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab} <span>({FILMOGRAPHY[tab].length})</span>
          </button>
        ))}
      </div>
      <div className="saas-career-list">
        {FILMOGRAPHY[activeTab].map((item, i) => (
          <motion.div className="saas-career-item" key={`${activeTab}-${i}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <span className="saas-career-year">{item.year}</span>
            <div className="saas-career-info">
              <strong>{item.title}</strong>
              <p>{item.details}</p>
            </div>
            <span className="saas-career-type">{item.type}</span>
          </motion.div>
        ))}
      </div>
      <FadeIn delay={0.1}>
        <div className="saas-awards-row">
          <h3 className="saas-h3">Auszeichnungen</h3>
          <div className="saas-awards-cards">
            {AWARDS.map((a, i) => (
              <div key={i} className="saas-award-card">
                <span className="saas-award-year">{a.year}</span>
                <strong>{a.title}</strong>
                {a.details && <p>{a.details}</p>}
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>

    {/* CTA */}
    <section id="contact" className="saas-cta" id="contact">
      <FadeIn>
        <h2 className="saas-cta-title">Bereit für die nächste Rolle?</h2>
        <p className="saas-cta-sub">Für Casting-Anfragen, Kooperationen oder weitere Informationen.</p>
        <div className="saas-hero-btns" style={{ justifyContent: 'center' }}>
          <a href="https://www.schauspielervideos.de/fullprofile/schauspieler-verena-maria-bauer.html" target="_blank" rel="noopener noreferrer" className="saas-btn-primary">Profil ansehen →</a>
          <a href="mailto:kontakt@verenamariabauer.de" className="saas-btn-ghost">E-Mail schreiben</a>
        </div>
      </FadeIn>
    </section>
  </>)
}

/* ═══════ LAYOUT 3: APPLE MINIMAL ═══════ */

function LayoutApple({ scrollTo, activeShowreel, setActiveShowreel, activeTab, setActiveTab, setLightbox }) {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (<>
    {/* Immersive fullscreen hero with scale effect */}
    <section className="apple-hero" ref={heroRef}>
      <motion.img className="apple-hero-bg" src={`${IK}image00088.jpg?tr=w-1800,fo-face`} alt="" style={{ scale: heroScale }} />
      <div className="apple-hero-overlay" />
      <motion.div className="apple-hero-text" style={{ opacity: heroOpacity }}
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.5 }}>
        <h1>Verena Maria Bauer</h1>
        <p>Schauspielerin. Sängerin. Performerin.</p>
      </motion.div>
    </section>

    {/* Intro - big text + portrait side by side */}
    <section className="apple-intro" id="about">
      <FadeIn className="apple-intro-text">
        <p className="apple-big-text">
          Wandelbar. Leidenschaftlich.<br />
          Auf jeder Bühne zuhause.
        </p>
        <p className="apple-body">Geboren 1991 in Ingolstadt. Ausgebildet an der MUK Wien. Über 30 Hauptrollen an renommierten Häusern – von Shakespeares Ophelia über Maria Stuart bis hin zu zeitgenössischen Stoffen.</p>
        <div className="apple-details-inline">
          {[['Spielalter', '28–37'], ['Größe', '176 cm'], ['Stimme', 'Mezzosopran'], ['Standort', 'Osnabrück']].map(([l, v]) => (
            <div key={l}><span>{l}</span><strong>{v}</strong></div>
          ))}
        </div>
      </FadeIn>
      <FadeIn className="apple-intro-img" delay={0.15}>
        <img src={`${IK}image00062.jpg?tr=w-700`} alt="Verena Maria Bauer" />
      </FadeIn>
    </section>

    {/* Stats strip */}
    <section className="apple-stats">
      {[['10+', 'Jahre Bühne'], ['30+', 'Theaterrollen'], ['3', 'Awards'], ['4', 'Sprachen']].map(([num, label]) => (
        <FadeIn key={label}>
          <div className="apple-stat"><span className="apple-stat-num">{num}</span><span className="apple-stat-label">{label}</span></div>
        </FadeIn>
      ))}
    </section>

    {/* Video-Visitenkarte */}
    <section className="apple-video-section">
      <FadeIn>
        <p className="apple-section-label">Video-Visitenkarte</p>
        <div className="apple-video-wide">
          <VideoPlayer src={VIDEOS.about} poster={`${IK}iconframe.jpg`} />
        </div>
      </FadeIn>
    </section>

    {/* Showreels */}
    <section id="reels" className="apple-video-section">
      <FadeIn>
        <p className="apple-section-label">Showreels</p>
        <div className="apple-reel-nav">
          {VIDEOS.showreels.map((r, i) => (
            <button key={i} className={`apple-reel-btn ${i === activeShowreel ? 'active' : ''}`} onClick={() => setActiveShowreel(i)}>
              {r.title}
            </button>
          ))}
        </div>
        <div className="apple-video-wide">
          <VideoPlayer key={activeShowreel} src={VIDEOS.showreels[activeShowreel].url} poster={SHOWREEL_POSTERS[activeShowreel]} />
        </div>
        <div className="audio-card">
          <div className="audio-card-label">
            <span className="audio-card-icon">🎙</span>
            <div><strong>Hörprobe</strong><span>Die Nibelungen · R: Julia Prechsl · 2021</span></div>
          </div>
          <div className="audio-card-player"><AudioPlayer src={VIDEOS.audio} /></div>
        </div>
      </FadeIn>
    </section>

    {/* Gallery – compact 3-column masonry */}
    <section id="gallery" className="apple-gallery-section">
      <FadeIn><p className="apple-section-label">Galerie</p></FadeIn>
      <div className="apple-gallery-grid">
        {IMAGES.map((img, i) => (
          <div key={i} className="apple-gallery-item" onClick={() => setLightbox(i)}>
            <img src={`${IK}${img}?tr=w-500`} alt="" loading="lazy" />
          </div>
        ))}
      </div>
    </section>

    {/* Career */}
    <section id="career" className="apple-career-section">
      <FadeIn>
        <p className="apple-big-text" style={{ marginBottom: '3rem' }}>
          Über <em>30 Rollen</em> auf den<br />größten Bühnen des Landes.
        </p>
      </FadeIn>
      <div className="apple-tabs">
        {Object.keys(FILMOGRAPHY).map(tab => (
          <button key={tab} className={`apple-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>
      <div className="apple-film-list">
        {FILMOGRAPHY[activeTab].map((item, i) => (
          <motion.div className="apple-film-row" key={`${activeTab}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
            <span className="apple-film-year">{item.year}</span>
            <div className="apple-film-main">
              <span className="apple-film-title">{item.title}</span>
              <span className="apple-film-details">{item.details}</span>
            </div>
            <span className="apple-film-type">{item.type}</span>
          </motion.div>
        ))}
      </div>
      <FadeIn delay={0.1}>
        <div className="apple-awards">
          <p className="apple-section-label" style={{ marginTop: '4rem' }}>Auszeichnungen</p>
          {AWARDS.map((a, i) => (
            <div key={i} className="apple-award-row">
              <span>{a.year}</span><strong>{a.title}</strong>{a.details && <span className="apple-award-detail">{a.details}</span>}
            </div>
          ))}
        </div>
      </FadeIn>
    </section>

    {/* Skills */}
    <section id="skills" className="apple-skills-section">
      <FadeIn>
        <p className="apple-section-label">Fähigkeiten</p>
        <div className="apple-skills-grid">
          {Object.entries(SKILLS_DATA).map(([cat, items]) => (
            <div key={cat} className="apple-skill-group">
              <h3 className="apple-skill-cat">{cat}</h3>
              <div className="apple-skill-tags">
                {items.map((s, i) => <span key={i} className={s.pro ? 'pro' : ''}>{s.name}</span>)}
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>

    {/* Contact */}
    <section id="contact" className="apple-cta">
      <FadeIn>
        <h2>Let's work together.</h2>
        <div className="apple-cta-links">
          <a href="https://www.schauspielervideos.de/fullprofile/schauspieler-verena-maria-bauer.html" target="_blank" rel="noopener noreferrer">Profil ansehen →</a>
          <a href="mailto:kontakt@verenamariabauer.de">E-Mail schreiben →</a>
        </div>
      </FadeIn>
    </section>
  </>)
}

/* ═══════ LAYOUT 4: MAGAZIN EDITORIAL ═══════ */

function LayoutEditorial({ scrollTo, activeShowreel, setActiveShowreel, activeTab, setActiveTab, setLightbox }) {
  const parallaxRef = useRef(null)
  const { scrollYProgress: pProgress } = useScroll({ target: parallaxRef, offset: ['start end', 'end start'] })
  const parallaxY = useTransform(pProgress, [0, 1], ['-15%', '15%'])

  return (<>
    {/* Full-bleed hero with overlay text bottom-left */}
    <section className="ed-hero">
      <img src={`${IK}image00088.jpg?tr=w-1800,fo-face`} alt="" className="ed-hero-img" />
      <div className="ed-hero-overlay" />
      <motion.div className="ed-hero-text" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <span className="ed-issue">Portfolio 2026</span>
        <h1>Verena<br />Maria<br />Bauer</h1>
        <p>Schauspielerin · Sängerin · Performerin</p>
      </motion.div>
    </section>

    {/* Two-column intro: large pullquote + body */}
    <section id="about" className="ed-section">
      <div className="ed-two-col-intro">
        <FadeIn>
          <div className="ed-pullquote">
            <span className="ed-dropcap">V</span>on Shakespeares Ophelia über Maria Stuart bis hin zu zeitgenössischen Stoffen – Verena Maria Bauer ist eine der vielseitigsten Bühnenkünstlerinnen ihrer Generation.
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="ed-intro-body">
            <p>Geboren 1991 in Ingolstadt, führte sie der Weg über die Musik und Kunst Privatuniversität der Stadt Wien auf die großen Bühnen. Am Theater Regensburg und dem Saarländischen Staatstheater spielte sie über 30 Hauptrollen.</p>
            <p>Ihr Repertoire umfasst Schauspiel, Musical, Gesang und Tanz. Mit Mezzosopran, professionellem Musical-Können und tänzerischer Vielseitigkeit ist sie die ideale Besetzung für spartenübergreifende Produktionen.</p>
            <div className="ed-meta-row">
              {[['Spielalter', '28–37'], ['Größe', '176 cm'], ['Stimme', 'Mezzosopran']].map(([l, v]) => (
                <div key={l}><span className="ed-meta-label">{l}</span><span className="ed-meta-value">{v}</span></div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>

    {/* Parallax image break */}
    <div className="ed-parallax-wrap" ref={parallaxRef}>
      <motion.img src={`${IK}image00059.jpg?tr=w-1600`} alt="Verena Maria Bauer" style={{ y: parallaxY }} className="ed-parallax-img" />
    </div>

    {/* Video */}
    <section className="ed-section">
      <FadeIn>
        <div className="ed-section-title"><span className="ed-rule" /><span>Video-Visitenkarte</span><span className="ed-rule" /></div>
        <div className="ed-video-wrap">
          <VideoPlayer src={VIDEOS.about} poster={`${IK}iconframe.jpg`} />
        </div>
      </FadeIn>
    </section>

    {/* Showreels */}
    <section id="reels" className="ed-section ed-section-alt">
      <FadeIn>
        <div className="ed-section-title"><span className="ed-rule" /><span>Showreels</span><span className="ed-rule" /></div>
      </FadeIn>
      <div className="ed-reels-grid">
        {VIDEOS.showreels.map((reel, i) => (
          <FadeIn key={i} delay={i * 0.06}>
            <div className={`ed-reel-card ${i === activeShowreel ? 'active' : ''}`} onClick={() => setActiveShowreel(i)}>
              <img src={SHOWREEL_POSTERS[i]} alt={reel.title} />
              <span>{reel.title}</span>
            </div>
          </FadeIn>
        ))}
      </div>
      <div className="mobile-reel-nav">
        {VIDEOS.showreels.map((r, i) => (
          <button key={i} className={`mobile-reel-btn ${i === activeShowreel ? 'active' : ''}`} onClick={() => setActiveShowreel(i)}>{r.title}</button>
        ))}
      </div>
      <FadeIn delay={0.2}>
        <div className="ed-video-wrap">
          <VideoPlayer key={activeShowreel} src={VIDEOS.showreels[activeShowreel].url} poster={SHOWREEL_POSTERS[activeShowreel]} />
        </div>
        <div className="audio-card">
          <div className="audio-card-label">
            <span className="audio-card-icon">🎙</span>
            <div><strong>Hörprobe</strong><span>Die Nibelungen · R: Julia Prechsl · 2021</span></div>
          </div>
          <div className="audio-card-player"><AudioPlayer src={VIDEOS.audio} /></div>
        </div>
      </FadeIn>
    </section>

    {/* Gallery as magazine spread: big + small mixed */}
    <section id="gallery" className="ed-section">
      <FadeIn><div className="ed-section-title"><span className="ed-rule" /><span>Galerie</span><span className="ed-rule" /></div></FadeIn>
      <div className="ed-gallery-spread">
        {IMAGES.slice(0, 3).map((img, i) => (
          <FadeIn key={i}><div className="ed-gallery-large" onClick={() => setLightbox(i)}><img src={`${IK}${img}?tr=w-1000`} alt="" loading="lazy" /></div></FadeIn>
        ))}
        <div className="ed-gallery-grid">
          {IMAGES.slice(3).map((img, i) => (
            <div key={i} className="ed-gallery-sm" onClick={() => setLightbox(i + 3)}>
              <img src={`${IK}${img}?tr=w-400`} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Career: sidebar year nav + content */}
    <section id="career" className="ed-section ed-section-alt">
      <FadeIn><div className="ed-section-title"><span className="ed-rule" /><span>Karriere</span><span className="ed-rule" /></div></FadeIn>
      <div className="ed-career-tabs">
        {Object.keys(FILMOGRAPHY).map(tab => (
          <button key={tab} className={`ed-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</button>
        ))}
      </div>
      <div className="ed-career-list">
        {FILMOGRAPHY[activeTab].map((item, i) => (
          <motion.div className="ed-career-item" key={`${activeTab}-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
            <span className="ed-career-year">{item.year}</span>
            <div>
              <strong>{item.title}</strong>
              <span className="ed-career-details">{item.details}</span>
            </div>
            <span className="ed-career-type">{item.type}</span>
          </motion.div>
        ))}
      </div>
      <div className="ed-awards">
        <h3>Auszeichnungen</h3>
        {AWARDS.map((a, i) => (
          <div key={i} className="ed-award"><span>{a.year}</span><strong>{a.title}</strong>{a.details && <p>{a.details}</p>}</div>
        ))}
      </div>
    </section>

    {/* Skills as 3-column magazine layout */}
    <section id="skills" className="ed-section">
      <FadeIn><div className="ed-section-title"><span className="ed-rule" /><span>Skills & Talente</span><span className="ed-rule" /></div></FadeIn>
      <div className="ed-skills-cols">
        {Object.entries(SKILLS_DATA).map(([cat, items]) => (
          <div key={cat} className="ed-skill-col">
            <h4>{cat}</h4>
            {items.map((s, i) => (
              <div key={i} className="ed-skill-row"><span>{s.name}</span><em>{s.level}</em></div>
            ))}
          </div>
        ))}
      </div>
    </section>

    {/* Contact */}
    <section id="contact" className="ed-section ed-section-alt ed-contact">
      <FadeIn>
        <div className="ed-section-title"><span className="ed-rule" /><span>Kontakt</span><span className="ed-rule" /></div>
        <p className="ed-contact-text">Für Casting-Anfragen, Kooperationen oder weitere Informationen.</p>
        <div className="ed-contact-links">
          <a href="https://www.schauspielervideos.de/fullprofile/schauspieler-verena-maria-bauer.html" target="_blank" rel="noopener noreferrer">Schauspielervideos.de →</a>
          <a href="mailto:kontakt@verenamariabauer.de">kontakt@verenamariabauer.de →</a>
        </div>
      </FadeIn>
    </section>
  </>)
}


/* ═══════ MAIN APP ═══════ */

function App() {
  const [scrolled, setScrolled] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [activeTab, setActiveTab] = useState('Theater')
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeShowreel, setActiveShowreel] = useState(0)
  const [theme, setTheme] = useState('default')
  const [page, setPage] = useState('home')
  const [cookieAccepted, setCookieAccepted] = useState(() => localStorage.getItem('cookies_accepted') === 'true')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (lightbox !== null || menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }, [lightbox, menuOpen])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = e => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % IMAGES.length)
      if (e.key === 'ArrowLeft') setLightbox(i => (i - 1 + IMAGES.length) % IMAGES.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const scrollTo = useCallback((id) => {
    setMenuOpen(false)
    setPage('home')
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [])

  const goHome = useCallback(() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }) }, [])
  const acceptCookies = useCallback(() => { localStorage.setItem('cookies_accepted', 'true'); setCookieAccepted(true) }, [])

  const navItems = [['about', 'Über mich'], ['reels', 'Showreels'], ['gallery', 'Galerie'], ['career', 'Karriere'], ['skills', 'Skills'], ['contact', 'Kontakt']]
  const layoutProps = { scrollTo, activeShowreel, setActiveShowreel, activeTab, setActiveTab, setLightbox }

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo" onClick={goHome}>Verena Maria<span>Bauer</span></div>
        <div className="nav-center">
          <ul className="nav-links">
            {navItems.map(([id, label]) => (
              <li key={id}><a href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }}>{label}</a></li>
            ))}
          </ul>
          <select className="theme-select" value={theme} onChange={e => setTheme(e.target.value)}>
            {Object.entries(THEMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className={`nav-hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu open" initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
            {navItems.map(([id, label], i) => (
              <motion.a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id) }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 + 0.1 }}>{label}</motion.a>
            ))}
            <select className="theme-select mobile" value={theme} onChange={e => setTheme(e.target.value)}>
              {Object.entries(THEMES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      {page === 'home' && (<>
        {theme === 'default' && <LayoutDefault {...layoutProps} />}
        {theme === 'saas' && <LayoutSaas {...layoutProps} />}
        {theme === 'apple' && <LayoutApple {...layoutProps} />}
        {theme === 'editorial' && <LayoutEditorial {...layoutProps} />}
      </>)}

      {page === 'impressum' && <ImpressumPage goHome={goHome} />}
      {page === 'datenschutz' && <DatenschutzPage goHome={goHome} />}

      <Lightbox lightbox={lightbox} setLightbox={setLightbox} />

      <footer className="footer">
        <p>© {new Date().getFullYear()} Verena Maria Bauer · <a href="#" onClick={e => { e.preventDefault(); setPage('impressum'); window.scrollTo(0, 0) }}>Impressum</a> · <a href="#" onClick={e => { e.preventDefault(); setPage('datenschutz'); window.scrollTo(0, 0) }}>Datenschutz</a></p>
      </footer>

      {!cookieAccepted && (
        <div className="cookie-banner">
          <p>Diese Website verwendet Cookies. <a href="#" onClick={e => { e.preventDefault(); setPage('datenschutz'); window.scrollTo(0, 0) }}>Mehr erfahren</a></p>
          <button className="btn btn-primary btn-sm" onClick={acceptCookies}>Akzeptieren</button>
        </div>
      )}
    </>
  )
}

export default App
