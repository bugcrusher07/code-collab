import React, { useState, useEffect, useRef } from 'react';
import './homepage.css';

/* ------------------------------------------------------------------ */
/*  Content data                                                       */
/*  Kept out of JSX so the render tree below stays readable and so     */
/*  copy/config can be swapped without touching markup.                 */
/* ------------------------------------------------------------------ */

const NAV_LINKS_LEFT_NAME = 'Strand';

const CODE_LINES = [
  [
    { t: 'import', c: 'kw' },
    { t: ' { ', c: 'punc' },
    { t: 'useEditor', c: 'fn' },
    { t: ' } ', c: 'punc' },
    { t: 'from', c: 'kw' },
    { t: " './editor'", c: 'str' },
  ],
  [],
  [
    { t: 'export', c: 'kw' },
    { t: ' ', c: 'punc' },
    { t: 'function', c: 'kw' },
    { t: ' ', c: 'punc' },
    { t: 'App', c: 'fn' },
    { t: '() {', c: 'punc' },
  ],
  [
    { t: '  const', c: 'kw' },
    { t: ' room ', c: 'plain' },
    { t: '=', c: 'punc' },
    { t: ' useEditor', c: 'fn' },
    { t: "('sprint-42')", c: 'str' },
  ],
  [{ t: '  return (', c: 'punc' }],
  [
    { t: '    <Canvas', c: 'tag' },
    { t: ' room', c: 'prop' },
    { t: '={room}', c: 'punc' },
    { t: '>', c: 'tag' },
  ],
  [
    { t: '      <Cursor', c: 'tag' },
    { t: ' user', c: 'prop' },
    { t: '="Mina"', c: 'str' },
    { t: ' color', c: 'prop' },
    { t: '="#3E7BFA"', c: 'str' },
    { t: ' />', c: 'tag' },
  ],
  [
    { t: '      <Cursor', c: 'tag' },
    { t: ' user', c: 'prop' },
    { t: '="Theo"', c: 'str' },
    { t: ' color', c: 'prop' },
    { t: '="#9B6BFF"', c: 'str' },
    { t: ' />', c: 'tag' },
  ],
  [{ t: '    </Canvas>', c: 'tag' }],
  [{ t: '  )', c: 'punc' }],
  [{ t: '}', c: 'punc' }],
];

const TERMINAL_LINES = [
  { t: '$ strand sync', c: 'prompt' },
  { t: 'workspace connected', c: 'ok' },
  { t: '2 collaborators joined the room', c: 'ok' },
  { t: '$ npm run dev', c: 'prompt' },
  { t: 'ready in 340ms', c: 'plain' },
  { t: 'local   http://localhost:5173', c: 'muted' },
];

const FILE_ROWS = [
  { name: 'src', active: false, kind: 'folder' },
  { name: 'App.tsx', active: true, kind: 'file' },
  { name: 'editor.ts', active: false, kind: 'file' },
  { name: 'styles.css', active: false, kind: 'file' },
  { name: 'package.json', active: false, kind: 'file' },
];

const FEATURES = [
  {
    icon: 'cursors',
    title: 'Live multiplayer editing',
    desc: 'Every teammate\u2019s cursor, selection, and keystroke shows up the instant they happen \u2014 in the same file, side by side.',
  },
  {
    icon: 'terminal',
    title: 'Shared terminal',
    desc: 'Run a command once and everyone in the room sees the same shell, the same output, the same exit code.',
  },
  {
    icon: 'chat',
    title: 'Built-in chat',
    desc: 'Talk through a fix without tabbing away. Messages sit right next to the code they\u2019re about.',
  },
  {
    icon: 'bolt',
    title: 'Zero installation',
    desc: 'No CLI, no cloning, no local setup. Open a link and you\u2019re in a full environment in seconds.',
  },
  {
    icon: 'link',
    title: 'Instant workspace sharing',
    desc: 'Spin up a project and hand out one link. Anyone who opens it is editing with you immediately.',
  },
  {
    icon: 'shield',
    title: 'Isolated workspaces',
    desc: 'Every session runs in its own sandboxed container, so nothing leaks between projects or people.',
  },
  {
    icon: 'cloud',
    title: 'Cloud synchronization',
    desc: 'Changes from every collaborator are saved and versioned automatically, the moment they land.',
  },
  {
    icon: 'pulse',
    title: 'Presence & activity',
    desc: 'See who\u2019s online, which file they\u2019re in, and what they last touched \u2014 always current, never stale.',
  },
];

const STATS = [
  { value: '100K+', label: 'live sessions' },
  { value: '50K+', label: 'developers' },
  { value: '99.99%', label: 'uptime' },
  { value: '12M+', label: 'lines synced together' },
];

