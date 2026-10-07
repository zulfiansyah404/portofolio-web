import { type FormEvent, type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowDownRight, ArrowUpRight, Check, Copy, Github, Menu, Search, X } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/toaster';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import heroPortrait from './assets/home-portrait.svg';
import workExperienceData from './data/work-experiences.json';

const queryClient = new QueryClient();
const email = 'hello@eliasnovak.dev';
const experiencePageSize = 4;
const experienceCategories = [
  { id: 'olympiad-tutor', label: 'Olympiad Tutor' },
  { id: 'software-engineer', label: 'Software Engineer' },
] as const;
type ExperienceCategory = (typeof experienceCategories)[number]['id'];

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [activeExperienceCategory, setActiveExperienceCategory] =
    useState<ExperienceCategory>('olympiad-tutor');
  const [experienceSearch, setExperienceSearch] = useState('');
  const [experiencePage, setExperiencePage] = useState(1);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const submitContact = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  const closeMenu = () => setMenuOpen(false);
  const normalizedExperienceSearch = experienceSearch.trim().toLowerCase();
  const sortedExperiences = workExperienceData
    .filter((experience) => {
      if (experience.category !== activeExperienceCategory) return false;
      if (!normalizedExperienceSearch) return true;

      return [
        experience.organization,
        experience.role,
        experience.period,
        experience.location,
        ...experience.descriptions,
      ].some((value) => value.toLowerCase().includes(normalizedExperienceSearch));
    })
    .sort(
      (first, second) =>
        Date.parse(second['start-time']) - Date.parse(first['start-time']),
    );
  const experiencePageCount = Math.max(
    1,
    Math.ceil(sortedExperiences.length / experiencePageSize),
  );
  const visibleExperiences = sortedExperiences.slice(
    (experiencePage - 1) * experiencePageSize,
    experiencePage * experiencePageSize,
  );

  return (
    <main className="portfolio-page" id="top">
      <header className={`topbar ${menuOpen ? 'nav-open' : ''}`}>
        <div className="page-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <a className="wordmark" href="#top" onClick={closeMenu} data-testid="link-home">
            <span className="wordmark-name">Muhammad Zulfiansyah Bayu Pratama</span>
          </a>
          <nav className="nav-links" aria-label="Primary navigation">
            <a href="#about" onClick={closeMenu} data-testid="link-about">About</a>
            <a href="#education" onClick={closeMenu} data-testid="link-education">Education</a>
            <a href="#experience" onClick={closeMenu} data-testid="link-experience">Experience</a>
            <a href="#work" onClick={closeMenu} data-testid="link-work">Work</a>
            <a href="#contact" onClick={closeMenu} data-testid="link-contact">Contact</a>
          </nav>
          <button className="mobile-menu" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" data-testid="button-toggle-menu">
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <div className="page-shell">
        {/* ================================ HERO SECTION ================================*/}
        <section className="hero" aria-labelledby="hero-title">
          <div>
            <div className="eyebrow">Welcome to My Portofolio</div>
            <h1 id="hero-title">Muhammad Zulfiansyah<br /><em>Bayu Pratama</em></h1>
            <p className="hero-copy">

              I am Zoel, a junior software engineer and Informatics Olympiad instructor with teaching experience across various schools and institutions.
            </p>
            <div className="hero-actions">
              <a href="#experience" className="primary-button" data-testid="link-explore-work">Explore the work <ArrowDownRight size={15} /></a>
              <a href="#contact" className="text-link" data-testid="link-start-conversation">Start a conversation <ArrowUpRight size={14} /></a>
            </div>
          </div>
          <figure className="hero-photo">
            <img src={heroPortrait} alt="Gambar Muhammad Zulfiansyah Bayu Pratama" />
            <figcaption>Fig. 01 — Muhammad Zulfiansyah Bayu Pratama</figcaption>
          </figure>
        </section>
        {/* ================================ END HERO SECTION ================================*/}

        {/* ================================ ABOUT SECTION  ================================*/}
        {/* <section className="section" id="about" aria-labelledby="about-title">
          <div className="section-heading">
            <div><h2 className="section-title" id="about-title">A mind for<br /><em>structure.</em></h2><p className="section-intro">The short version: I turn ambiguity into a sequence of precise questions, then enjoy answering each one.</p></div>
          </div>
          <div className="about-layout">
            <div className="about-portrait" aria-label="Abstract portrait of Elias Novak" data-testid="img-portrait">
              <div className="portrait-initial">e</div><div className="portrait-caption">field notes / 47°29′N</div>
            </div>
            <div className="about-copy">
              <p>Most of my days sit somewhere between a theorem and a terminal. I studied mathematics because proofs make the invisible visible; I compete because a two-second time limit is an excellent editor.</p>
              <p>My favorite work has a particular texture: a system with many moving parts, one conserved quantity, and a final solution that fits on a postcard. Outside contests, I write about algorithms, combinatorics, and the craft of thinking clearly.</p>
              <blockquote className="quote">“First understand what cannot change. Everything else is implementation detail.”<cite>— margin note, problem set 07</cite></blockquote>
            </div>
          </div>
        </section> */}
        {/* ================================ END ABOUT SECTION  ================================*/}

        <section className="section" id="education" aria-labelledby="education-title">
          <div className="section-heading">
            <div>
              <h2 className="section-title" id="education-title">#1 <em>Educational History</em></h2>
              <p className="section-intro">A brief overview of my educational background.</p>
            </div>
          </div>
          <div className="education-layout">
            <div>
              <div className="education-list">
                <div className="education-row">
                  <span className="education-year">2018 - 2021</span>
                  <div className="education-content">
                    <span className="education-name">SMA Unggulan CT ARSA Foundation Deli Serdang</span>
                    <span className="education-rank">Science Class</span>
                  </div>
                </div>
                <div className="education-row">
                  <span className="education-year">2021 - 2026</span>
                  <div className="education-content">
                    <span className="education-name">Bandung Institute of Technology</span>
                    <span className="education-rank">Informatics Engineering - School of Electrical & Informatics</span>
                  </div>
                </div>

              </div>
            </div>
            <div className="code-window" aria-label="A small algorithm sketch">
              <div className="code-head"><span>invariant.cpp</span><span>O(n log n)</span></div>
              <div className="code-body">
                <span className="code-line"><i className="line-no">01</i><span className="syntax-key">template</span> &lt;<span className="syntax-key">class</span> T&gt;</span>
                <span className="code-line"><i className="line-no">02</i>T <span className="syntax-fn">solve</span>(vector&lt;T&gt; a) {'{'}</span>
                <span className="code-line"><i className="line-no">03</i>  <span className="syntax-comment">// find what survives</span></span>
                <span className="code-line"><i className="line-no">04</i>  <span className="syntax-key">auto</span> invariant = <span className="syntax-fn">compress</span>(a);</span>
                <span className="code-line"><i className="line-no">05</i>  <span className="syntax-key">for</span> (<span className="syntax-key">auto</span>&amp; x : a)</span>
                <span className="code-line"><i className="line-no">06</i>    invariant ^= <span className="syntax-fn">delta</span>(x);</span>
                <span className="code-line"><i className="line-no">07</i>  <span className="syntax-key">return</span> invariant;</span>
                <span className="code-line"><i className="line-no">08</i>{'}'}</span>
                <span className="code-line"><i className="line-no">09</i><span className="syntax-comment">// accepted, naturally</span></span>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="experience" aria-labelledby="experience-title">
          <div className="section-heading">
            <div>
              <h2 className="section-title" id="experience-title">#2 <em>Work Experience</em></h2>
              <p className="section-intro">Two complementary paths: software engineering and teaching Informatics Olympiad students.</p>
            </div>
          </div>
          <div className="experience-controls">
            <label className="experience-search">
              <Search size={16} aria-hidden="true" />
              <Input
                type="search"
                className="experience-search-input"
                value={experienceSearch}
                onChange={(event) => {
                  setExperienceSearch(event.target.value);
                  setExperiencePage(1);
                }}
                placeholder="Search"
                aria-label="Search work experiences"
                data-testid="input-experience-search"
              />
            </label>
            <ToggleGroup
              type="single"
              value={activeExperienceCategory}
              variant="outline"
              aria-label="Filter experiences by category"
              className="experience-filters"
              onValueChange={(value) => {
                const category = experienceCategories.find(
                  (item) => item.id === value,
                );
                if (!category) return;
                setActiveExperienceCategory(category.id);
                setExperiencePage(1);
              }}
            >
              {experienceCategories.map((category) => (
                <ToggleGroupItem
                  key={category.id}
                  value={category.id}
                  className="experience-filter"
                  data-testid={`button-category-${category.id}`}
                >
                  {category.label}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          {visibleExperiences.length > 0 ? (
            <div className="experience-cards">
              {visibleExperiences.map((experience) => (
                <Card
                  className="experience-card"
                  key={experience.id}
                  role="article"
                  data-testid={`card-experience-${experience.id}`}
                >
                  <div className="experience-cover">
                    {experience.coverImage ? (
                      <img src={experience.coverImage} alt={`${experience.organization} cover`} />
                    ) : (
                      <span>IMAGE COVER</span>
                    )}
                  </div>
                  <CardContent className="experience-card-content">
                    <h3>{experience.organization}</h3>
                    <p className="experience-card-role">
                      {experience.role} ({experience.period})
                    </p>
                    <details className="experience-details">
                      <summary>→ Detail</summary>
                      <div className="experience-detail-content">
                        <p>{experience.location} · {experience.period}</p>
                        <ul>
                          {experience.descriptions.map((description, index) => (
                            <li key={`${experience.id}-description-${index}`}>{description}</li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="experience-empty" role="status" data-testid="text-no-experiences">
              No experiences found.
            </p>
          )}
          <div className="experience-pagination" aria-label="Experience pages">
            <Button
              variant="outline"
              className="experience-page-control"
              onClick={() => setExperiencePage((page) => Math.max(1, page - 1))}
              disabled={experiencePage === 1}
              data-testid="button-experience-previous"
            >
              Prev
            </Button>
            {Array.from({ length: experiencePageCount }, (_, index) => index + 1).map((page) => (
              <Button
                variant="outline"
                key={page}
                className={`experience-page-number ${experiencePage === page ? 'active' : ''}`}
                aria-current={experiencePage === page ? 'page' : undefined}
                onClick={() => setExperiencePage(page)}
                data-testid={`button-experience-page-${page}`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              className="experience-page-control"
              onClick={() => setExperiencePage((page) => Math.min(experiencePageCount, page + 1))}
              disabled={experiencePage === experiencePageCount}
              data-testid="button-experience-next"
            >
              Next
            </Button>
          </div>
        </section>

        <section className="section" id="work" aria-labelledby="work-title">
          <div className="section-heading">
            <div><h2 className="section-title" id="work-title">Selected<br /><em>constructions.</em></h2><p className="section-intro">Tools, essays, and experiments for people who enjoy looking one layer deeper.</p></div>
          </div>
          <div className="projects-grid">
            <a className="project-card featured" href="https://github.com" target="_blank" rel="noreferrer" data-testid="card-project-invariant">
              <div className="project-meta"><span>01 / open source</span><span>2024</span></div>
              <h3>Invariant<br />Atlas</h3>
              <p>A visual index of reusable ideas in algorithmic problem solving — from parity arguments to amortized potential.</p>
              <div className="project-foot"><span className="code-tag">React · WebGL · MathJax</span><span className="round-arrow"><ArrowUpRight size={16} /></span></div>
            </a>
            <a className="project-card" href="https://github.com" target="_blank" rel="noreferrer" data-testid="card-project-lattice">
              <div className="project-meta"><span>02 / research</span><span>2023</span></div><h3>Lattice walks<br />&amp; lazy bounds</h3><p>Notes on counting paths when the obvious recurrence is not enough.</p><div className="project-foot"><span className="code-tag">paper · 18 pages</span><span className="round-arrow"><ArrowUpRight size={16} /></span></div>
            </a>
            <a className="project-card" href="https://github.com" target="_blank" rel="noreferrer" data-testid="card-project-judge">
              <div className="project-meta"><span>03 / tool</span><span>2022</span></div><h3>Local Judge</h3><p>A quieter way to test the ideas before asking the compiler.</p><div className="project-foot"><span className="code-tag">Rust · CLI</span><span className="round-arrow"><ArrowUpRight size={16} /></span></div>
            </a>
          </div>
        </section>

        <section className="section" aria-labelledby="writing-title">
          <div className="section-heading">
            <div><h2 className="section-title" id="writing-title">Marginalia<br /><em>made public.</em></h2><p className="section-intro">Longer thoughts, written slowly. Click a title to read the working draft.</p></div>
          </div>
          <div className="writing-list">
            <a className="writing-row" href="#contact" data-testid="link-writing-pigeonhole"><span className="writing-year">Mar 2024</span><span className="writing-title">The pigeonhole principle has better taste than you think</span><span className="writing-kind">essay / 08 min</span><ArrowUpRight className="writing-arrow" size={17} /></a>
            <a className="writing-row" href="#contact" data-testid="link-writing-dp"><span className="writing-year">Nov 2023</span><span className="writing-title">Dynamic programming as a conversation with the future</span><span className="writing-kind">notes / 12 min</span><ArrowUpRight className="writing-arrow" size={17} /></a>
            <a className="writing-row" href="#contact" data-testid="link-writing-proof"><span className="writing-year">Jun 2023</span><span className="writing-title">Proofs that survive contact with a time limit</span><span className="writing-kind">essay / 06 min</span><ArrowUpRight className="writing-arrow" size={17} /></a>
          </div>
        </section>

        <section className="section contact-section" id="contact" aria-labelledby="contact-title">
          <div>
            <div className="section-heading"><h2 className="section-title" id="contact-title">Let’s find<br /><em>the next idea.</em></h2></div>
            <a href={`mailto:${email}`} className="contact-email" data-testid="link-email">{email}</a>
            <p className="contact-note">Have a problem worth worrying at, a paper to discuss, or a team that needs one more careful pair of eyes? I would like to hear about it.</p>
            <button type="button" className="text-link" onClick={copyEmail} data-testid="button-copy-email">{copied ? <><Check size={14} /> copied to clipboard</> : <><Copy size={14} /> copy email address</>}</button>
          </div>
          <form className="contact-form" onSubmit={submitContact} data-testid="form-contact">
            <label className="field"><span>Your name</span><input required name="name" placeholder="Ada, perhaps" data-testid="input-name" /></label>
            <label className="field"><span>Your email</span><input required type="email" name="email" placeholder="you@somewhere.org" data-testid="input-email" /></label>
            <label className="field"><span>A note</span><textarea required name="message" placeholder="Tell me what is on your mind." data-testid="input-message" /></label>
            <button className="primary-button" type="submit" data-testid="button-send-message">Send the note <ArrowUpRight size={15} /></button>
            {sent && <div className="form-status" role="status" data-testid="status-message">Draft prepared — please send via email to complete the conversation.</div>}
          </form>
        </section>

        <footer className="footer">
          <span className="footer-mark">∴ en</span>
          <span>Typeset with curiosity · Budapest, HU</span>
          <a className="back-top" href="#top" data-testid="link-back-top">Back to top ↑</a>
          <a href="https://github.com" aria-label="GitHub profile" data-testid="link-github"><Github size={17} /></a>
        </footer>
      </div>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;