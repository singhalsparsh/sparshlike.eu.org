export interface Project {
  title: string;
  tagline: string;
  description: string;
  longDescription?: string;
  tech: string[];
  category: 'Web' | 'Full Stack' | 'AI / ML';
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
  tech?: string[];
}

export interface EducationItem {
  degree: string;
  school: string;
  year: string;
  description: string;
  tech?: string[];
}

// ============ PROJECTS ============
export const allProjects: Project[] = [
  {
    title: 'INNOV6',
    tagline: 'Innovation & Testing Platform',
    description:
      'Web platform for streamlined experimentation, real-time testing workflows, and responsive interface interactions.',
    longDescription:
      'INNOV6 is a specialized platform designed for rapid web experimentation and validation. It offers structured workflows for real-time testing, highly responsive interactive components, and clean API integration built with modern TypeScript and React.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
    category: 'Full Stack',
    color: 'from-blue-600 to-indigo-600',
    screenshots: [
      'https://i.ibb.co/RkpdQbBH/image.png',
      'https://i.ibb.co/sv7gFzDD/image.png',
    ],
    liveUrl: 'https://innov6.sparshlike.eu.org/',
    githubUrl: 'https://github.com/singhalsparsh/ai-test',
    featured: true,
  },
  {
    title: 'FluxAI',
    tagline: 'Generative AI & Intelligent Image Generation Platform',
    description:
      'Full-stack artificial intelligence application leveraging state-of-the-art generative diffusion models for high-quality visual synthesis with fast response times.',
    longDescription:
      'FluxAI is a full-stack generative AI system connecting modern front-end design with deep learning diffusion inference. Featuring low-latency prompt execution, model orchestration, and automated image post-processing for rapid generative visual synthesis.',
    tech: ['Python', 'Generative AI', 'React', 'FastAPI / Node.js'],
    category: 'AI / ML',
    color: 'from-purple-600 to-pink-600',
    screenshots: [
      'https://i.ibb.co/2r3K172/image.png',
      'https://i.ibb.co/kVjLc236/image.png',
    ],
    liveUrl: 'https://ai.sparshlike.eu.org/',
    githubUrl: 'https://github.com/singhalsparsh/flux-ai',
    featured: true,
  },
  {
    title: 'sparshlike.eu.org',
    tagline: 'Interactive Developer Hub & Portfolio',
    description:
      'Personal production ecosystem and technical portal showcasing applications, algorithm progression, and open-source code.',
    longDescription:
      'Production technical portfolio and developer ecosystem engineered for performance, dynamic responsiveness, and interactive systems. Features glassmorphic UI, modern Next.js architecture, and seamless navigation.',
    tech: ['Next.js / React', 'Tailwind CSS', 'Cloudflare / Vercel'],
    category: 'Web',
    color: 'from-emerald-500 to-teal-500',
    screenshots: [],
    liveUrl: 'https://sparshlike.eu.org',
    githubUrl: 'https://github.com/singhalsparsh',
    featured: true,
  },
];