const LOGO_PLACEHOLDERS = ['NIMBUS', 'ORBITAL', 'VERTEX', 'HALIDE', 'FORGE & CO', 'QUANTA'];

const AVATAR_INITIALS = [
  { i: 'M', tone: 'blue' },
  { i: 'T', tone: 'purple' },
  { i: 'P', tone: 'cyan' },
  { i: 'R', tone: 'green' },
  { i: 'K', tone: 'amber' },
];

const WORKFLOW_STEPS = [
  {
    title: 'Create a workspace',
    desc: 'Spin up a live coding environment in seconds. No config, no boilerplate.',
  },
  {
    title: 'Invite your team',
    desc: 'Share a single link. Anyone who opens it is instantly in the room with you.',
  },
  {
    title: 'Code in real time',
    desc: 'Edit the same files together, watch every cursor move, run the same terminal.',
  },
  {
    title: 'Ship faster',
    desc: 'Merge with confidence \u2014 everyone already watched the change happen.',
  },
];

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'Roadmap'],
  },
  {
    title: 'Developers',
    links: ['API', 'Documentation', 'GitHub'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Privacy', 'Terms'],
  },
];

/* ------------------------------------------------------------------ */
/*  Small shared pieces                                                 */
/* ------------------------------------------------------------------ */

