import type { ProjectStatus } from '$lib/types/database';

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  stack: string[];
  status: ProjectStatus;
  gradient: string;
  year: string;
  featured: boolean;
  sort_order: number;
  is_published: boolean;
}

export const defaultPortfolioProjects: PortfolioProject[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'Luna Labs',
    category: 'Brand & Web System',
    description:
      "The very site you're on. A premium agency marketing platform built with SvelteKit and Supabase - featuring a lead capture engine with Discord integration, a real-time admin dashboard, and a design system built from scratch. Every component, every animation, every architectural decision documented and version-controlled.",
    stack: ['SvelteKit', 'Supabase', 'Tailwind 4', 'Vercel', 'TypeScript', 'Zod'],
    status: 'in-progress',
    gradient: 'linear-gradient(135deg, #0066FF 0%, #8A2BE2 50%, #00F0FF 100%)',
    year: '2025',
    featured: true,
    sort_order: 0,
    is_published: true,
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    title: 'Orion Dashboard',
    category: 'SaaS / Admin UI',
    description:
      'A concept B2B analytics dashboard with real-time data tables, chart components, and a multi-tenant role system built on Supabase RLS.',
    stack: ['SvelteKit', 'Supabase Realtime', 'Chart.js', 'PostgreSQL'],
    status: 'concept',
    gradient: 'linear-gradient(135deg, #1E143C 0%, #0066FF 60%, #00F0FF 100%)',
    year: '2025',
    featured: false,
    sort_order: 10,
    is_published: true,
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    title: 'Meridian Commerce',
    category: 'E-Commerce Platform',
    description:
      'A high-conversion e-commerce front-end concept - product grid, cart state, and a one-page checkout flow with full mobile optimisation.',
    stack: ['SvelteKit', 'Stripe', 'Tailwind', 'Sanity CMS'],
    status: 'concept',
    gradient: 'linear-gradient(135deg, #D4AF37 0%, #8A2BE2 70%, #0B0914 100%)',
    year: '2025',
    featured: false,
    sort_order: 20,
    is_published: true,
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    title: 'Pulse CRM',
    category: 'Internal Tool',
    description:
      'A lightweight lead and client management tool for small agencies - full CRUD, status pipeline, and email-thread association built in a single sprint.',
    stack: ['SvelteKit', 'Supabase', 'Resend', 'Zod'],
    status: 'concept',
    gradient: 'linear-gradient(135deg, #00F0FF 0%, #0066FF 50%, #1E143C 100%)',
    year: '2025',
    featured: false,
    sort_order: 30,
    is_published: true,
  },
];

export function sortPortfolioProjects(projects: PortfolioProject[]): PortfolioProject[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return a.title.localeCompare(b.title);
  });
}

export function normalisePortfolioProject(project: PortfolioProject): PortfolioProject {
  return {
    ...project,
    stack: Array.isArray(project.stack) ? project.stack.filter(Boolean) : [],
    gradient: project.gradient || 'linear-gradient(135deg, #0066FF 0%, #8A2BE2 100%)',
    year: project.year || String(new Date().getFullYear()),
  };
}
