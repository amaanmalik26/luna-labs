import { z } from 'zod';

export const PROJECT_STATUS_OPTIONS = ['live', 'concept', 'in-progress'] as const;

const optionalWebsiteUrl = z
	.string()
	.trim()
	.transform((value) => value || null)
	.pipe(z.string().url('Use a valid website URL.').nullable());

const optionalLogoUrl = z
	.string()
	.trim()
	.transform((value) => value || null)
	.pipe(
		z
			.union([
				z.string().url('Use a valid logo URL.'),
				z.string().regex(/^\/(?!\/)\S+$/, 'Use a logo URL or a site path like /logos/example.png.')
			])
			.nullable()
	);

export const projectSchema = z.object({
	title: z.string().trim().min(2, 'Title is too short.').max(120, 'Title is too long.'),
	category: z.string().trim().min(2, 'Category is too short.').max(120, 'Category is too long.'),
	description: z
		.string()
		.trim()
		.min(20, 'Description needs a little more detail.')
		.max(1200, 'Description is too long.'),
	stack: z.array(z.string().trim().min(1)).min(1, 'Add at least one stack item.').max(12),
	status: z.enum(PROJECT_STATUS_OPTIONS),
	website_url: optionalWebsiteUrl,
	logo_url: optionalLogoUrl,
	year: z
		.string()
		.trim()
		.regex(/^\d{4}$/, 'Use a four-digit year.'),
	featured: z.boolean(),
	is_published: z.boolean(),
	sort_order: z.number().int().min(0).max(999)
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export function parseStack(value: FormDataEntryValue | null): string[] {
	return (value?.toString() ?? '')
		.split(/[\n,]/)
		.map((item) => item.trim())
		.filter(Boolean);
}

export function projectFormData(form: FormData): ProjectFormData {
	const sortOrder = Number(form.get('sort_order')?.toString() ?? 0);

	return {
		title: form.get('title')?.toString() ?? '',
		category: form.get('category')?.toString() ?? '',
		description: form.get('description')?.toString() ?? '',
		stack: parseStack(form.get('stack')),
		status: form.get('status')?.toString() as ProjectFormData['status'],
		website_url: form.get('website_url')?.toString() ?? '',
		logo_url: form.get('logo_url')?.toString() ?? '',
		year: form.get('year')?.toString() ?? '',
		featured: form.get('featured') === 'on',
		is_published: form.get('is_published') === 'on',
		sort_order: Number.isFinite(sortOrder) ? sortOrder : 0
	};
}

export function flattenProjectErrors(error: z.ZodError<ProjectFormData>): Record<string, string> {
	const fieldErrors: Record<string, string> = {};

	for (const issue of error.issues) {
		const field = String(issue.path[0] ?? 'form');
		if (!fieldErrors[field]) fieldErrors[field] = issue.message;
	}

	return fieldErrors;
}