function StrandMark({ className = '' }) {
  return (
    <svg
      className={`strand-mark ${className}`}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 6C6 6 10 6 12 12C14 18 18 26 26 26"
        stroke="url(#strand-grad-a)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M6 26C6 26 10 26 12 20C14 14 18 6 26 6"
        stroke="url(#strand-grad-b)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="16" cy="16" r="2.3" fill="#2DD4E8" />
      <defs>
        <linearGradient id="strand-grad-a" x1="6" y1="6" x2="26" y2="26">
          <stop offset="0" stopColor="#3E7BFA" />
          <stop offset="1" stopColor="#9B6BFF" />
        </linearGradient>
        <linearGradient id="strand-grad-b" x1="6" y1="26" x2="26" y2="6">
          <stop offset="0" stopColor="#9B6BFF" />
          <stop offset="1" stopColor="#2DD4E8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Reveals a section with a fade/slide once it enters the viewport. */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function SectionHeading({ eyebrow, title, desc, align = 'left' }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h2 className="section-title">{title}</h2>
      {desc && <p className="section-desc">{desc}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Background atmosphere                                               */
/* ------------------------------------------------------------------ */

function BackgroundFX() {
  return (
    <div className="bg-fx" aria-hidden="true">
      <div className="bg-grid" />
      <div className="bg-orb bg-orb--blue" />
      <div className="bg-orb bg-orb--purple" />
      <div className="bg-orb bg-orb--cyan" />
      <div className="bg-particles">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={`bg-particle bg-particle--${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Navbar                                                              */
/* ------------------------------------------------------------------ */

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="nav-brand">
          <StrandMark />
          <span className="brand-name">{NAV_LINKS_LEFT_NAME}</span>
        </div>
        <nav className="nav-actions" aria-label="Account">
          <button type="button" className="btn btn-ghost">
            Sign In
          </button>
          <button type="button" className="btn btn-primary">
            Sign Up
          </button>
        </nav>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero mockup \u2014 the animated "live app" visual                        */
/* ------------------------------------------------------------------ */

function HeroMockup() {
  return (
    <div className="mockup-window" role="img" aria-label="Animated preview of the Strand collaborative editor">
      <div className="mockup-chrome">
        <div className="chrome-dots">
          <span className="chrome-dot chrome-dot--red" />
          <span className="chrome-dot chrome-dot--yellow" />
          <span className="chrome-dot chrome-dot--green" />
        </div>
        <div className="mockup-tabs">
          <span className="mockup-tab mockup-tab--active">App.tsx</span>
          <span className="mockup-tab">server.ts</span>
          <span className="mockup-tab">styles.css</span>
        </div>
        <div className="mockup-presence">
          <div className="avatar-stack">
            {AVATAR_INITIALS.slice(0, 3).map((a) => (
              <span key={a.i} className={`avatar avatar--sm avatar--${a.tone}`}>
                {a.i}
              </span>
            ))}
          </div>
          <span className="presence-live">
            <span className="live-dot" />
            3 online
          </span>
        </div>
      </div>

      <div className="mockup-body">
        <aside className="file-explorer">
          {FILE_ROWS.map((f) => (
            <div key={f.name} className={`file-row ${f.active ? 'file-row--active' : ''}`}>
              <span className={`file-icon file-icon--${f.kind}`} />
              {f.name}
            </div>
          ))}
        </aside>

        <div className="code-pane">
          {CODE_LINES.map((tokens, i) => (
            <div className="code-line" key={i}>
              <span className="line-no">{tokens.length ? i + 1 : ''}</span>
              <span className="code-content">
                {tokens.map((tok, j) => (
                  <span key={j} className={`tok-${tok.c}`}>
                    {tok.t}
                  </span>
                ))}
                {i === CODE_LINES.length - 1 && <span className="type-caret" />}
              </span>
            </div>
          ))}

          <div className="collab-cursor collab-cursor--blue" style={{ top: '38%', left: '58%' }}>
            <span className="cursor-flag cursor-flag--blue">Mina</span>
          </div>
          <div className="collab-cursor collab-cursor--purple" style={{ top: '58%', left: '34%' }}>
            <span className="cursor-flag cursor-flag--purple">Theo</span>
          </div>
        </div>
      </div>

      <div className="mockup-footer">
        <div className="terminal-panel">
          {TERMINAL_LINES.map((line, i) => (
            <div className={`terminal-line terminal-line--${i}`} key={i}>
              <span className={`term-${line.c}`}>{line.t}</span>
            </div>
          ))}
          <div className="terminal-line terminal-prompt-live">
            <span className="term-prompt">$</span>
            <span className="term-caret" />
          </div>
        </div>

        <div className="status-bar">
          <span className="status-branch">
            <span className="branch-icon" />
            main
          </span>
          <span className="status-sync">
            <span className="sync-icon" />
            Synced just now
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero section                                                       */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="eyebrow-dot" />
            Now in open beta
          </span>

          <h1 className="hero-title">
            <span className="hero-title-line">One file.</span>
            <span className="hero-title-line hero-title-line--accent">Every cursor.</span>
            <span className="hero-title-line">No delay.</span>
          </h1>

          <p className="hero-desc">
            Strand is a collaborative code editor that lives in your browser. Open a workspace, share one
            link, and start editing the same file at the same time \u2014 with live cursors, a shared terminal,
            and instant sync built in from the first keystroke.
          </p>

          <div className="hero-cta-row">
            <button type="button" className="btn btn-primary btn-lg">
              Start Coding With a Collaborator
            </button>
          </div>
          <p className="hero-subtext">Works instantly in your browser \u2014 no downloads required.</p>
        </div>

        <div className="hero-visual">
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Auto authentication popup                                          */
/* ------------------------------------------------------------------ */

function AuthModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined;

    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <div
      className={`modal-backdrop ${open ? 'modal-backdrop--open' : ''}`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden={!open}
    >
      <div
        className={`auth-modal ${open ? 'auth-modal--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <div className="modal-icon">
          <StrandMark />
        </div>
        <h3 id="auth-modal-title" className="modal-title">
          Join the room
        </h3>
        <p className="modal-desc">
          Sign in to save your workspace, or create an account \u2014 your collaborators are already waiting.
        </p>
        <div className="modal-actions">
          <button type="button" className="btn btn-primary btn-modal">
            Sign In
          </button>
          <button type="button" className="btn btn-ghost btn-modal">
            Sign Up
          </button>
        </div>
        <p className="modal-fineprint">You can keep browsing without an account.</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Collaboration illustration + statement section                      */
/* ------------------------------------------------------------------ */

function CollabIllustration() {
  return (
    <div className="collab-illustration" aria-hidden="true">
      <div className="collab-card collab-card--a">
        <span className="collab-cursor-dot collab-cursor-dot--blue" />
        {[86, 62, 74, 46].map((w, i) => (
          <span key={i} className="collab-line-bar" style={{ width: `${w}%` }} />
        ))}
      </div>

      <div className="collab-card collab-card--b">
        <span className="collab-cursor-dot collab-cursor-dot--purple" />
        {[70, 92, 54, 64].map((w, i) => (
          <span key={i} className="collab-line-bar" style={{ width: `${w}%` }} />
        ))}
      </div>

      <div className="sync-line">
        <span className="sync-dot-travel" />
      </div>
      <div className="sync-chip">
        <span className="sync-chip-check">&#10003;</span>
        synced
      </div>
    </div>
  );
}

function CollabStatementSection() {
  const [ref, visible] = useReveal();
  return (
    <section className={`section-collab reveal ${visible ? 'reveal--visible' : ''}`} ref={ref}>
      <div className="section-collab-inner">
        <CollabIllustration />
        <div className="statement-col">
          <h2 className="statement-title">
            Stop emailing snippets.
            <br />
            Stop waiting on a pull request.
            <br />
            Just build it \u2014 together, live.
          </h2>
          <p className="statement-desc">
            Every keystroke syncs the moment it happens. See exactly where your teammates are working,
            what they\u2019re changing, and why \u2014 without ever leaving the editor to go ask.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature icons                                                        */
/* ------------------------------------------------------------------ */

function FeatureIcon({ type }) {
  return (
    <span className={`ficon ficon--${type}`} aria-hidden="true">
      <span className="ficon-shape" />
    </span>
  );
}

function FeaturesSection() {
  const [ref, visible] = useReveal();
  return (
    <section className={`section-features reveal ${visible ? 'reveal--visible' : ''}`} ref={ref}>
      <SectionHeading
        align="center"
        eyebrow="Everything you need"
        title="Built for working together"
        desc="Not a code editor with collaboration bolted on \u2014 a shared room your whole team writes code in."
      />
      <div className="features-grid">
        {FEATURES.map((f) => (
          <div className="feature-card" key={f.title}>
            <FeatureIcon type={f.icon} />
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Reserved area for future dynamic components                        */
/* ------------------------------------------------------------------ */

function DynamicSection() {
  const [ref, visible] = useReveal();
  return (
    <section className={`section-dynamic reveal ${visible ? 'reveal--visible' : ''}`} ref={ref}>
      <SectionHeading
        align="center"
        eyebrow="Coming soon"
        title="More tools, shipping into this space"
        desc="Analytics, session replays, and team insights are landing here next."
      />
      <div className="dynamic-grid">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="skeleton-card" key={i}>
            <span className="skeleton-badge">Soon</span>
            <span className="skeleton-shimmer" />
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line" />
            <div className="skeleton-line skeleton-line--short" />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Social proof                                                        */
/* ------------------------------------------------------------------ */

function SocialProofSection() {
  const [ref, visible] = useReveal();
  return (
    <section className={`section-social reveal ${visible ? 'reveal--visible' : ''}`} ref={ref}>
      <p className="social-eyebrow">Trusted by teams who ship in the open</p>

      <div className="logo-row">
        {LOGO_PLACEHOLDERS.map((name) => (
          <span className="logo-item" key={name}>
            {name}
          </span>
        ))}
      </div>

      <div className="social-stats">
        {STATS.map((s) => (
          <div className="stat-item" key={s.label}>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="social-avatars">
        <div className="avatar-row">
          {AVATAR_INITIALS.map((a) => (
            <span key={a.i} className={`avatar avatar--${a.tone}`}>
              {a.i}
            </span>
          ))}
        </div>
        <span className="social-avatars-label">2,400+ developers coding right now</span>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Workflow timeline                                                   */
/* ------------------------------------------------------------------ */

function WorkflowSection() {
  const [ref, visible] = useReveal();
  return (
    <section className={`section-workflow reveal ${visible ? 'reveal--visible' : ''}`} ref={ref}>
      <SectionHeading align="center" eyebrow="How it works" title="From empty room to shipped code" />
      <div className="workflow-track">
        {WORKFLOW_STEPS.map((step, i) => (
          <div className="workflow-step" key={step.title}>
            <div className="step-index">{String(i + 1).padStart(2, '0')}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-desc">{step.desc}</p>
            {i < WORKFLOW_STEPS.length - 1 && <span className="workflow-connector" />}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Bottom call to action                                               */
/* ------------------------------------------------------------------ */

function CTASection() {
  const [ref, visible] = useReveal();
  return (
    <section className={`section-cta reveal ${visible ? 'reveal--visible' : ''}`} id="cta" ref={ref}>
      <div className="cta-glow" aria-hidden="true" />
      <h2 className="cta-title">Ready to write your next line together?</h2>
      <p className="cta-desc">Open a workspace and send the link. Your collaborator will be editing beside you in seconds.</p>
      <button type="button" className="btn btn-primary btn-cta">
        Start Coding
      </button>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="nav-brand">
            <StrandMark />
            <span className="brand-name">Strand</span>
          </div>
          <p className="footer-tagline">Real-time collaborative coding, in the browser.</p>
        </div>

        <div className="footer-columns">
          {FOOTER_COLUMNS.map((col) => (
            <div className="footer-col" key={col.title}>
              <span className="footer-col-title">{col.title}</span>
              {col.links.map((link) => (
                <a className="footer-link" href="#" key={link}>
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <span className="footer-copy">&copy; 2026 Strand. All rights reserved.</span>
        <span className="footer-made">Made for developers.</span>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Root component                                                      */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAuthModalOpen(true), 7000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="strand-home">
      <BackgroundFX />
      <Navbar />

      <main>
        <Hero />
        <CollabStatementSection />
        <FeaturesSection />
        <DynamicSection />
        <SocialProofSection />
        <WorkflowSection />
        <CTASection />
      </main>

      <Footer />

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
