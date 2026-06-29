import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { projectSlug } from '$lib/portfolio';
import { loadPublishedProjects } from '$lib/server/projects';

export const load: PageServerLoad = async ({ params, locals }) => {
	const { projects } = await loadPublishedProjects();
	const index = projects.findIndex((project) => projectSlug(project) === params.slug);

	if (index === -1) error(404, 'Project not found');

	return {
		project: projects[index],
		nextProject: projects[(index + 1) % projects.length],
		session: locals.session
	};
};
