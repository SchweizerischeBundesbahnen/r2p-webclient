# Angular 21 Forms – LLM Reference

> Compact reference for Angular Forms (v21). Focus: **Signal Forms** (experimental, v21+).

---

## 1. Approach Comparison

| Feature | Signal Forms | Reactive Forms | Template-driven |
|---------|-------------|----------------|-----------------|
| Source of truth | `signal()` model | `FormControl`/`FormGroup` | Component property |
| Type safety | Inferred from model | Explicit (typed forms) | Minimal |
| Validation | Schema + path-based | Validator functions on controls | Directives |
| Status | **Experimental** (v21+) | Stable | Stable |
| Best for | Signal-based apps | Complex forms | Simple forms |

> **Prefer Signal Forms** for new signal-based Angular 21+ applications.

---

## 2. Signal Forms – Core Concepts

### Basic Setup

```ts
import { form, FormField, required, email, minLength } from '@angular/forms/signals';

@Component({
  imports: [FormField],
  template: `
    <input [formField]="loginForm.email" />
    @if (loginForm.email().touched() && loginForm.email().invalid()) {
      <p>{{ loginForm.email().errors()[0].message }}</p>
    }
    <button [disabled]="loginForm().invalid()">Sign In</button>
  `
})
export class Login {
  loginModel = signal({ email: '', password: '' });
  loginForm = form(this.loginModel, (p) => {
    required(p.email, { message: 'Email is required' });
    email(p.email, { message: 'Enter a valid email' });
    required(p.password);
    minLength(p.password, 8);
  });
}
```

- `form(signal, schemaFn)` creates a **field tree** mirroring the model.
- `form.fieldName` → field tree node; `form.fieldName()` → `FieldState<T>` with reactive signals.
- The schema callback parameter is a `SchemaPathTree` (commonly `p`).

---

## 3. Field State Signals

```ts
field().value()          // WritableSignal – current value
field().valid()          // all validators pass, no pending
field().invalid()        // has errors
field().errors()         // ValidationError[]  { kind, message }
field().pending()        // async validation in progress
field().touched()        // user focused+blurred
field().dirty()          // user modified
field().disabled() / .hidden() / .readonly()
field().disabledReasons()
// Constraint metadata (set by built-in validators):
field().required() / .min() / .max() / .minLength() / .maxLength() / .pattern()
```

**Form-level** (aggregates all children): `loginForm().valid()`, `.invalid()`, `.touched()`, `.dirty()`

> Hidden, disabled, and readonly fields are **non-interactive** – excluded from parent form state.

---

## 4. Availability Rules (in schema)

```ts
form(model, (p) => {
  disabled(p.couponCode, ({ valueOf }) => valueOf(p.total) < 50);
  disabled(p.field, ({ valueOf }) => condition ? 'Reason message' : false); // string = reason, false = enable
  hidden(p.shippingAddress, ({ valueOf }) => !valueOf(p.requiresShipping));
  readonly(p.username);                                    // always
  readonly(p.title, ({ valueOf }) => valueOf(p.isLocked)); // conditional
});
```

- `[formField]` auto-binds `disabled`/`readonly` HTML attributes. `hidden` requires manual `@if (!form.field().hidden())`.
- Always return `false` (not just falsy) to enable a conditionally disabled field.

| Rule | Visible | User interacts | In HTML submit |
|------|---------|----------------|----------------|
| `disabled()` | Yes | No | No |
| `hidden()` | No | No | No |
| `readonly()` | Yes | No | Yes |

---

## 5. Built-in Validators

```ts
form(model, (p) => {
  required(p.name, { message: 'Required', when: ({ valueOf }) => condition });
  email(p.email);
  min(p.age, 18); max(p.age, 120);
  minLength(p.password, 8); maxLength(p.bio, 500);
  pattern(p.phone, /^\d{3}-\d{3}-\d{4}$/);
});
```

- All validators run independently (multiple errors possible).
- Hidden and disabled fields **skip validation**.
- `required` treats `null` and `''` as empty; use `minLength` for arrays.

---

## 6. Custom Validators

```ts
// Single field
validate(p.website, ({ value }) =>
  !value().startsWith('https://') ? { kind: 'https', message: 'Must start with https://' } : null
);

// Cross-field
validate(p.confirmPassword, ({ value, valueOf }) =>
  value() !== valueOf(p.password) ? { kind: 'mismatch', message: 'Passwords do not match' } : null
);

// Group validation targeting specific children
validateTree(p, ({ fieldTreeOf }) =>
  ({ kind: 'duplicate', message: '...', fieldTree: fieldTreeOf(p.cell1) })
);
```

**FieldContext** properties: `value`, `state`, `fieldTree`, `valueOf(path)`, `stateOf(path)`, `fieldTreeOf(path)`

