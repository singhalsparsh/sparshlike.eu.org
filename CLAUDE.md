# AURA Portfolio

Premium 3D-driven developer portfolio website for Sparsh Singhal.

## Tech Stack

- **Runtime:** Next.js 14.2.15 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v3
- **Animation:** GSAP 3 + ScrollTrigger
- **Smooth Scroll:** @studio-freight/lenis
- **3D:** @react-three/fiber + @react-three/drei, three
- **Motion UI:** framer-motion v11
- **Primitives:** @radix-ui/react-navigation-menu, @radix-ui/react-dialog
- **Utilities:** clsx, class-variance-authority, lucide-react, tailwind-merge
- **Deploy:** Netlify with @netlify/plugin-nextjs

## Project Structure

```
portfolio-site/
  app/
    layout.tsx          Root layout with AnnouncementBar, Nav, ScrollScene
    page.tsx            Home page with all sections
    globals.css         Global styles, CSS variables, helpers
    projects/page.tsx   Projects listing page
    blog/page.tsx       Blog listing page
    contact/page.tsx    Contact page
  components/
    AnnouncementBar.tsx    Top bar rotating 3 messages (4.2s interval)
    Nav.tsx                Fixed navigation with links + Hire Me CTA
    Floating3D.tsx         3D abstract geometric element (torus knot + orbiting shapes)
    ScrollScene.tsx        Pinned canvas + GSAP ScrollTrigger choreography
    sections/
      Hero.tsx             Full-screen hero with code decoration
      About.tsx            Bio, highlights, stats cards
      Skills.tsx           Hairline-divided rows with skill bars
      Projects.tsx         3-column grid + modal + marquee logo strip
      Testimonials.tsx     3-column quote cards
      Contact.tsx          Split layout: info + form
      Footer.tsx           Links, copyright, back to top
    ui/
      liquid-glass-card.tsx    Core glass surface component
      glass-button.tsx         CTA button with variants
      animated-shiny-text.tsx  Shimmer text animation
      dot-pattern.tsx          Background dot grid pattern
      glow.tsx                 Soft glow effect
      navigation-menu.tsx      Radix-based nav menu
  lib/
    utils.ts             cn() helper, formatDate
```

## Key Conventions

- Liquid glass surfaces use `LiquidGlassCard` component exclusively
- CTAs use `GlassButton` with `primary`, `ghost`, or `gradient` variants
- All ScrollTrigger transitions use `overwrite: true`
- Always-on ambient spin via `useFrame` in Floating3D
- Hero 3D element has NO scroll trigger; first ScrollTrigger targets `#about`
- No em dashes anywhere; use commas, periods, or rewrite
- Layout components: AnnouncementBar (z-50 top-0), Nav (z-40 top-12), ScrollScene (z-10 fixed)

## Build

```bash
npm run dev    # Development server
npm run build  # Production build
npm run start  # Start production server
```

## Scroll Choreography (ScrollScene)

| Trigger | Pose | Effect |
|---------|------|--------|
| #hero | HERO_POSE | Default position, no trigger |
| #about | x:-2, scale:1.2 | Move left, enlarge |
| #skills | x:1.5, scale:0.9 | Move right, shrink |
| #projects | y:1, scale:1.1 | Move down, enlarge |
| #testimonials | - | Fade opacity to 0 on enter, back to 1 on leaveBack |
