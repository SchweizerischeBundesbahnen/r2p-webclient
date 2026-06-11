# Application Architecture

## Layer Overview

The application is split into three layers with a strict dependency direction:

```
pages  →  core  →  shared
  └──────────────────┘
```

| Layer | Path | Responsibility |
|-------|------|----------------|
| **pages** | `src/app/pages/` | Routed views; compose shared components, call core services |
| **core** | `src/app/core/` | App-wide infrastructure: API, auth, error handling, settings, locale |
| **shared** | `src/app/shared/` | Reusable UI components, typed API models, utility functions |

**Dependency rules:**
- `pages` may import from `core` and `shared`.
- `core` may import from `shared`.
- `shared` has no imports from `pages` or `core`.
- Cross-page imports are not allowed.

---

## Core Layer

| Module | Files | What it owns |
|--------|-------|--------------|
| `api/` | `backend-api.service.ts` | All HTTP calls; the only place `HttpClient` is used |
| `auth/` | `oidc.guard.ts`, `settings.guard.ts` | Route guards — OIDC authentication + settings validation |
| `error/` | `app-error-handler.ts`, `error-interceptor.ts`, `error-notification.service.ts`, `error-toast.ts` | Global error handler, HTTP interceptor, user-facing toast |
| `locale/` | `locale.service.ts`, `locale.config.ts` | i18n locale switching (en-US / de-CH) |
| `settings/` | `settings.service.ts`, `settings-modal.ts` | Server URL, organisation, OIDC config — persisted in localStorage |

---

## Shared Layer

| Module | Contents |
|--------|----------|
| `components/` | 9 reusable UI components (see below) |
| `models/api.models.ts` | **Single source of truth** for all API types — auto-generated from OpenAPI schema; never duplicate |
| `utils/` | Pure helper functions (`date.utils.ts`, `journeyLocation.utils.ts`) |

### Shared Components

| Component | Purpose |
|-----------|---------|
| `alert-banner` | Inline status/warning banners |
| `detail-grid` | Key/value detail layout |
| `journey-route-card` | Complex card for a journey route — includes child components `journey-activity-item`, `edit-activity-modal`, `edit-stop-modal` |
| `overall-status` | Aggregated status indicator |
| `partner-badge` | Railway operator badge (SBB, BLS, SOB …) |
| `prototype-banner` | App-wide prototype disclaimer banner |
| `spinner` | Loading indicator |
| `sticky-edit-bar` | Fixed bottom bar for save/cancel actions on edit pages |
| `train-details-form-card` | Shared form card for train metadata (used on create and edit pages) |

---

## Pages Layer

### Route Map

```
/ (Layout — settingsGuard, oidcGuard)
├── /                   → redirect → /traffic-overview
├── /traffic-overview   → TrafficOverviewPage
├── /traffic-view/:trainId → TrafficPage
├── /create-train       → CreateTrainPage
├── /edit-train         → EditTrainPage
├── /read-train         → ReadTrainPage
└── /**                 → NotFoundPage
```

The root `Layout` component renders the navigation bar, settings button, and locale switcher around `<router-outlet>`.

### Page Anatomy

Each non-trivial page follows a consistent three-file pattern:

```
<page-name>/
  <page-name>-page.ts       # Standalone component — template, bindings, UI logic
  <page-name>-page.html     # Template (inline for simple pages, separate for complex ones)
  <page-name>-page.state.ts # Injectable page-state service — signals, rxResource, business logic
  <page-name>-page.spec.ts  # Component tests
  <page-name>-page.state.spec.ts  # State tests
```

The state service is **provided at route level** (`providers: [PageState]` in the route definition), so it is created when the route activates and destroyed when the user navigates away.

### Pages Overview

| Page | Child Components / Modals | Key State Responsibilities |
|------|--------------------------|---------------------------|
| **TrafficOverviewPage** | `TrainFilterBar`, `TrainTable`, `TableRow` | Load all trains, filter, pagination |
| **TrafficPage** | `AcceptMergeModal`, `DeleteModal`, `NewVariantModal`, `RejectMergeModal`, `RequestMergeModal`, `ShareTrainModal`, `BranchStatusBadge` | Load train + variants, orchestrate merge workflow, manage collaboration |
| **CreateTrainPage** | uses `train-details-form-card` (shared) | Form state, submit create |
| **EditTrainPage** | uses `train-details-form-card` (shared) | Load train, form state, submit update |
| **ReadTrainPage** | `ViewJsonModal` | Load train for read-only display, show raw JSON on demand |
| **NotFoundPage** | — | Static 404 view |

### Modals

Pages open modals via Angular Material `MatDialog`. Each modal is a standalone component
co-located inside the page's own folder — they are not shared and not exported.

---

## State & Data Flow

```
Template (signals)
     ↑ read / write
PageState (signals + rxResource)
     ↑ calls
BackendApiService (HttpClient)
     ↑ errors
ErrorInterceptor → ErrorNotificationService → ErrorToast
```

- **`rxResource()`** drives all async data fetching; no manual `subscribe` for loading data.
- **`linkedSignal()`** is used for local editable copies of input signals.
- **`computed()`** derives read-only values from state signals.
- State mutations happen exclusively through signal setters — no direct property mutation.

---

## App Bootstrap (`app.config.ts`)

| Provider | Purpose |
|----------|---------|
| `provideRouter(routes, withComponentInputBinding())` | Routing; route params bound automatically as component inputs |
| `provideHttpClient(withInterceptors([errorInterceptor]))` | HTTP with global error interception |
| `{ provide: ErrorHandler, useClass: AppErrorHandler }` | Uncaught error reporting |
| `provideOAuthClient(...)` | OIDC authentication (angular-oauth2-oidc) |
| `provideLocale()` | Locale resolution at startup |
