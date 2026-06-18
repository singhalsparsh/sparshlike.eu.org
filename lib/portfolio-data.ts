export interface Project {
  title: string;
  tagline: string;
  description: string;
  longDescription?: string;
  tech: string[];
  category: 'Web' | '3D' | 'Backend' | 'Full Stack';
  color: string;
  screenshots: string[];
  liveUrl: string;
  githubUrl: string;
  featured?: boolean;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
}

export interface TimelineItem {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface EducationItem {
  degree: string;
  school: string;
  year: string;
  description: string;
}

// ============ PROJECTS ============
export const allProjects: Project[] = [
  {
    title: 'Keythm',
    tagline: 'Typing Test with Mechanical Audio',
    description:
      'A premium typing test app with per-key mechanical audio feedback, 4 test modes, statistical anti-cheat, and full offline PWA support.',
    longDescription:
      'Keythm redefines the typing test experience by combining precision measurement with the satisfying acoustics of mechanical keyboards. Built with the Web Audio API for real-time sound synthesis, it includes 4 distinct test modes (timed, words, code, custom), statistical analysis to detect anomalies, and a full offline PWA that works without an internet connection. The UI is crafted with premium glassmorphism and responsive design.',
    tech: ['Next.js', 'TypeScript', 'Web Audio API', 'PWA', 'Tailwind CSS'],
    category: 'Web',
    color: 'from-emerald-500 to-teal-500',
    screenshots: ['/assets/keythm-1.jpg', '/assets/keythm-2.jpg'],
    liveUrl: 'https://keythm.app',
    githubUrl: 'https://github.com/sparsh/keythm',
    featured: true,
  },
  {
    title: 'NeuralStudio',
    tagline: 'Visual Deep Learning Studio',
    description:
      'Drag-and-drop neural network designer with TensorFlow.js integration, real-time training, and one-click API deployment.',
    longDescription:
      'NeuralStudio makes deep learning accessible through an intuitive visual interface. Drag and connect layers to build neural networks, train them in-browser using TensorFlow.js with real-time loss visualization, and deploy trained models as APIs with a single click. Supports CNN, RNN, transformer architectures, and includes a library of pre-built models for transfer learning.',
    tech: ['React', 'TensorFlow.js', 'XYFlow', 'Express', 'Python'],
    category: 'Full Stack',
    color: 'from-teal-500 to-cyan-500',
    screenshots: ['/assets/neural-1.jpg', '/assets/neural-2.jpg'],
    liveUrl: 'https://neuralstudio.dev',
    githubUrl: 'https://github.com/sparsh/neuralstudio',
    featured: true,
  },
  {
    title: 'Liquid Glass Portfolio',
    tagline: 'Premium 3D Portfolio Website',
    description:
      'Cutting-edge portfolio with glassmorphism, interactive 3D, GSAP scroll animations, and dynamic color theming.',
    longDescription:
      'This very portfolio showcases the pinnacle of modern web development. Features include a 3D laptop model built with Three.js that responds to scroll position, a liquid glass design system with dynamic cursor-follow effects, 5 color themes, dark/light mode, smooth Lenis scrolling, and GSAP-powered scroll choreography. Every surface uses the signature liquid glass aesthetic.',
    tech: ['Three.js', 'GSAP', 'Tailwind CSS', 'Framer Motion', 'Next.js'],
    category: '3D',
    color: 'from-emerald-400 to-green-500',
    screenshots: ['/assets/portfolio-1.jpg', '/assets/portfolio-2.jpg'],
    liveUrl: 'https://sparshlike.eu.org',
    githubUrl: 'https://github.com/singhalsparsh/portfolio',
    featured: true,
  },
  {
    title: 'CloudWatch API',
    tagline: 'Real-time Server Monitoring',
    description:
      'Distributed monitoring system with real-time dashboards, alerting, and auto-scaling based on custom metrics.',
    longDescription:
      'A full-stack monitoring solution that collects metrics from distributed servers, visualizes them in real-time dashboards, triggers alerts based on configurable thresholds, and automatically scales infrastructure. Built with a microservices architecture using Go for the collection layer and Node.js for the API gateway.',
    tech: ['Go', 'Node.js', 'Docker', 'AWS', 'Redis'],
    category: 'Backend',
    color: 'from-blue-500 to-indigo-500',
    screenshots: ['/assets/cloudwatch-1.jpg', '/assets/cloudwatch-2.jpg'],
    liveUrl: 'https://cloudwatch.example.com',
    githubUrl: 'https://github.com/sparsh/cloudwatch',
    featured: false,
  },
  {
    title: 'VoxelForge',
    tagline: 'Browser-based 3D Voxel Editor',
    description:
      'In-browser voxel editor with real-time rendering, export to GLTF/OBJ, and collaborative editing via WebSockets.',
    longDescription:
      'A browser-based voxel editor inspired by tools like MagicaVoxel. Features include real-time 3D rendering with Three.js, a palette system with unlimited colors, layer management, export to industry-standard formats (GLTF, OBJ, VOX), and collaborative editing through WebSocket connections. Built with a focus on performance and an intuitive UX.',
    tech: ['Three.js', 'WebSockets', 'TypeScript', 'React', 'Node.js'],
    category: '3D',
    color: 'from-purple-500 to-pink-500',
    screenshots: ['/assets/voxelforge-1.jpg', '/assets/voxelforge-2.jpg'],
    liveUrl: 'https://voxelforge.dev',
    githubUrl: 'https://github.com/sparsh/voxelforge',
    featured: false,
  },
  {
    title: 'GraphQL Mesh',
    tagline: 'Unified API Gateway',
    description:
      'GraphQL gateway that federates multiple REST and GraphQL APIs into a single unified endpoint with caching.',
    longDescription:
      'A GraphQL gateway that intelligently federates multiple backend services into one unified GraphQL endpoint. Supports REST and GraphQL sources, automatic schema stitching, response caching with Redis, rate limiting, and detailed query analytics. Built for microservices architectures where clients need a single consistent data layer.',
    tech: ['GraphQL', 'Node.js', 'Redis', 'Docker', 'TypeScript'],
    category: 'Backend',
    color: 'from-pink-500 to-rose-500',
    screenshots: ['/assets/graphql-mesh-1.jpg', '/assets/graphql-mesh-2.jpg'],
    liveUrl: 'https://graphql-mesh.example.com',
    githubUrl: 'https://github.com/sparsh/graphql-mesh',
    featured: false,
  },
];

// ============ BLOG POSTS ============
export const blogPosts: BlogPost[] = [
  {
    slug: 'building-3d-portfolio-threejs',
    title: 'Building a 3D Portfolio with Three.js',
    excerpt:
      'A complete guide to integrating Three.js with Next.js 14. Learn how to create interactive 3D scenes that perform well and integrate seamlessly with React components.',
    content: `Building a 3D portfolio is one of the most rewarding projects a developer can take on. It combines technical skill with creative expression, and the result is a living, breathing representation of your abilities.

In this guide, I will walk through the process of integrating Three.js with Next.js 14 App Router, covering:

## Setup and Configuration

First, install the dependencies:
\`\`\`bash
npm install three @react-three/fiber @react-three/drei
\`\`\`

Create a canvas component that will host your 3D scene. Use the \`floating-canvas\` pattern where the 3D scene sits behind your UI content with proper z-index layering.

## Building the 3D Scene

Start with simple geometries and build up. A laptop model made from primitives (boxes, rounded boxes, planes) can look remarkably convincing with the right materials and lighting.

Key techniques:
- Use \`MeshPhysicalMaterial\` for realistic glass and metal
- Layer emissive materials for screen glow
- Animate with \`useFrame\` for continuous motion
- Use \`PresentationControls\` for drag interaction

## Performance Optimization

- Use \`AdaptiveDpr\` to scale resolution based on device
- Keep geometry count low (under 100 meshes)
- Use instancing for repeated objects
- Limit \`dpr\` to 1.5 max on mobile

The result is a performant, interactive 3D experience that enhances your portfolio without overwhelming it.`,
    date: 'June 5, 2026',
    readTime: '8 min read',
    tags: ['Three.js', 'Next.js', '3D Web'],
  },
  {
    slug: 'mastering-tailwind-css',
    title: 'Mastering Tailwind CSS in 2025',
    excerpt:
      'Advanced Tailwind CSS techniques including custom design systems, dynamic theming with CSS variables, and performance optimization strategies.',
    content: `Tailwind CSS has evolved far beyond utility classes. In 2025, it is a complete design system framework that can power anything from landing pages to complex dashboards.

## Custom Design Systems

The key to a professional Tailwind setup is a well-structured design system:

\`\`\`css
:root {
  --brand-hue: 165;
  --brand-400: var(--brand-hue) 75% 50%;
}
\`\`\`

By using CSS custom properties for your brand values, you can create dynamic theming that swaps in seconds.

## Dynamic Theming

Extend Tailwind with color themes using data attributes:

\`\`\`css
[data-color-theme='emerald'] { --brand-hue: 165; }
[data-color-theme='rose'] { --brand-hue: 340; }
[data-color-theme='amber'] { --brand-hue: 32; }
\`\`\`

This allows instant theme switching without recompiling CSS.

## Performance Tips

- Use \`@apply\` sparingly (prefer utility classes in JSX)
- Purge unused styles with Tailwind's built-in tree-shaking
- Use \`content\` configuration to specify exact file paths
- Consider using \`tailwind-merge\` for conditional class merging

Tailwind CSS, when used with a well-planned design system, produces consistent, maintainable, and beautiful UIs.`,
    date: 'May 22, 2026',
    readTime: '6 min read',
    tags: ['CSS', 'Tailwind', 'UI Design'],
  },
  {
    slug: 'why-typescript-non-negotiable',
    title: 'Why TypeScript is Non-Negotiable in 2025',
    excerpt:
      'TypeScript has become the standard for serious web development. Here is why it should be your default choice for any project.',
    content: `In 2025, starting a non-trivial JavaScript project without TypeScript is borderline irresponsible. Here is why.

## Type Safety Saves Time

The argument that TypeScript "slows you down" is demonstrably false for any project over a few hundred lines. Catch bugs at compile time, not in production:

\`\`\`typescript
interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

function sendEmail(user: User) {
  // TypeScript ensures user.email exists at compile time
}
\`\`\`

## Better Developer Experience

- Auto-completion that actually works
- Refactoring with confidence
- Documentation that never goes out of date
- Faster onboarding for new team members

## Advanced Patterns

Use discriminated unions for state management:

\`\`\`typescript
type Result<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }
  | { status: 'loading' };
\`\`\`

This pattern makes impossible states impossible and eliminates entire categories of bugs.

TypeScript is not optional anymore. It is the baseline for professional web development.`,
    date: 'April 25, 2026',
    readTime: '7 min read',
    tags: ['TypeScript', 'React', 'Architecture'],
  },
  {
    slug: 'future-web-animations',
    title: 'The Future of Web Animations',
    excerpt:
      'Exploring the landscape of web animation in 2025: from GSAP and Framer Motion to the View Transition API and beyond.',
    content: `Web animations have entered a golden age. With modern APIs and libraries, what was once impossible in the browser is now not only possible but performant.

## The Current Landscape

Three major players dominate:

**GSAP** remains the gold standard for scroll-driven choreography. Its ScrollTrigger plugin provides precise control over timeline-based animations tied to scroll position.

**Framer Motion** excels in React ecosystems with declarative gesture-based animations, layout animations, and shared layout transitions.

**CSS Animations** have matured significantly with the View Transition API enabling native page transitions.

## Scroll-Driven Animation Pattern

The key to great scroll animation is using callback-based triggers rather than scrub:

\`\`\`typescript
ScrollTrigger.create({
  trigger: '#section',
  start: 'top center',
  onEnter: () => {
    gsap.to(element, {
      opacity: 0.5,
      duration: 0.8,
      overwrite: true,
    });
  },
});
\`\`\`

This pattern gives you full control over timing and avoids the performance pitfalls of continuous scrub updates.

## Performance Considerations

- Always use \`will-change\` on animated elements
- Prefer transforms (translate, scale, rotate) over layout-triggering properties
- Use \`content-visibility: auto\` for off-screen sections
- Debounce scroll handlers, or better, use ScrollTrigger which does this for you

The future of web animation is about meaningful motion that enhances user experience without sacrificing performance.`,
    date: 'April 10, 2026',
    readTime: '9 min read',
    tags: ['Animation', 'GSAP', 'Framer Motion'],
  },
];

// ============ TIMELINE ============
export const timeline: TimelineItem[] = [
  {
    role: 'Senior Full Stack Developer',
    company: 'TechVentures Inc.',
    period: '2022 - Present',
    description:
      'Architecting and building premium web applications for Fortune 500 clients. Leading a team of 5 developers, implementing CI/CD pipelines, and introducing 3D web experiences that increased client engagement by 40%.',
  },
  {
    role: 'Full Stack Developer',
    company: 'StartupHub',
    period: '2020 - 2022',
    description:
      'Built the core platform from the ground up using React, Node.js, and PostgreSQL. Designed the API architecture, implemented real-time features with WebSockets, and reduced page load times by 60% through aggressive optimization.',
  },
  {
    role: 'Junior Developer',
    company: 'WebAgency Co.',
    period: '2018 - 2020',
    description:
      'Developed responsive websites and web applications for diverse clients. Gained deep expertise in React, TypeScript, and modern CSS. Contributed to the internal component library used across all agency projects.',
  },
];

// ============ EDUCATION ============
export const education: EducationItem[] = [
  {
    degree: 'B.S. Computer Science',
    school: 'University of Technology',
    year: '2018',
    description:
      'Graduated with honors. Focus on software engineering, computer graphics, and human-computer interaction. Senior thesis on real-time web-based 3D rendering.',
  },
];

// ============ FUN FACTS ============
export const funFacts = [
  {
    emoji: '🌐',
    fact: 'Built my first website at age 12 using nothing but Notepad and pure HTML',
  },
  {
    emoji: '🎮',
    fact: 'Avid gamer and occasional game jam participant (built 3 games in 48 hours)',
  },
  {
    emoji: '✈️',
    fact: 'Visited 18 countries and counting — always coding from a new coffee shop',
  },
  {
    emoji: '📚',
    fact: 'Read 30+ technical books in the last 3 years (and counting)',
  },
  {
    emoji: '🎹',
    fact: 'Played piano for 12 years — the same discipline applies to writing clean code',
  },
  {
    emoji: '🧑‍🏫',
    fact: 'Mentored 50+ junior developers through open source and community programs',
  },
];

// ============ CATEGORIES ============
export const projectCategories = ['All', 'Web', '3D', 'Backend', 'Full Stack'] as const;
