# GitHub Copilot Instructions

This file provides custom instructions for GitHub Copilot when working in this repository.

## Code Review Instructions

When performing a code review, check that imports follow this order:
1. React and third-party libraries (react, @mui, date-fns, react-i18next, etc.)
2. Core services, components, hooks, types and constants (@/core/*, @/utils/*)
3. Relative imports (./styles, ./Component.scss)

When performing a code review, flag any SCSS/CSS imports that are not at the end of the import block.

When performing a code review, flag any use of `any` type - suggest using `unknown` instead.

When performing a code review, flag any default exports - the project uses named exports only.

When performing a code review, flag components over 200 lines and suggest splitting them.

When performing a code review, flag any inline styles - suggest using SCSS modules instead.

When performing a code review, flag any `console.log` statements - suggest removing or using proper logging.

When performing a code review, flag any magic numbers - suggest defining constants instead.

When performing a code review, flag any commented-out code and suggest removing it.

When performing a code review, flag any class components - suggest converting to functional components with hooks.

When performing a code review, ensure all user-facing text uses the `useTranslation` hook.

When performing a code review, check that TypeScript functions have explicit type annotations for parameters and return types.

When performing a code review, flag any use of `interface` for object shapes - suggest using `type` instead.

When performing a code review, flag any use of `let` that could be `const` - prefer `const` by default.

When performing a code review, ensure React component files use PascalCase naming (e.g., `MyComponent.tsx`).

When performing a code review, check that CSS classes follow BEM naming convention.

When performing a code review, flag any hardcoded color values - suggest using CSS variables from `styles/_colors.scss`.

When performing a code review, check that commit messages follow conventional commits format (feat:, fix:, refactor:, docs:, test:, chore:).

When performing a code review, flag any form handling not using React Hook Form.

When performing a code review, flag any date handling not using date-fns library.

When performing a code review, flag any icon imports not from `src/assets/icons` - suggest using custom SVG icons.

When performing a code review, ensure translation keys are descriptive (e.g., `templateLibrary.button.createNew`).

## Project Overview

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: SCSS with MUI (Material-UI)
- **Internationalization**: i18next

## Code Style Guidelines

### TypeScript

- Always use explicit type annotations for function parameters and return types
- Prefer `type` over `interface` for object shapes
- Use `const` by default, `let` only when reassignment is needed
- Never use `any` - use `unknown` if the type is truly unknown

### React Components

- Use functional components with hooks (no class components)
- Name components using PascalCase (e.g., `MyComponent.tsx`)
- Keep components small and focused on a single responsibility
- Use named exports instead of default exports

```tsx
// ✅ Good
export const MyComponent: React.FC<MyComponentProps> = ({ prop1, prop2 }) => {
  return <div>{/* content */}</div>;
};

// ❌ Avoid
export default function MyComponent() {}
```

<!-- ### File Structure

- Place component files in their own folder with related files:
  ```
  my-component/
    MyComponent.tsx
    MyComponent.scss
    MyComponent.test.tsx
    index.ts
  ``` -->

### Styling

- Use SCSS modules for component-specific styles
- Follow BEM naming convention for CSS classes
- Use CSS variables from `styles/_colors.scss` for colors

### Imports

- Group imports in this order:
  1. React and third-party libraries
  2. Core services, components, hooks, types and constants etc.
  3. Relative imports

```tsx
// React & third-party
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Core services, components, hooks, types and constants etc.
import { Button } from '@/core/components/button';
import { useAuth } from '@/core/hooks';
import type { UserProps } from '@/core/types';

// Relative imports
import './MyComponent.scss';
```

<!-- ## Testing Guidelines

- Write unit tests for utility functions
- Write integration tests for components
- Use descriptive test names: `it('should render loading state when data is fetching')` -->

## Git Commit Messages

- Use conventional commits format:
  - `feat:` for new features
  - `fix:` for bug fixes
  - `refactor:` for code refactoring
  - `docs:` for documentation
  - `test:` for tests
  - `chore:` for maintenance tasks

## Do NOT

- Use inline styles unless absolutely necessary
- Create components with more than 200 lines
- Use `console.log` in production code (use proper logging)
- Commit commented-out code
- Use magic numbers - define constants instead

## Preferred Libraries

- Form Handling: React Hook Form
- Date Handling: date-fns
- Icons: Custom SVG icons in `src/assets/icons`

## Translation

- All user-facing text must be translated using `useTranslation` hook
- Translation keys should be descriptive: `templateLibrary.button.createNew`
- Place translations in appropriate namespace files under `public/locales/`
