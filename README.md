# Gaurang Parmar — Developer Portfolio

Personal portfolio site for **Gaurang Parmar**, a full stack developer focused on Laravel, PHP, React, and Next.js. Showcases experience, skills, projects, resume download, and contact.

| | |
| --- | --- |
| **Live site** | [gaurang-cv.vercel.app](https://gaurang-cv.vercel.app) |
| **Repository** | [github.com/gaurang-GP/Gaurang_cv](https://github.com/gaurang-GP/Gaurang_cv) |

## Features

- Single-page layout with smooth in-page navigation (home, about, skills, projects, experience, resume, contact)
- Light / dark theme with persisted preference
- GSAP scroll animations and animated stats
- Interactive 3D hero scene ([React Three Fiber](https://docs.pmnd.rs/react-three-fiber))
- Glass-style UI, responsive layout, and mobile navigation
- Contact form via [EmailJS](https://www.emailjs.com/) (optional); falls back to `mailto:` when not configured
- PDF resume served from `/public`

## Tech stack

- [TanStack Start](https://tanstack.com/start) & [TanStack Router](https://tanstack.com/router)
- React 19, TypeScript, Vite
- Tailwind CSS v4
- GSAP, Three.js / `@react-three/fiber`
- EmailJS (browser contact delivery)
- Built and iterated with [Lovable](https://lovable.dev)

## Local development

Requirements: **Node.js** 18+ and **npm** (or use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
git clone https://github.com/gaurang-GP/Gaurang_cv.git
cd Gaurang_cv
npm install
npm run dev
```

The dev server prints the local URL (often `http://localhost:8080`).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest tests |

### Contact form (optional)

Copy `.env.example` to `.env` and set your EmailJS `VITE_*` values, or add the same keys in Lovable → Secrets. Without them, the contact form opens the visitor’s email client instead.

### Updating content

Portfolio copy, projects, skills, and timeline live in **`src/components/portfolio/data.ts`**.  
Place your resume PDF in **`public/`** and keep `resume.url` in `data.ts` in sync (e.g. `/GaurangParmar_CV.pdf`).

## Author

**Gaurang Parmar** — Vadodara, Gujarat, India  
[gaurangp830@gmail.com](mailto:gaurangp830@gmail.com)

## License

Private portfolio project. All rights reserved unless otherwise noted.