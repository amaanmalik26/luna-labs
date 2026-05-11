import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createServiceClient } from '$lib/server/supabase';
import {
  defaultPortfolioProjects,
  normalisePortfolioProject,
  sortPortfolioProjects,
  type PortfolioProject,
} from '$lib/portfolio';
import {
  flattenProjectErrors,
  projectFormData,
  projectSchema,
} from '$lib/validation/project';
import type { ProjectInsert, ProjectUpdate } from '$lib/types/database';

function isMissingProjectsTable(message: string): boolean {
  return message.toLowerCase().includes('projects');
}

async function clearOtherFeaturedProjects(id: string) {
  const supabase = createServiceClient();

  await supabase
    .from('projects')
    .update({ featured: false, updated_at: new Date().toISOString() })
    .neq('id', id);
}

export const load: PageServerLoad = async () => {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('featured', { ascending: false })
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    return {
      projects: defaultPortfolioProjects,
      tableMissing: isMissingProjectsTable(error.message),
      loadError: error.message,
      usingFallback: true,
    };
  }

  const projects = sortPortfolioProjects(
    (data ?? []).map((project) => normalisePortfolioProject(project as PortfolioProject)),
  );

  return {
    projects,
    tableMissing: false,
    loadError: '',
    usingFallback: false,
  };
};

export const actions: Actions = {
  create: async ({ request }) => {
    const form = await request.formData();
    const parsed = projectSchema.safeParse(projectFormData(form));

    if (!parsed.success) {
      return fail(422, {
        intent: 'create',
        errors: flattenProjectErrors(parsed.error),
      });
    }

    const payload: ProjectInsert = parsed.data;
    const supabase = createServiceClient();

    const { data, error } = await supabase
      .from('projects')
      .insert(payload)
      .select('id')
      .single();

    if (error || !data) {
      return fail(500, {
        intent: 'create',
        error: error?.message ?? 'Create failed.',
      });
    }

    if (payload.featured) await clearOtherFeaturedProjects(data.id);

    return { success: true, intent: 'create' };
  },

  update: async ({ request }) => {
    const form = await request.formData();
    const id = form.get('id')?.toString();
    const parsed = projectSchema.safeParse(projectFormData(form));

    if (!id) {
      return fail(422, { intent: 'update', error: 'Missing project id.' });
    }

    if (!parsed.success) {
      return fail(422, {
        intent: 'update',
        id,
        errors: flattenProjectErrors(parsed.error),
      });
    }

    const payload: ProjectUpdate = {
      ...parsed.data,
      updated_at: new Date().toISOString(),
    };

    const supabase = createServiceClient();
    const { error } = await supabase.from('projects').update(payload).eq('id', id);

    if (error) {
      return fail(500, { intent: 'update', id, error: error.message });
    }

    if (payload.featured) await clearOtherFeaturedProjects(id);

    return { success: true, intent: 'update', id };
  },

  delete: async ({ request }) => {
    const form = await request.formData();
    const id = form.get('id')?.toString();

    if (!id) {
      return fail(422, { intent: 'delete', error: 'Missing project id.' });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      return fail(500, { intent: 'delete', id, error: error.message });
    }

    return { success: true, intent: 'delete', id };
  },
};
