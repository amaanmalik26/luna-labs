import type { PageServerLoad } from './$types';
import { createPublicClient } from '$lib/server/supabase';
import {
  defaultPortfolioProjects,
  normalisePortfolioProject,
  sortPortfolioProjects,
} from '$lib/portfolio';
import type { PortfolioProject } from '$lib/portfolio';

export const load: PageServerLoad = async ({ locals }) => {
  const supabase = createPublicClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[Portfolio] Falling back to default projects:', error.message);

    return {
      portfolioProjects: defaultPortfolioProjects,
      portfolioUsingFallback: true,
      session: locals.session,
    };
  }

  const portfolioProjects = sortPortfolioProjects(
    (data ?? []).map((project) => normalisePortfolioProject(project as PortfolioProject)),
  );

  return {
    portfolioProjects,
    portfolioUsingFallback: false,
    session: locals.session,
  };
};
