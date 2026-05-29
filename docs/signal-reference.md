# Angular 21 Signals – LLM Reference

> Compact reference for correct usage of Angular Signals (v21).

---

## 1. Writable Signals

```ts
const count = signal(0);          // create
count();                           // read (getter)
count.set(3);                      // replace value
count.update(v => v + 1);         // derive from previous
```

Expose readonly externally:

```ts
private readonly _count = signal(0);
readonly count = this._count.asReadonly(); // no .set()/.update()
```

> **Note:** `asReadonly()` does not prevent deep mutation of object values.

---

## 2. Computed Signals

```ts
const doubleCount = computed(() => count() * 2); // read-only, lazy, memoized
```

- Re-evaluates only when a tracked dependency changes.
- Dependencies are **dynamic** – only signals actually read during derivation are tracked.
- Cannot be written to (`doubleCount.set(...)` → compile error).

```ts
// Conditional dependency: count is only tracked when showCount() is true
const conditionalCount = computed(() =>
  showCount() ? `Count: ${count()}` : 'Hidden'
);
```

---

## 3. linkedSignal – Dependent Writable State

Use when a writable signal must reset/update based on another signal.

**Simple form:**
```ts
selectedOption = linkedSignal(() => shippingOptions()[0]);
// Resets to first option whenever shippingOptions changes
// Can still be set manually: selectedOption.set(...)
```

**With source + computation (preserving previous value):**
```ts
selectedOption = linkedSignal<ShippingMethod[], ShippingMethod>({
  source: this.shippingOptions,
  computation: (newOptions, previous) =>
    newOptions.find(o => o.id === previous?.value.id) ?? newOptions[0],
});
```
- `previous.source` = previous value of `source`
- `previous.value` = previous value of the `linkedSignal`
- Explicit generic types required when using `previous`.

**With custom equality:**
```ts
linkedSignal(() => activeUser(), {
  equal: (a, b) => a.id === b.id,
});
```

---

## 4. Resources – Async Data

```ts
const userId = signal(1);
const userResource = resource({
  params: () => ({ id: userId() }),       // reactive params (tracked)
  loader: async ({ params }) => fetchUser(params.id),
});

userResource.value()   // Signal<T | undefined>
userResource.status()  // 'idle' | 'loading' | 'resolved' | 'error' | 'local'
userResource.error()   // Signal<unknown>
userResource.isLoading() // Signal<boolean>
userResource.set(...)  // optimistic local update
userResource.reload()  // force re-fetch
```

- `params` runs in a **reactive context** – signal reads are tracked.
- `loader` receives `{ params, abortSignal }` – use `abortSignal` for cancellation.
- When `params` changes, the previous request is aborted and a new one starts.

---

## 5. Effects – Side Effects on Non-Reactive APIs

Use `effect` **only** for bridging to non-reactive APIs (DOM, logging, analytics, etc.).  
Prefer `computed` / `linkedSignal` / `resource` for deriving state.

```ts
effect(() => {
  const user = currentUser(); // tracked
  document.title = `Hello ${user.name}`;
});
```

**Cleanup:**
```ts
effect((onCleanup) => {
  const timer = setInterval(() => tick(), 1000);
  onCleanup(() => clearInterval(timer));
});
```

**`afterRenderEffect`** – runs after DOM render, for layout/DOM reads:
```ts
afterRenderEffect(() => {
  console.log(el.nativeElement.offsetHeight);
});
```

**Destroy a manually created effect:**
```ts
const ef = effect(() => { ... });
ef.destroy();
```

---

## 6. Reactive Context Rules

Angular tracks signal reads automatically in:
- `computed()` derivations
- `linkedSignal()` computation
- `effect()` / `afterRenderEffect()` callbacks
- `resource()` params/loader
- Component templates (including `host` bindings)

**Async boundary breaks tracking:**
```ts
// ❌ theme() read after await is NOT tracked
effect(async () => {
  const data = await fetchData();
  console.log(theme()); // lost reactive context
});

// ✅ Read signals BEFORE await
effect(async () => {
  const currentTheme = theme(); // tracked
  const data = await fetchData();
  console.log(data, currentTheme);
});
```

**Read without tracking (`untracked`):**
```ts
effect(() => {
  const user = currentUser();                         // tracked
  untracked(() => loggingService.log(user.name));     // not tracked
  console.log(untracked(counter));                    // not tracked
});
```

**Assert not in reactive context:**
```ts
import { assertNotInReactiveContext } from '@angular/core';
function subscribeToEvents() {
  assertNotInReactiveContext(subscribeToEvents);
  // safe to subscribe here
}
```

---

## 7. Signal Equality Functions

Default equality: `Object.is()` (referential).

```ts
import isEqual from 'lodash/isEqual';
const data = signal(['test'], { equal: isEqual });
data.set(['test']); // no update triggered – deep equal
```

Works on `signal()`, `computed()`, and `linkedSignal()`.

---

## 8. Type Checking

```ts
isSignal(count)          // true for signal() and computed()
isWritableSignal(count)  // true only for signal() (not computed)
```

---

## 9. OnPush Components

Signals read in an OnPush template are automatically tracked. When the signal changes, the component is marked dirty and updated on the next change detection run. No `markForCheck()` needed.

---

## 10. Quick Cheat Sheet

| Need | Use |
|------|-----|
| Simple mutable state | `signal()` |
| Derived read-only value | `computed()` |
| Writable state linked to other state | `linkedSignal()` |
| Async external data (HTTP, etc.) | `resource()` |
| Side effect on non-reactive API | `effect()` |
| Side effect after DOM render | `afterRenderEffect()` |
| Read signal without tracking | `untracked()` |
| Expose state without write access | `.asReadonly()` |

---

## 11. Common Pitfalls

- **Do not** call `signal.set()` inside `computed()` – computed must be pure.
- **Do not** read signals after `await` in async effects if tracking is needed.
- **Do not** use `effect()` for state derivation – use `computed()` instead.
- **Do not** create `effect()` outside of an injection context without passing `injector`.
- Writable signals should be **private** in services; expose via `asReadonly()`.

