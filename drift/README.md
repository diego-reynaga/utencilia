# Drift

Single-page landing site for **Drift**, a calm, ADHD-friendly planner.

React 18 · Vite · TypeScript · Tailwind CSS v3 · lucide-react · @react-three/fiber + @react-three/drei

## Getting started

```bash
npm install
npm run dev
```

- `npm run build` — type checks with `tsc -b`, then builds to `dist/`
- `npm run preview` — serve the production build

## The 3D hero model

The hero renders a GLB from the `public/` folder. `public/model.glb` is the canonical
filename — drop your own export there to swap the model.

`HeroModel` probes a short list of filenames (`/model.glb`, `/olla3D.glb`, `/scene.glb`)
with a `HEAD` request and uses the first one that is served as a real binary. Missing
files are not an error: a dev server answers unknown paths with an HTML fallback, so the
probe checks the `Content-Type` and skips anything that is a page rather than a model.

If no model is found — or the file is present but fails to parse — the hero shows a 🍳
placeholder and the rest of the page renders normally.

## Structure

| File | Purpose |
| --- | --- |
| `src/components/Navbar.tsx` | Floating pill nav with the morphing hamburger and dropdown |
| `src/components/HeroSection.tsx` | Full-viewport hero, 50/50 split |
| `src/components/HeroModel.tsx` | R3F canvas, model resolution, loading and error states |
| `src/components/AboutSection.tsx` | Cream section that overlaps the hero |
| `src/components/FeaturesSection.tsx` | Sticky column plus IntersectionObserver feature cards |
| `src/components/CtaBar.tsx` | Frosted "Start for free" bar shared by hero and features |
| `src/components/BrandMark.tsx` | Geometric logo used in About and each feature card |

## Palette

Exposed as Tailwind tokens under the `drift` key in `tailwind.config.js`.

| Token | Value | Used for |
| --- | --- | --- |
| `drift-sand` | `#F6E4CF` | About background |
| `drift-ink` | `#321C04` | Dark text and icons |
| `drift-cream` | `#FFF9F2` | Light button text |
| `drift-muted` | `#D9C4AA` | Divider, secondary button |
| `drift-muted-hover` | `#CEBA9E` | Secondary button hover |
| `drift-ink-hover` | `#1F1003` | Dark button hover |
