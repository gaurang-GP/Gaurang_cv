# Gaurang Parmar — Developer Portfolio

A light-mode, premium single-page portfolio built from the uploaded CV, inside this app (React + Three.js instead of a single HTML file, since the project is a live web app you can publish).

## Content (from CV)
- Hero: "Gaurang Parmar", typing roles (Full Stack Developer, Laravel Specialist, PHP Developer, React / Next.js Developer), Download Resume + Contact Me, interactive 3D floating shapes reacting to the mouse.
- About: summary, photo placeholder, stats (4+ years, 7+ projects, 20+ technologies), Vadodara, Gujarat.
- Skills: grouped cards — Backend, Frontend, Database, Security, Integrations, Tools & AI.
- Projects: 6 tilt cards — Project Management System, Align Pro CRM, Driveo, Hospital Management, Blaxity, Surya Namaskar (with tech tags, placeholder GitHub/Live links).
- Experience & Education timeline: Consumer Sketch, iCoderz, Webcreta, MCA (GTU 2015–2017).
- Resume: styled preview + Download PDF (your uploaded CV hosted with the site).
- Contact: name/email/message form with validation (opens your email app to send), email, phone, LinkedIn/GitHub icons.
- Footer with copyright and socials.

## Design
- Off-white background, single indigo-blue accent, glass cards, soft shadows, rounded corners, distinctive font pair (Sora + Manrope).
- Sticky navbar with active-section highlight, smooth scroll, page loader, fade/slide-up reveals, hover effects, subtle custom cursor on desktop. Fully responsive.

## Technical details
- Rewrite `src/routes/index.tsx` with sections as components under `src/components/portfolio/`.
- Three.js via @react-three/fiber + drei, rendered client-only; GSAP + ScrollTrigger for reveals.
- CV uploaded as a hosted asset for the download link.
- SEO head tags on the index route; tokens in `src/styles.css`.

## Needs from you (placeholders until then)
- GitHub and LinkedIn URLs, a profile photo, project demo links.
