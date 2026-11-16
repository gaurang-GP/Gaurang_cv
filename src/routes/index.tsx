import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Download,
  ExternalLink,
  Send,
  FileText,
  Briefcase,
  GraduationCap,
  Sun,
  Moon,
  Menu,
  X,
  ArrowUp,
  Sparkles,
} from "lucide-react";
import { profile, resume, stats, skills, projects, timeline } from "@/components/portfolio/data";
import { isEmailJsConfigured, sendContactEmail } from "@/lib/send-contact-email";

const HeroScene = lazy(() => import("@/components/portfolio/HeroScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gaurang Parmar — Full Stack Developer (PHP, Laravel, React)" },
      { name: "description", content: "Portfolio of Gaurang Parmar, a full stack developer with 4+ years building SaaS, CRM and multi-tenant platforms with Laravel, React and Next.js." },
      { property: "og:title", content: "Gaurang Parmar — Full Stack Developer" },
      { property: "og:description", content: "Laravel, React and Next.js developer building scalable SaaS and CRM platforms." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = ["home", "about", "skills", "projects", "experience", "resume", "contact"];

function Index() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  // GSAP animations: hero intro, 3D scroll reveals, staggers, counters, parallax, timeline draw
  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        // Hero intro (plays once) — fromTo so content never stays hidden if a tween is interrupted
        gsap.fromTo(
          "[data-hero-item]",
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1, ease: "power3.out", delay: 0.9 },
        );
        gsap.fromTo(
          "[data-scene-inner]",
          { scale: 0.7, autoAlpha: 0 },
          { scale: 1, autoAlpha: 1, duration: 1.4, ease: "power3.out", delay: 1 },
        );
        // Gentle hero parallax on the outer wrapper only (no opacity, so the 3D never vanishes)
        gsap.to("[data-scene]", { yPercent: 15, ease: "none", scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: 0.5 } });
        // Section reveals: immediateRender false keeps nodes visible until ScrollTrigger fires
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 30, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.8,
              ease: "power2.out",
              immediateRender: false,
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            },
          );
        });
        gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((grid) => {
          gsap.fromTo(
            grid.children,
            { y: 40, autoAlpha: 0, rotateX: 12, transformPerspective: 1000 },
            {
              y: 0,
              autoAlpha: 1,
              rotateX: 0,
              duration: 0.7,
              stagger: 0.08,
              ease: "power2.out",
              clearProps: "transform",
              immediateRender: false,
              scrollTrigger: { trigger: grid, start: "top 92%", once: true },
            },
          );
        });
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset["count"]);
          const obj = { v: 0 };
          gsap.to(obj, { v: target, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 95%", once: true }, onUpdate: () => { el.textContent = Math.round(obj.v) + "+"; } });
        });
        gsap.from("[data-line]", { scaleY: 0, transformOrigin: "top", ease: "none", scrollTrigger: { trigger: "#experience", start: "top 70%", end: "bottom 80%", scrub: 0.5 } });
        gsap.to("[data-progress]", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
        // Opening the page on a #section: refresh positions after layout settles
        setTimeout(() => ScrollTrigger.refresh(), 1200);
      });
    })();
    return () => ctx?.revert();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-page-mesh">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_0%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_55%),radial-gradient(ellipse_50%_35%_at_0%_100%,color-mix(in_oklab,var(--primary-glow)_14%,transparent),transparent_50%)]" />
      <Loader show={loading} />
      <div data-progress aria-hidden className="bg-gradient-primary fixed inset-x-0 top-0 z-[60] h-1 origin-left scale-x-0" />
      <Cursor />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Loader({ show }: { show: boolean }) {
  return (
    <div aria-hidden className={`fixed inset-0 z-[100] grid place-items-center bg-background transition-opacity duration-500 ${show ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-primary" />
        <p className="font-display text-2xl font-bold tracking-tight">
          G<span className="text-primary">P</span>.
        </p>
        <p className="text-sm font-medium text-muted-foreground">{profile.name}</p>
      </div>
    </div>
  );
}

function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const move = (e: MouseEvent) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={ref} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[90] hidden h-6 w-6 rounded-full border-2 border-primary/50 transition-transform duration-150 ease-out md:block" />;
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const d = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);
  const toggle = () => {
    const d = !dark;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    localStorage.setItem("theme", d ? "dark" : "light");
  };
  return (
    <button onClick={toggle} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} className="glass grid h-10 w-10 place-items-center rounded-full text-foreground transition hover:text-primary">
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      let cur = "home";
      for (const id of NAV) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 140) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 px-4 transition-all ${scrolled ? "py-2" : "py-4"}`}>
      <nav
        className={`glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-border/60 px-4 py-2.5 shadow-soft transition-shadow ${scrolled ? "shadow-glow" : ""}`}
        aria-label="Main"
      >
        <a href="#home" className="font-display inline-flex items-center text-xl font-bold leading-none tracking-tight">
          G<span className="text-primary">P</span>.
        </a>
        <ul className="hidden gap-0.5 lg:flex">
          {NAV.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`rounded-full px-3.5 py-2 text-sm font-medium capitalize transition-all ${active === id ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:bg-accent/80 hover:text-foreground"}`}
              >
                {id}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#contact"
            className="bg-gradient-primary hidden rounded-full px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 md:inline-flex"
          >
            Hire me
          </a>
          <button
            type="button"
            className="glass grid h-10 w-10 place-items-center rounded-full text-foreground lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="glass fixed inset-x-4 top-[4.5rem] z-40 rounded-2xl border border-border/60 p-4 shadow-soft lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold capitalize ${active === id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-accent"}`}
                >
                  {id}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

function Typing() {
  const [text, setText] = useState("");
  useEffect(() => {
    let i = 0, j = 0, del = false;
    const tick = () => {
      const word = profile.roles[i] ?? "";
      j += del ? -1 : 1;
      setText(word.slice(0, j));
      let wait = del ? 40 : 80;
      if (!del && j === word.length) { del = true; wait = 1500; }
      else if (del && j === 0) { del = false; i = (i + 1) % profile.roles.length; wait = 300; }
      t = setTimeout(tick, wait);
    };
    let t = setTimeout(tick, 900);
    return () => clearTimeout(t);
  }, []);
  return <span className="text-gradient">{text}<span className="animate-blink text-primary">|</span></span>;
}

function Button({ href, children, variant = "primary", download }: { href: string; children: ReactNode; variant?: "primary" | "ghost"; download?: boolean | string }) {
  const cls = variant === "primary"
    ? "bg-gradient-primary text-primary-foreground shadow-glow"
    : "glass text-foreground";
  const ref = useRef<HTMLAnchorElement>(null);
  const onMove = async (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const { gsap } = await import("gsap");
    const r = el.getBoundingClientRect();
    gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.4, ease: "power3.out" });
  };
  const onLeave = async () => {
    const { gsap } = await import("gsap");
    gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };
  return (
    <a ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} href={href} download={download || undefined} target={download && href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${cls}`}>
      {children}
    </a>
  );
}

function Hero() {
  const [first, ...rest] = profile.name.split(" ");
  return (
    <section id="home" className="relative flex min-h-screen items-center pt-28 pb-16">
      <div aria-hidden className="absolute -left-32 top-24 h-[28rem] w-[28rem] rounded-full bg-primary/12 blur-[100px]" />
      <div aria-hidden className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-primary-glow/20 blur-[90px]" />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p
            data-hero-item
            className="glass-card mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground"
          >
            <Sparkles className="h-4 w-4 text-primary" aria-hidden />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            Available for new opportunities
          </p>
          <h1 data-hero-item className="text-[clamp(2.5rem,6vw,3.75rem)] font-extrabold leading-[1.08] tracking-tight">
            Hi, I&apos;m {first}
            <br />
            <span className="text-gradient">{rest.join(" ")}.</span>
          </h1>
          <p data-hero-item className="mt-5 h-10 text-2xl font-semibold md:h-11 md:text-3xl">
            <Typing />
          </p>
          <p data-hero-item className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            I craft scalable SaaS platforms, CRMs and APIs with Laravel, React and Next.js — focused on clean architecture,
            security, and shipping products that scale.
          </p>
          <div data-hero-item className="mt-10 flex flex-wrap gap-3">
            <Button href={resume.url} download={resume.filename}>
              <Download className="h-4 w-4" /> Download Resume
            </Button>
            <Button href="#contact" variant="ghost">
              <Mail className="h-4 w-4" /> Contact Me
            </Button>
          </div>
          <div data-hero-item className="mt-10 flex flex-wrap gap-6 border-t border-border/60 pt-8">
            {stats.slice(0, 3).map((s) => (
              <div key={s.label}>
                <p className="font-display text-2xl font-bold text-gradient">{s.value}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[360px] md:h-[480px]" data-scene>
          <ClientOnly fallback={null}>
            <div data-scene-inner className="h-full w-full">
              <Suspense fallback={null}>
                <HeroScene />
              </Suspense>
            </div>
          </ClientOnly>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div data-reveal className="mb-14 text-center">
      <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
        <span className="h-px w-8 bg-gradient-primary" aria-hidden />
        {eyebrow}
        <span className="h-px w-8 bg-gradient-primary" aria-hidden />
      </p>
      <h2 className="mt-4 text-3xl font-bold md:text-4xl">{title}</h2>
      {desc && <p className="mx-auto mt-3 max-w-xl text-muted-foreground">{desc}</p>}
    </div>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24">
      <SectionTitle eyebrow="About me" title="Engineer with a product mindset" />
      <div className="grid items-center gap-12 md:grid-cols-[320px_1fr]">
        <div data-reveal className="animate-float mx-auto">
          {/* Replace with your photo: drop image in /public and use <img src="..." /> */}
          <div className="relative grid h-72 w-72 place-items-center rounded-[2rem] p-[2px] shadow-glow" style={{ background: "var(--gradient-primary)" }}>
            <div className="glass-card grid h-full w-full place-items-center overflow-hidden rounded-[calc(2rem-2px)] bg-card">
              <span className="font-display text-7xl font-bold text-gradient" role="img" aria-label="Photo placeholder for Gaurang Parmar">
                GP
              </span>
            </div>
            <div className="glass absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 text-xs font-semibold text-foreground">
              4+ yrs · Full Stack
            </div>
          </div>
        </div>
        <div data-reveal>
          <p className="text-lg leading-relaxed text-muted-foreground">{profile.summary}</p>
          <p className="mt-4 flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4 text-primary" /> {profile.location}</p>
          <div data-stagger className="mt-8 grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-5 text-center">
                <div className="font-display text-3xl font-bold text-gradient" data-count={parseInt(s.value)}>{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="border-y border-border/50 bg-muted/40 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionTitle eyebrow="Skills" title="My toolkit" desc="Backend depth, modern frontends, and the integrations that connect them." />
        <div data-stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((g) => (
            <div
              key={g.group}
              className="glass-card group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-glow"
            >
              <div className="mb-4 h-1 w-10 rounded-full bg-gradient-primary transition-all group-hover:w-14" />
              <h3 className="text-lg font-semibold">{g.group}</h3>
              <div className="flex flex-wrap gap-2">
                {g.items.map((i) => <span key={i} className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">{i}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="glass-card h-full overflow-hidden rounded-2xl transition-transform duration-200 ease-out"
    >
      {children}
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-5 py-24">
      <SectionTitle eyebrow="Projects" title="Selected work" desc="SaaS, CRM, and API platforms built for real users and production load." />
      <div data-stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, idx) => (
          <div key={p.title} className={idx === 0 ? "sm:col-span-2 lg:col-span-2" : ""}>
            <TiltCard>
              {/* Replace with a project screenshot */}
              <div
                className={`relative grid place-items-center overflow-hidden bg-gradient-primary ${idx === 0 ? "h-52" : "h-40"}`}
                role="img"
                aria-label={`${p.title} preview`}
              >
                <div aria-hidden className="absolute inset-0 bg-[linear-gradient(135deg,transparent_40%,oklch(1_0_0/0.12)_50%,transparent_60%)]" />
                <span className="font-display text-5xl font-bold text-primary-foreground/85 drop-shadow-sm">
                  {String(idx + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col p-6">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">{p.tags.map((t) => <span key={t} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">{t}</span>)}</div>
                <div className="mt-5 flex gap-4 text-sm font-semibold">
                  <a href={p.github} className="inline-flex items-center gap-1 text-foreground hover:text-primary"><Github className="h-4 w-4" /> Code</a>
                  <a href={p.live} className="inline-flex items-center gap-1 text-primary hover:underline"><ExternalLink className="h-4 w-4" /> Live Demo</a>
                </div>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section id="experience" className="bg-muted/50 py-24">
      <div className="mx-auto max-w-3xl px-5">
        <SectionTitle eyebrow="Journey" title="Experience & Education" />
        <ol className="relative pl-8">
          <span data-line aria-hidden className="bg-gradient-primary absolute left-0 top-0 h-full w-0.5" />
          {timeline.map((t) => {
            const Icon = t.kind === "Education" ? GraduationCap : Briefcase;
            return (
              <li key={t.org} data-reveal className="relative mb-10 last:mb-0">
                <span className="absolute -left-[3.05rem] grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow"><Icon className="h-4 w-4" /></span>
                <div className="glass rounded-2xl p-6">
                  <p className="text-sm font-semibold text-primary">{t.period}</p>
                  <h3 className="mt-1 text-lg font-semibold">{t.title}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{t.org}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{t.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Resume() {
  return (
    <section id="resume" className="mx-auto max-w-5xl px-5 py-24">
      <SectionTitle eyebrow="Resume" title="My CV at a glance" />
      <div data-reveal className="glass grid gap-8 rounded-3xl p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="flex items-center gap-3"><FileText className="h-8 w-8 text-primary" /><div><h3 className="text-xl font-semibold">{profile.name}</h3><p className="text-sm text-muted-foreground">Software Engineer · PHP · Laravel · React · Next.js</p></div></div>
          <div className="mt-6 grid gap-4 text-sm sm:grid-cols-3">
            <div><p className="font-semibold">Experience</p><p className="text-muted-foreground">4+ years across 3 companies</p></div>
            <div><p className="font-semibold">Education</p><p className="text-muted-foreground">MCA, GTU (2015–2017)</p></div>
            <div><p className="font-semibold">Languages</p><p className="text-muted-foreground">English, Hindi, Gujarati</p></div>
          </div>
        </div>
        <Button href={resume.url} download={resume.filename}><Download className="h-4 w-4" /> Download PDF</Button>
      </div>
    </section>
  );
}

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(1, "Please write a message").max(1000),
});

function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [formNotice, setFormNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const emailJsReady = isEmailJsConfigured();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormNotice(null);
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    const r = contactSchema.safeParse(fd);
    if (!r.success) {
      setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
      return;
    }
    setErrors({});

    if (!emailJsReady) {
      const body = encodeURIComponent(`${r.data.message}\n\n— ${r.data.name} (${r.data.email})`);
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("Portfolio enquiry from " + r.data.name)}&body=${body}`;
      return;
    }

    setSending(true);
    try {
      await sendContactEmail(r.data);
      formRef.current?.reset();
      setFormNotice({ type: "success", text: "Thanks! Your message was sent. I'll get back to you soon." });
    } catch (err) {
      console.error(err);
      setFormNotice({
        type: "error",
        text: err instanceof Error ? err.message : "Could not send your message. Please try again or email me directly.",
      });
    } finally {
      setSending(false);
    }
  };
  const field = "w-full rounded-xl border border-input bg-card px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30";
  return (
    <section id="contact" className="bg-muted/50 py-24">
      <div className="mx-auto max-w-6xl px-5">
        <SectionTitle eyebrow="Contact" title="Let's build something together" />
        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <div data-reveal className="space-y-4">
            {[
              { icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
              { icon: Phone, label: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` },
              { icon: MapPin, label: profile.location, href: undefined },
            ].map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} className="glass flex items-center gap-4 rounded-2xl p-5 transition-transform hover:-translate-y-0.5">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-primary"><Icon className="h-5 w-5" /></span>
                <span className="font-medium">{label}</span>
              </a>
            ))}
            <Socials />
          </div>
          <form ref={formRef} data-reveal onSubmit={onSubmit} noValidate className="glass space-y-4 rounded-3xl p-8">
            {(["name", "email"] as const).map((n) => (
              <div key={n}>
                <label htmlFor={n} className="mb-1 block text-sm font-medium capitalize">{n}</label>
                <input id={n} name={n} type={n === "email" ? "email" : "text"} maxLength={n === "email" ? 255 : 100} disabled={sending} className={field} />
                {errors[n] && <p className="mt-1 text-sm text-destructive">{errors[n]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium">Message</label>
              <textarea id="message" name="message" rows={5} maxLength={1000} disabled={sending} className={field} />
              {errors["message"] && <p className="mt-1 text-sm text-destructive">{errors["message"]}</p>}
            </div>
            {formNotice && (
              <p role="status" className={`rounded-xl px-4 py-3 text-sm ${formNotice.type === "success" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                {formNotice.text}
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="bg-gradient-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" /> {sending ? "Sending…" : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Socials() {
  const items = [
    { icon: Github, href: profile.github, label: "GitHub" },
    { icon: Linkedin, href: profile.linkedin, label: "LinkedIn" },
    { icon: Mail, href: `mailto:${profile.email}`, label: "Email" },
  ];
  return (
    <div className="flex gap-3">
      {items.map(({ icon: Icon, href, label }) => (
        <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="glass grid h-11 w-11 place-items-center rounded-full text-foreground transition hover:-translate-y-0.5 hover:text-primary"><Icon className="h-5 w-5" /></a>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-border/60 bg-muted/30 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-5 md:flex-row">
        <div className="text-center md:text-left">
          <p className="font-display text-lg font-bold">
            G<span className="text-gradient">P</span>.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            © {new Date().getFullYear()} {profile.name}. Crafted with Laravel, React & care.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Socials />
          <a
            href="#home"
            className="glass grid h-11 w-11 place-items-center rounded-full text-foreground transition hover:-translate-y-0.5 hover:text-primary"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
