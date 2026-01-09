# Vitest Setup Guide

This guide explains the test setup for your React + TypeScript project using Vitest.

## Files Created

### 1. **vitest.config.ts**

Main Vitest configuration file that:

- Integrates with Vite config
- Sets up `jsdom` environment for DOM testing
- Configures global test utilities
- Loads setup files before tests run

### 2. **src/setupTests.ts**

Global test setup file that:

- Imports `@testing-library/jest-dom` for extended matchers
- Mocks `window.matchMedia` for responsive design tests
- Mocks `IntersectionObserver` API
- Cleans up after each test

### 3. **src/vitest.d.ts**

TypeScript declarations that:

- Enables Vitest globals (describe, it, expect)
- Provides custom matchers from `@testing-library/jest-dom`

### 4. **src/test-utils/renderWithProviders.tsx**

Test utility helper that:

- Wraps components with required providers (Router, QueryClient)
- Simplifies writing tests by providing a custom render function
- Resets QueryClient between tests

### 5. **src/test-utils/mocks/**

Mock utilities for common dependencies:

- **i18nMock.ts** - Mocks i18next translations
- **assetsMock.ts** - Mocks SVG imports

### 6. **src/pages/template-library/TemplateLibrary.test.tsx**

Comprehensive test suite for TemplateLibrary component covering:

- Component rendering
- Search drawer functionality
- Directory navigation
- Data loading states
- Template selection
- Import/Export features

## Installation

Install required dependencies:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- TemplateLibrary.test.tsx

# Generate coverage report
npm test -- --coverage
```

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test-utils/renderWithProviders'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    renderWithProviders(<MyComponent />)
    expect(screen.getByText(/expected text/i)).toBeDefined()
  })
})
```

### Mocking API Calls

```typescript
vi.mock("./services/my-service", () => ({
  useMyApi: vi.fn(),
}));

// In test
const { useMyApi } = await import("./services/my-service");
(useMyApi as any).mockReturnValue({
  data: mockData,
  isLoading: false,
});
```

### Testing with User Events

```typescript
import userEvent from '@testing-library/user-event'

it('should handle click', async () => {
  const user = userEvent.setup()
  renderWithProviders(<MyComponent />)

  await user.click(screen.getByRole('button', { name: /click me/i }))

  expect(screen.getByText(/clicked/i)).toBeDefined()
})
```

### Testing Async Operations

```typescript
import { waitFor } from '@testing-library/react'

it('should load data', async () => {
  renderWithProviders(<MyComponent />)

  await waitFor(() => {
    expect(screen.getByText(/loaded/i)).toBeDefined()
  })
})
```

## Best Practices

1. **Use `renderWithProviders`** - Ensures all required providers are in place
2. **Mock external APIs** - Use `vi.mock()` for API calls and external services
3. **Test user interactions** - Use `userEvent` instead of `fireEvent` when possible
4. **Test behavior, not implementation** - Focus on what users see, not how it's built
5. **Keep tests focused** - One test = one behavior
6. **Use meaningful descriptions** - Test names should explain what they test

## Common Matchers

```typescript
// Existence
expect(element).toBeDefined();
expect(element).toBeNull();

// Content
expect(screen.getByText(/pattern/i)).toBeDefined();

// Visibility
expect(element).toBeVisible();

// Classes
expect(element).toHaveClass("my-class");

// Attributes
expect(element).toHaveAttribute("aria-label", "value");

// State
expect(checkbox).toBeChecked();
expect(button).toBeDisabled();
```

## Troubleshooting

### Module not found errors

Ensure paths in imports match `tsconfig.json` aliases (e.g., `@/` for `src/`)

### Tests hang

Use `vi.useFakeTimers()` for timer-related tests, or add timeout to `waitFor`

### Mock not working

Place mock calls at the top of the test file, before imports of the mocked module

### Missing types

Check that `src/vitest.d.ts` is included in `tsconfig.json` -> `include`
