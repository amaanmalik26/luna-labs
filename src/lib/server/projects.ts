import {
	defaultPortfolioProjects,
	normalisePortfolioProject,
	sortPortfolioProjects,
	type PortfolioProject
} from '$lib/portfolio';
import { createPublicClient } from '$lib/server/supabase';

export async function loadPublishedProjects(): Promise<{
	projects: PortfolioProject[];
	usingFallback: boolean;
}> {
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
		return { projects: defaultPortfolioProjects, usingFallback: true };
	}

	const projects = sortPortfolioProjects(
		(data ?? []).map((project) => normalisePortfolioProject(project as PortfolioProject))
	);

	return projects.length > 0
		? { projects, usingFallback: false }
		: { projects: defaultPortfolioProjects, usingFallback: true };
}
