/// <reference types="vitest" />
import '@testing-library/jest-dom'

declare global {
  namespace Vi {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toBeVisible(): R
      toHaveClass(className: string): R
    }
  }
}