// ============ BLOG POSTS ============
export const blogPosts: BlogPost[] = [
  {
    slug: 'integrating-fluxai-generative-ai-web-interfaces',
    title: 'Integrating FluxAI: Building Performant Generative AI Web Interfaces',
    excerpt:
      'Architectural insights into connecting diffusion models and generative AI endpoints with responsive React frontends, streaming responses, and low latency.',
    content: `Building real-time web applications powered by generative AI requires a balanced architecture that handles long-running inferences without blocking client UI interactivity.

## The Challenge of Diffusion Model Latency

Generative diffusion models demand substantial compute and inference time. When deploying FluxAI, we addressed several bottlenecks:
- Implementing asynchronous task queues and polling/WebSocket mechanisms
- Managing fast optimistic UI states to maintain user engagement during model warmups
- Handling edge caching and CDN distribution for generated visual assets

## Architectural Stack

By pairing Python backends (FastAPI) with React on the client, we decouple heavy compute workloads from user interaction flows, ensuring robust reliability across concurrent sessions.`,
    date: 'October 12, 2026',
    readTime: '6 min read',
    tags: ['AI', 'Generative AI', 'React'],
  },
  {
    slug: 'optimizing-algorithms-recursion-leetcode-solves',
    title: 'Optimizing Algorithms & Recursion: Lessons from 200+ LeetCode Solves',
    excerpt:
      'Key takeaways, space-time complexity patterns, and algorithmic intuition gained from solving 200+ competitive programming problems in C++.',
    content: `Algorithmic problem-solving is the foundation of dependable software engineering. Reaching 200+ solved problems on LeetCode with the 50 Days Badge 2026 transformed my approach to code performance.

## Recursion and Dynamic Programming Intuition

Breaking down complex states into subproblems requires recognizing memoization and recurrence relations:
- Identify overlapping subproblems and state boundaries early
- Transition from top-down recursive intuition to iterative bottom-up cache-friendly loops
- Analyze auxiliary space complexity alongside execution time to prevent stack overflows

## Clean C++ for Systems

Using modern C++ idioms and STL containers with optimal memory layout yields substantial performance advantages in low-level and high-throughput applications.`,
    date: 'September 28, 2026',
    readTime: '7 min read',
    tags: ['C++', 'DSA', 'Competitive Programming'],
  },
  {
    slug: 'modern-linux-environments-fullstack-ai-engineering',
    title: 'Modern Linux Environments for Full-Stack & AI Engineering',
    excerpt:
      'Configuring a productive, 100% Linux-native development workflow on Ubuntu 26.04 for high-throughput AI engineering, scripting, and system builds.',
    content: `A native Linux environment provides unparalleled control over system resources, hardware accelerators, toolchains, and package pipelines.

## Why 100% Linux-Native Matters

Developing natively on Ubuntu 26.04 provides:
- Seamless CUDA and PyTorch driver integrations without virtualization friction
- Direct shell scripting, process monitoring, and memory management
- High performance file I/O crucial for training pipelines and local test environments

## Toolchain & Shell Discipline

Pairing Git workflows, custom terminal multiplexing, and optimized compiler toolchains creates a frictionless developer feedback loop.`,
    date: 'August 15, 2026',
    readTime: '5 min read',
    tags: ['Linux', 'Workflow', 'Ubuntu'],
  },
];

// ============ TIMELINE ============
export const timeline: TimelineItem[] = [
  {
    role: 'B.Tech in CSE (Artificial Intelligence)',
    company: 'KIET Deemed to be University',
    period: '2026 – 2030',
    description:
      'Core curriculum in discrete math, data structures, computer systems, and AI model architectures.',
    tech: ['C++', 'Python', 'AI/ML', 'Systems'],
  },
  {
    role: 'Data Structures & Algorithms Trainee',
    company: 'Coding Blocks',
    period: 'Apr 2026 – Sep 2026',
    description:
      'Intensive focus on recursion, space-time complexity analysis, trees, dynamic programming, and competitive problem solving.',
    tech: ['C++', 'DSA', 'Problem Solving'],
  },
];

// ============ EDUCATION ============
export const education: EducationItem[] = [
  {
    degree: 'B.Tech in Computer Science and Engineering (Artificial Intelligence)',
    school: 'KIET Deemed to be University',
    year: '2026 – 2030',
    description:
      'Focusing on foundational computational theory, advanced algorithms, machine learning paradigms, and systems engineering.',
    tech: ['C++', 'Python', 'AI/ML', 'Systems'],
  },
];

// ============ FUN FACTS ============
export const funFacts = [
  {
    emoji: '⚡',
    fact: 'Solved 200+ algorithmic challenges on LeetCode with the 50 Days Badge 2026',
  },
  {
    emoji: '🐧',
    fact: '100% Linux-native developer building workflows on Ubuntu 26.04',
  },
  {
    emoji: '🤖',
    fact: 'Building generative AI web interfaces with PyTorch, diffusion models, and FastAPI',
  },
  {
    emoji: '💡',
    fact: 'First-year B.Tech CSE (AI) undergraduate at KIET Deemed to be University',
  },
  {
    emoji: '💻',
    fact: 'Writes high-performance algorithms and competitive code in modern C++ and Python',
  },
  {
    emoji: '🚀',
    fact: 'Passionate about systems engineering, distributed services, and intelligent platforms',
  },
];

// ============ CATEGORIES ============
export const projectCategories = ['All', 'Web', 'Full Stack', 'AI / ML'] as const;
