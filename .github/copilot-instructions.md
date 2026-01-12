# GitHub Copilot Instructions

This file provides custom instructions for GitHub Copilot when working in this repository.

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
