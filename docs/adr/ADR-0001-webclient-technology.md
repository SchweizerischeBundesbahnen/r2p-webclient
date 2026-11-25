<!-- Original Template from: https://github.com/adr/madr -->

| Metadata        | Value            |
|-----------------|------------------|
| status          | decided          |
| date            | 08.05.2026       |
| decision-makers | Project Team R2P |

# Web Client Technology

## Decision

**Angular** with **Angular Material**.

## Context

R2P requires a full-featured web client supporting read and write operations. The client must support
components, forms with validation, API integration, and routing — without relying on SBB-specific branding or libraries.

## Criteria

- **No SBB branding** – must be independent of SBB-specific design systems
- **Low maintenance** – automated upgrade tooling or well-supported migration paths
- **Widespread / good ecosystem** – established, standard technology
- **Well maintained** – security issues are resolved quickly
- **Open license** – no restrictive obligations
- **Framework support** – components, forms (validation), API integration, routing

## Options Considered

| Criterion                  | Angular     | React              | Vue                      |
|----------------------------|-------------|--------------------|--------------------------|
| Low maintenance / auto updates | ++ (`ng update`) | ~ | ~ |
| Widespread / good ecosystem | +          | +                  | +                        |
| Long-term maintenance       | ++ (LTS 18 months) | + | + |
| Framework (out-of-the-box)  | ++          | – (assemble yourself) | – (rudimentary, assemble yourself) |

## Component Library

Angular Material was chosen as the component library. It provides all required UI components out of the box
and is tightly coupled with the Angular framework, ensuring compatibility and consistent upgrade paths.

| Component            | Angular Material | Lyne (SBB) |
|----------------------|:----------------:|:----------:|
| Button               | ✓                | ✓          |
| Card                 | ✓                | ✓          |
| Chips                | ✓                | ✓          |
| Datepicker           | ✓                | ✓          |
| Dialog               | ✓                | ✓          |
| Input / Form Field   | ✓                | ✓          |
| Select               | ✓                | ✓          |
| Snackbar / Alert     | ✓                | ✓          |
| Sort Header          | ✓                | ✓          |
| Table                | ✓                | ✓          |
| Timepicker           | ✓                | ✓          |
| Perlenkette          |                  | ✓          |

Lyne (SBB component library) was considered but rejected: it is an SBB-internal library that may require
waiting for SBB to release updates. Additionally, the "Perlenkette" component cannot be reused 1:1, as the
activity matrix view requires a custom component regardless. Angular Material is the recommended choice.

## Decision

**Angular** with **Angular Material**.

Angular is well-maintained, relatively low-effort to keep up-to-date (`ng update`), and provides essential
framework features (routing, forms, HTTP client) out of the box. Angular Material covers all required UI
components and integrates tightly with the framework.

## Implementation Notes

### State Management

There is relatively little state; most data can simply be re-fetched from the backend on each page visit.
Therefore, a heavy state management solution like NgRx or SignalStore is not warranted.

The recommended approach is **page-scoped services using Angular Signals**. Each page/view gets its own
service that loads data fresh when the page is activated. No global state is needed except for the server URL
and OAuth session, which are managed by their respective libraries (localStorage / OAuth library).

```typescript
// train.service.ts
@Injectable({ providedIn: 'root' })
export class TrainService {
  private trains = signal<TrainListElement[]>([]);
  private loading = signal(false);
  private error = signal<string | null>(null);

  readonly trains$ = this.trains.asReadonly();
  readonly loading$ = this.loading.asReadonly();

  constructor(private http: HttpClient) {}

  loadTrains(filters?: TrainFilter) {
    this.loading.set(true);
    this.http.get<TrainListElement[]>('/v1/trains', { params: filters })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: data => this.trains.set(data),
        error: err => this.error.set(err.message)
      });
  }
}
```

### Handling Partial JSON Updates

The backend JSON model is more detailed than what the UI exposes for editing. To avoid accidentally
overwriting or losing fields that are not part of the current view:

- **Work with a full copy of the train object** rather than flat DTOs. Backend update methods are always
  called with the complete train object.
- **Modal dialogs bind to a small, flat DTO** (not directly into the train object). Only on confirming
  ("OK") is the DTO merged back into the full train, using the spread operator to preserve all existing
  properties and selectively overwrite only the relevant fields:

```typescript
// Merge edited DTO back into the full train object, preserving all other properties
this.train.location = {
  ...this.train.location,
  ...editedDto
};
```

This ensures that list operations keep all existing elements intact, and that field-level updates do not
inadvertently clear unrelated properties.
