# Angular Template Guidelines

This document defines template and component code rules for the CipherDisk Angular client.

## Control Flow Standard

Do not use deprecated structural attributes in templates:
- `*ngIf`
- `*ngFor`

Use Angular built-in control flow blocks instead:
- `@if` / `@else`
- `@for`

Example:

```html
@if (isLoading) {
  <p>Loading...</p>
} @else {
  @for (item of items; track item.id) {
    <div>{{ item.name }}</div>
  }
}
```

## Tracking Rule for Lists

When using `@for`, always include an explicit `track` expression.

Preferred order:
1. Stable unique key from data (for example `item.id`).
2. If there is no stable key, use `$index` only for static lists.

## Angular Material Note

Keep Angular Material structural directives (for example `*matCellDef`, `*matHeaderCellDef`, `*matRowDef`, `*matNoDataRow`) unless Angular Material deprecates them separately. These are not replacements for `@if` or `@for`.

## Component Architecture Standard

Use standalone components instead of NgModule for new Angular UI development.

Preferred approach:
1. Create components with `standalone: true`.
2. Declare dependencies in the component `imports` array.
3. Use NgModule only when required for legacy integration that cannot be migrated yet.

## Async Code Standard

Prefer `async/await` for one-shot async flows in component code.

Preferred approach:
1. Use `firstValueFrom(...)` with `HttpClient` calls that resolve once.
2. Use `try/catch/finally` for readable success, error, and cleanup handling.
3. Use RxJS streams when the data source is continuous or needs composition (for example `valueChanges`, polling, websocket streams).

Example:

```ts
async loadItems() {
  this.isLoading.set(true);
  this.errorMessage.set('');

  try {
    const items = await firstValueFrom(this.http.get<Item[]>('/api/items'));
    this.items.set(items ?? []);
  } catch {
    this.errorMessage.set('Unable to load items.');
  } finally {
    this.isLoading.set(false);
  }
}
```

## State and Change Detection Standard

Use Angular signals as the default state mechanism for component-local UI state.

Preferred approach:
1. Use `signal(...)` for mutable local state (loading flags, selected filters, error messages).
2. Use `computed(...)` for derived values.
3. Use RxJS for async data flows and transform streams as needed, then map into signals when rendering state in templates.
4. Avoid manual `NgZone` and `ChangeDetectorRef` unless integrating with third-party code that runs outside Angular change detection.

Template usage rule:
1. Read signal values with `signalName()` in templates.

## Form Standard

Use Angular Reactive Forms as the default for data-entry forms.

Preferred approach:
1. Use `ReactiveFormsModule`, `formGroup`, and `formControlName` for dialogs and page-level data forms.
2. Use validators in form model definitions (`Validators.required`, `Validators.email`, `Validators.min`, `Validators.maxLength`, and similar) instead of ad-hoc submit checks.
3. Keep submit buttons bound to form validity and call `markAllAsTouched()` on invalid submit attempts.
4. Use `[(ngModel)]` only for lightweight UI state that is not a data-entry form (for example temporary visual toggles), and avoid mixing `ngModel` with reactive form controls in the same form.

Example:

```ts
readonly form = this.fb.nonNullable.group({
  userName: ['', [Validators.required, Validators.maxLength(120)]],
  email: ['', [Validators.required, Validators.email]],
  isEnabled: [true]
});

submit() {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const payload = this.form.getRawValue();
  // send payload
}
```

## Feature Folder Structure Standard

Organize Angular components in folders by feature instead of grouping files only by artifact type.

Preferred approach:
1. Keep files for the same feature together in a dedicated feature folder.
2. Place the component, template, styles, related models, and feature-specific helpers close to that feature.
3. Share code across features only when it is genuinely reusable, and place that code in an appropriate shared location.

## Review Checklist

Before merging template changes:
1. Confirm no new `*ngIf` or `*ngFor` is introduced.
2. Confirm each `@for` has an appropriate `track` expression.
3. Confirm template diagnostics have no new errors.
4. Confirm new components are standalone unless there is a documented legacy exception.
5. Confirm new Angular components are placed under a feature-oriented folder structure.
6. Confirm one-shot async operations follow `async/await` with `try/catch/finally`.
7. Confirm component-local UI state uses signals, and avoid manual change-detection forcing unless justified.
8. Confirm data-entry forms use Reactive Forms and do not introduce `[(ngModel)]` for form fields.