---

## 7. Async Validation

```ts
// HTTP validation (recommended)
validateHttp(p.username, {
  debounce: 300,
  request: ({ value }) => value() ? `/api/check?u=${value()}` : undefined,
  onSuccess: (res) => res.taken ? { kind: 'taken', message: 'Already taken' } : null,
  onError: () => ({ kind: 'serverError', message: 'Could not verify' }),
});

// Custom async (lower-level)
validateAsync(p.username, {
  params: ({ value }) => value().length >= 3 ? value() : undefined,
  debounce: 300,
  factory: (sig) => resource({ params: () => sig(), loader: async ({ params }) => myService.check(params) }),
  onSuccess: (result) => result?.available ? null : { kind: 'taken', message: 'Taken' },
  onError: () => ({ kind: 'error', message: 'Failed' }),
});
```

- Run **only after all sync validators pass**. `pending()` = `true` while running; `valid()` and `invalid()` are both `false`.
- Pending requests cancel automatically on value change.

---

## 8. Debounce

```ts
debounce(p.query, 300);     // delay all field reactions by 300ms
debounce(p.query, 'blur');  // only commit on blur
```

- Delays model updates (and therefore validation, derived state, etc.).
- Touch (blur) and form submission flush debounced values immediately.
- `debounce()` delays everything; `validateHttp({ debounce })` only delays that one validator.

---

## 9. Form Submission

```ts
// Option A: FormRoot directive (recommended)
@Component({
  imports: [FormField, FormRoot],
  template: `
    <form [formRoot]="myForm">
      <input [formField]="myForm.name" />
      <button type="submit" [disabled]="myForm().submitting()">
        {{ myForm().submitting() ? 'Saving...' : 'Save' }}
      </button>
    </form>
  `
})
export class MyComp {
  model = signal({ name: '' });
  myForm = form(this.model, (p) => { required(p.name); }, {
    submission: {
      action: async (field) => {
        const result = await api.save(field().value());
        if (!result.ok) return { kind: 'serverError', message: result.message };
      },
      onInvalid: (field) => field().errorSummary()[0]?.fieldTree().focusBoundControl(),
      ignoreValidators: 'pending', // 'pending' (default) | 'none' | 'all'
    }
  });
}

// Option B: Manual submit()
async onSave() {
  const success = await submit(this.myForm, async (field) => { await api.save(field().value()); });
  if (success) router.navigate(['/done']);
}
```

**submit() sequence:** ① Mark all interactive fields touched → ② Check validation → ③ Run `action` (`submitting()` = true) → ④ Route returned errors.

**Reset after submit:** `f().reset({ name: '' })` – clears touched/dirty, sets new value.

---

## 10. Form Model Design Rules

- **Never use `undefined`** or optional fields (`property?: T`) – breaks the field tree.
- **Initialize all fields** and keep a **static structure** – avoid discriminated unions with different shapes.
- Use `hidden()` for conditional sections instead of dynamic model types.
- Arrays are allowed – all items must have the same shape.

```ts
// ✅ Correct
const model = signal({ name: '', birthday: null as Date | null });
// ❌ Wrong
const model = signal({ name: undefined });
const model = signal<{ name?: string }>({});
```

---

## 11. Domain ↔ Form Model Translation

```ts
// Domain → Form model
private readonly formModel = linkedSignal({
  source: this.domainModel,
  computation: (dm) => dm ? domainToForm(dm) : EMPTY_FORM_MODEL,
});
protected readonly myForm = form(this.formModel);

// Form → Domain on submit
submit(this.myForm, async () => { await service.update(formToDomain(this.myForm.value())); });

// Form → Domain continuously (auto-save)
constructor() {
  effect(() => { if (this.myForm().valid()) this.domainModel.set(formToDomain(this.myForm.value())); });
}
```

---

## 12. Schema Composability

```ts
// Reusable schema
const nameSchema = schema<{ first: string; last: string }>((p) => {
  required(p.first); minLength(p.first, 2);
  required(p.last);  minLength(p.last, 2);
});
form(model, (p) => { apply(p.name, nameSchema); });

// Conditional schema
form(model, (p) => {
  applyWhen(p, ({ valueOf }) => valueOf(p.country) === 'US', (p) => {
    required(p.zipCode); pattern(p.zipCode, /^\d{5}(-\d{4})?$/);
  });
  applyWhenValue(p.payment, isCreditCard, (p) => { // type-narrowing
    required(p.cardNumber);
  });
});

// Array items
form(model, (p) => {
  applyEach(p.items, (item) => { required(item.name); min(item.quantity, 1); });
  // Or: applyEach(p.items, itemSchema);
});
```

---

