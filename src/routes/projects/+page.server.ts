import type { PageServerLoad } from './$types';
import { loadPublishedProjects } from '$lib/server/projects';

export const load: PageServerLoad = async ({ locals }) => {
	const { projects, usingFallback } = await loadPublishedProjects();
	return { projects, usingFallback, session: locals.session };
};
