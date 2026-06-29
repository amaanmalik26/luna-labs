# Architecture Report — Luna Labs

Generated on 2026-06-26

## Executive Summary

Luna Labs is a SvelteKit-based marketing site and internal admin system. The application combines a polished public-facing experience with a server-rendered admin layer that manages leads and portfolio projects through Supabase. The architecture is straightforward and maintainable, with clear separation between public UI, server routes, and data access.

The current design is centered around:

- a public website built with SvelteKit and Svelte 5
- server-side route handlers for lead capture and admin operations
- Supabase as the primary persistence and auth backend
- a lightweight server-side security model for admin access

## 1. System Overview

### High-level shape

The app is a single SvelteKit application with two main concerns:

1. Public website experience
2. Protected admin dashboard for content and lead management

### Architecture diagram

```mermaid
flowchart LR
    User[Visitor / Admin] --> UI[SvelteKit Pages]
    UI --> PublicRoutes[Public Routes]
    UI --> AdminRoutes[Admin Routes]

    PublicRoutes --> LeadAPI[/api/leads]
    LeadAPI --> Supabase[(Supabase DB)]
    LeadAPI --> Discord[Discord Webhook]

    AdminRoutes --> ServerLoad[Server Load / Actions]
    ServerLoad --> Supabase
    ServerLoad --> Auth[Supabase Auth + allowlist]
```

## 2. Core Components

### Public application

- Main site shell and navigation live in [src/routes](src/routes)
- The homepage renders through [src/routes/+page.svelte](src/routes/+page.svelte)
- Shared UI lives in [src/lib/components](src/lib/components)
- The lead capture form is implemented in [src/lib/components/RequestQuoteForm.svelte](src/lib/components/RequestQuoteForm.svelte)

### Server-side application layer

- Request handling is routed through SvelteKit server files such as [src/routes/api/leads/+server.ts](src/routes/api/leads/+server.ts)
- Global request initialization is handled in [src/hooks.server.ts](src/hooks.server.ts)
- Admin route protection is enforced in [src/routes/admin/+layout.server.ts](src/routes/admin/+layout.server.ts)

### Data layer

- Supabase clients are created in [src/lib/server/supabase.ts](src/lib/server/supabase.ts)
- Public portfolio reads use a publishable client
- Admin and write operations use a service client with elevated server-side access

## 3. Request Flows

### Public lead submission

1. A visitor submits the quote form.
2. The form validates locally using the shared Zod schema in [src/lib/validation/lead.ts](src/lib/validation/lead.ts).
3. The browser sends the payload to [src/routes/api/leads/+server.ts](src/routes/api/leads/+server.ts).
4. The server validates again, applies IP-based rate limiting, and writes to Supabase.
5. A Discord notification is emitted through [src/lib/server/notifications.ts](src/lib/server/notifications.ts).

### Admin access

1. A user visits the admin area.
2. The request is intercepted by [src/hooks.server.ts](src/hooks.server.ts).
3. The server checks Supabase auth and whether the email is in the allowlist table.
4. Access to admin pages is allowed only if the user is verified and approved.

### Portfolio management

1. Admin users can view, create, update, and delete portfolio projects.
2. Server actions in [src/routes/admin/portfolio/+page.server.ts](src/routes/admin/portfolio/+page.server.ts) manage the data.
3. The data is normalized and sorted through [src/lib/portfolio.ts](src/lib/portfolio.ts).

## 4. Data and Persistence Model

The app relies on Supabase tables for structured data, including:

- leads
- projects
- allowed_admins

The database contract is typed in [src/lib/types/database.ts](src/lib/types/database.ts), and form validation is enforced with Zod schemas in [src/lib/validation/lead.ts](src/lib/validation/lead.ts) and [src/lib/validation/project.ts](src/lib/validation/project.ts).

## 5. Authentication and Authorization

### Current approach

- Authentication is handled through Supabase.
- Server-side auth is initialized per request in [src/hooks.server.ts](src/hooks.server.ts).
- Admin access is gated by a server-side layout check in [src/routes/admin/+layout.server.ts](src/routes/admin/+layout.server.ts).

### Strengths

- Auth is centralized rather than duplicated across pages.
- Admin routing is protected by a shared layout-level guard.
- Supabase SSR cookies allow server-rendered access without storing session state in the browser.

### Gaps

- Admin authorization is based on an email allowlist, not a richer roles model.
- The system does not appear to implement per-feature authorization beyond the admin gate.
- Sensitive server operations rely on a service client and environment variables, so operational secrets must be managed carefully.

## 6. Technical Stack

The project uses:

- SvelteKit as the application framework
- Svelte 5 for component rendering
- TypeScript for application logic
- Supabase for database, auth, and server-side data access
- Zod for validation
- Tailwind CSS for styling
- Vitest for unit testing

The runtime dependencies and scripts are defined in [package.json](package.json).

## 7. Architectural Strengths

### Clear separation of concerns

The app separates:

- presentation components
- server routes and actions
- validation logic
- data access helpers

### Server-first data access

The use of server-side route handlers and service clients is appropriate for forms, admin editing, and protected operations.

### Shared validation

The Zod schemas are reused by both the UI and the server, reducing divergence between client and server rules.

## 8. Risks and Technical Debt

### 1. Process-local rate limiting

The lead endpoint uses an in-memory Map in [src/routes/api/leads/+server.ts](src/routes/api/leads/+server.ts). That works for a single instance, but it will not scale across multiple app instances or restarts.

### 2. Admin access is relatively simple

The admin layer uses an allowlist and server guard, but it does not yet appear to have a role-based or audit-oriented model for sensitive actions.

### 3. Limited operational visibility

The current implementation logs important events, but there is no evident centralized monitoring, tracing, or retry strategy for external dependencies such as Discord delivery.

### 4. Testing coverage looks light

The repository includes examples and test scaffolding, but the application’s core workflows are not yet described by a comprehensive automated test suite.

## 9. Recommendations

1. Introduce a more durable rate-limiting layer for lead submissions, such as Redis or a managed edge rate limiter.
2. Add role-based admin permissions if the admin area grows beyond a small internal team.
3. Add observability for critical flows: lead submission success/failure, admin action outcomes, and Supabase errors.
4. Expand automated tests around the lead API, admin server actions, and portfolio CRUD flow.
5. Consider a more explicit deployment and environment configuration strategy for Supabase keys and webhook secrets.

## 10. Verification

The architecture summary above was validated against the repository source and confirmed by running:

```bash
npm run check
```

Result: SvelteKit type-check completed successfully with 0 errors and 0 warnings.