## 13. Metadata

```ts
const HELP = createMetadataKey<string>();
form(model, (p) => {
  metadata(p.username, HELP, ({ value }) => value().length < 3 ? 'Too short' : 'Looks good');
});
// Read: field().metadata(HELP)?.()
```

Built-in metadata via validators: `field().required()`, `.min()`, `.max()`, `.minLength()`, `.maxLength()`, `.pattern()`

---

## 14. Custom Controls

```ts
@Component({ selector: 'app-input', template: `<input [value]="value()" (input)="value.set($event.target.value)" [disabled]="disabled()" />` })
export class AppInput implements FormValueControl<string> {
  value = model('');         // required
  touched = model(false);    // set on blur
  disabled = input(false);   // from FormField
  invalid = input(false);
  errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);
  hidden = input(false);
  readonly = input(false);
}
// Checkbox: implements FormCheckboxControl with `checked = model(false)`
// Usage: <app-input [formField]="myForm.email" />
```

- `FormValueControl` → has `value` model; `FormCheckboxControl` → has `checked` model.
- Put validation logic in the **schema**, not in the control.
- Use `linkedSignal` for display transformations (e.g. currency formatting).

---

## 15. Reactive Forms (Stable)

```ts
import { FormControl, FormGroup, FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({ imports: [ReactiveFormsModule], ... })
export class MyComp {
  private fb = inject(FormBuilder);
  profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName:  [''],
    address: this.fb.group({ street: [''], city: [''], zip: [''] }),
    aliases:  this.fb.array([this.fb.control('')]),
  });
  get aliases() { return this.profileForm.get('aliases') as FormArray; }
  addAlias() { this.aliases.push(this.fb.control('')); }
}
```

```html
<form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
  <input formControlName="firstName" />
  <div formGroupName="address"><input formControlName="street" /></div>
  <div formArrayName="aliases">
    @for (ctrl of aliases.controls; track $index; let i = $index) {
      <input [formControlName]="i" />
    }
  </div>
  <button type="submit" [disabled]="!profileForm.valid">Submit</button>
</form>
```

**State:** `form.value` (Partial, excludes disabled) / `getRawValue()` (full) / `.status` `'VALID'|'INVALID'|'PENDING'|'DISABLED'`

**Updating:** `control.setValue('x')` (full, strict) / `form.patchValue({...})` (partial)

**Programmatic state:**
```ts
form.markAllAsTouched(); form.markAsPristine(); form.markAsDirty();
control.setValue(val, { emitEvent: false });
control.updateValueAndValidity({ onlySelf: true });
```

**Typed Forms:**
```ts
const email = new FormControl('', { nonNullable: true }); // resets to initial, not null
const fb = inject(NonNullableFormBuilder);                 // all controls nonNullable
const addresses = new FormRecord<FormControl<string | null>>({});
addresses.addControl('home', new FormControl('123 Main St'));
// Optional controls for dynamic groups:
const login = new FormGroup<{ email: FormControl<string>; password?: FormControl<string> }>({ ... });
login.removeControl('password'); // TypeScript allows only optional controls
```

**Validators:**
```ts
// Built-in: Validators.required, .email, .minLength(n), .maxLength(n), .pattern(re), .min(n), .max(n)

// Custom sync:
function forbiddenName(re: RegExp): ValidatorFn {
  return (c: AbstractControl) => re.test(c.value) ? { forbiddenName: { value: c.value } } : null;
}

// Custom async (injectable):
@Injectable({ providedIn: 'root' })
export class UniqueRoleValidator implements AsyncValidator {
  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.actorsService.isRoleTaken(control.value).pipe(
      map(taken => taken ? { uniqueRole: true } : null),
      catchError(() => of(null)),
    );
  }
}

// Cross-field (on FormGroup):
const form = new FormGroup({ name: new FormControl(''), role: new FormControl('') }, {
  validators: (c) => c.get('name')?.value === c.get('role')?.value ? { nameEqualsRole: true } : null
});

// Dynamic management:
ctrl.addValidators([...]); ctrl.removeValidators([...]); ctrl.clearValidators();
ctrl.addAsyncValidators(fn); ctrl.clearAsyncValidators();
ctrl.updateValueAndValidity(); // required after any change!
```

> Optimize async validators: use `updateOn: 'blur'` or `updateOn: 'submit'`.

**Events stream:**
```ts
form.events.subscribe(e => {
  if (e instanceof ValueChangeEvent)   { /* e.value */ }
  if (e instanceof StatusChangeEvent)  { /* e.status */ }
  if (e instanceof TouchedChangeEvent) { /* e.touched */ }
  if (e instanceof FormSubmittedEvent) { /* submitted */ }
  if (e instanceof FormResetEvent)     { /* reset */ }
});
```

**Type guards:** `isFormControl(c)` / `isFormGroup(c)` / `isFormArray(c)` / `isFormRecord(c)`

**CSS classes (auto-applied):** `.ng-valid` · `.ng-invalid` · `.ng-pending` · `.ng-pristine` · `.ng-dirty` · `.ng-untouched` · `.ng-touched` · `.ng-submitted`

> **Zoneless apps:** Mutating `FormArray` does not auto-trigger CD. Bridge `valueChanges` to `ChangeDetectorRef.markForCheck()`.

---

## 16. Template-Driven Forms (Stable)

> Best for simple forms / rapid prototyping. Uses `[(ngModel)]`; Angular creates `FormControl`/`FormGroup` implicitly.

```ts
import { FormsModule } from '@angular/forms';
@Component({ imports: [FormsModule], ... })
export class ActorFormComponent {
  model = { name: '', studio: '', skill: '' };
  onSubmit() { /* ... */ }
}
```

```html
<form #actorForm="ngForm" (ngSubmit)="onSubmit()">
  <input name="name" [(ngModel)]="model.name" required minlength="4" #name="ngModel" />
  @if (name.invalid && (name.dirty || name.touched)) {
    @if (name.hasError('required')) { <div>Name is required.</div> }
    @if (name.hasError('minlength')) { <div>Min 4 characters.</div> }
  }
  <button type="submit" [disabled]="!actorForm.form.valid">Submit</button>
  <button type="button" (click)="actorForm.reset()">New</button>
</form>
```

- Every `[(ngModel)]` input **must** have a `name` attribute.
- `NgModelGroup` (`ngModelGroup="key"`) creates nested `FormGroup`.
- Built-in HTML5 validators work directly: `required`, `minlength`, `maxlength`, `pattern`, `email`, `min`, `max`.

**Custom validator directive:**
```ts
@Directive({
  selector: '[appForbiddenName]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => ForbiddenNameDirective), multi: true }],
})
export class ForbiddenNameDirective implements Validator {
  readonly appForbiddenName = input<string>('');
  validate(c: AbstractControl): ValidationErrors | null {
    return forbiddenNameValidator(new RegExp(this.appForbiddenName(), 'i'))(c);
  }
}
// Use useExisting (not useClass) to preserve directive inputs
```

**Cross-field validation:** Apply validator directive on `<form>` tag, check `actorForm.hasError('key')`.

**Async validator directive:** Register with `NG_ASYNC_VALIDATORS`; optimize with `[ngModelOptions]="{updateOn: 'blur'}"`.

**CSS classes** (same as Reactive Forms above).

---

## 17. Migration / Interop

```ts
// Top-down: existing FormControl inside Signal Form
const passwordControl = new FormControl('', [Validators.required]);
const model = signal({ email: '', password: passwordControl });
const f = compatForm(model); // from '@angular/forms/signals/compat'

// Bottom-up: Signal Form as FormControl
const emailControl = new SignalFormControl('', (p) => { required(p); });
const form = new FormGroup({ email: emailControl });
// Template: <input [formField]="emailControl.fieldTree" />
// Do NOT use formControlName or [formControl] with SignalFormControl
```

---

## 18. Quick Cheat Sheet

| Need | Use |
|------|-----|
| Create a form | `form(signal, schemaFn)` |
| Bind to input | `[formField]="myForm.fieldName"` |
| Read field state / value | `myForm.fieldName()` / `myForm.fieldName().value()` |
| Validate | `required/email/min/max/minLength/maxLength/pattern/validate/validateTree` |
| Async validation | `validateHttp` / `validateAsync` |
| Conditional disable/hide/readonly | `disabled/hidden/readonly(p.field, logicFn)` |
| Debounce | `debounce(p.field, 300)` |
| Compose schemas | `apply/applyWhen/applyWhenValue/applyEach/schema()` |
| Submit | `[formRoot]` directive or `submit()` function |
| Reset | `field().reset(newValue?)` |
| Domain ↔ form | `linkedSignal({ source, computation })` |

---

## 19. Common Pitfalls

- `undefined` / optional fields (`?`) **break the field tree**.
- Dynamic model structure (union types with different shapes) → use static structure + `hidden()`.
- Don't read `valid()` after `await` in async effects without proper signal tracking.
- Avoid circular validation: don't read a field's parent validity inside that field's validator.
- Custom controls must **not** implement validation – put it in the schema.
- `SignalFormControl.disable()`, `.enable()`, `addValidators()` throw errors – use `disabled()` rule instead.
- Always return `false` (not just falsy) to enable a conditionally disabled field.
- `@for` over array fields: track by **field identity** (`track field`, not `track $index`).

