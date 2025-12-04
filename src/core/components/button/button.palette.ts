export const buttonPalette = {
  primary: {
    solid: {
      default: {
        background: "var(--logile-bg-primary)",
        color: "var(--logile-text-white)",
        borderRadius: "var(--radius-m)",
      },
      hover: {
        background: "var(--logile-bg-primary-bold)",
      },
      pressed: {
        borderRadius: "var(--radius-m)",
        background: "var(--logile-bg-primary)",
        boxShadow:
          "1px 1px 2px 0 var(--logile-gray-light-5a) inset, -1px -1px 2px 0 var(--logile-white-4a)) inset",
      },
      focus: {
        borderRadius: "var(--radius-m)",
        background: "var(--logile-bg-primary)",
        boxShadow:
          "0 0 0 2px var(--logile-bg-base), 0 0 0 4px var(--logile-focus-ring-default)",
      },
      disabled: {
        background: "var(--logile-bg-state-disabled)",
        color: "var(--logile-text-state-disabled)",
      },
    },
    outline: {
      default: {
        borderRadius: "var(--radius-m)",
        border: "1px solid var(--logile-border-brand-primary)",
        background: "var(--logile-bg-container-1)",
        color: "var(--logile-text-brand-primary)",
      },
      hover: {
        background: "var(--logile-bg-primary-x-subtle)",
      },
      pressed: {
        boxShadow:
          "1px 1px 2px 0 var(--logile-gray-light-5a) inset, -1px -1px 2px 0 var(--logile-white-4a) inset",
      },
      focus: {
        boxShadow:
          "0 0 0 2px var(--logile-bg-base), 0 0 0 4px var(--logile-focus-ring-default)",
      },
      disabled: {
        border: "1px solid var(--logile-border-state-disabled)",
        color: "var(--logile-text-state-disabled)",
      },
    },
    text: {
      default: {
        color: "var(--logile-text-brand-primary)",
      },
      hover: {
        textDecorationLine: "underline",
      },
      pressed: {
        boxShadow:
          "1px 1px 2px 0 var(--logile-gray-light-5a) inset, -1px -1px 2px 0 var(--logile-white-4a) inset",
      },
      focus: {
        background: "var(--logile-bg-container-1)",
        boxShadow:
          "0 0 0 2px var(--logile-bg-base), 0 0 0 4px var(--logile-focus-ring-default)",
      },
      disabled: {
        color: "var(--logile-text-state-disabled)",
      },
    },
  },

  secondary: {
    solid: {
      default: {
        borderRadius: "var(--radius-m)",
        background: "var(--logile-bg-surface-bold)",
        color: "var(--logile-text-white)",
      },
      hover: {
        background: "var(--logile-bg-surface-x-bold)",
      },
      pressed: {
        boxShadow:
          "1px 1px 2px 0 var(--logile-gray-light-5a) inset, -1px -1px 2px 0 var(--logile-white-4a) inset",
      },
      focus: {
        boxShadow:
          "0 0 0 2px var(--logile-bg-base), 0 0 0 4px var(--logile-focus-ring-default)",
      },
      disabled: {
        background: "var(--logile-bg-state-disabled)",
        color: "var(--logile-text-state-disabled)",
      },
    },
    outline: {
      default: {
        borderRadius: "var(--radius-m)",
        border: "1px solid var(--logile-border-secondary)",
        background: "var(--logile-bg-container-1)",
        color: "var(--logile-text-primary)",
      },
      hover: {
        background: "var(--logile-bg-base)",
      },
      pressed: {
        boxShadow:
          "1px 1px 2px 0 var(--logile-gray-light-5a) inset, -1px -1px 2px 0 var(--logile-white-4a) inset",
      },
      focus: {
        boxShadow:
          "0 0 0 2px var(--logile-bg-base), 0 0 0 4px var(--logile-focus-ring-default)",
      },
      disabled: {
        border: "1px solid var(--logile-border-state-disabled)",
        color: "var(--logile-text-state-disabled)",
      },
    },
    text: {
      default: {
        borderRadius: "var(--radius-m, 8px)",
        color: "var(--logile-text-primary)",
      },
      hover: {
        textDecorationLine: "underline",
      },
      pressed: {
        boxShadow:
          "1px 1px 2px 0 var(--logile-gray-light-5a) inset, -1px -1px 2px 0 var(--logile-white-4a) inset",
      },
      focus: {
        background: "var(--logile-bg-container-1)",
        boxShadow:
          "0 0 0 2px var(--logile-bg-base), 0 0 0 4px var(--logile-focus-ring-default)",
      },
      disabled: {
        color: "var(--logile-text-state-disabled)",
      },
    },
  },

  destructive: {
    solid: {
      default: {
        borderRadius: "var(--radius-m)",
        background: "var(--logile-bg-state-violation)",
        color: "var(--logile-text-white)",
      },
      hover: {
        background: "var(--logile-bg-state-violation-bold)",
      },
      pressed: {
        boxShadow:
          "1px 1px 2px 0 var(--logile-gray-light-5a) inset, -1px -1px 2px 0 var(--logile-white-4a) inset",
      },
      focus: {
        boxShadow:
          "0 0 0 2px var(--logile-bg-base), 0 0 0 4px var(--logile-focus-ring-error)",
      },
      disabled: {
        background: "var(--logile-bg-state-disabled)",
        color: "var(--logile-text-state-disabled)",
      },
    },
    outline: {
      default: {
        borderRadius: "var(--radius-m)",
        border: "1px solid var(--logile-border-state-violation)",
        color: "var(--logile-text-state-violation)",
        background: "var(--logile-bg-container-1)",
      },
      hover: {
        border: "1px solid var(--logile-border-state-violation-bold)",
        background: "var(--logile-bg-state-violation-alpha)",
      },
      pressed: {
        boxShadow:
          "1px 1px 2px 0 var(--logile-gray-light-5a) inset, -1px -1px 2px 0 var(--logile-white-4a) inset",
      },
      focus: {
        boxShadow:
          "0 0 0 2px var(--logile-bg-base), 0 0 0 4px var(--logile-focus-ring-error)",
      },
      disabled: {
        border: "1px solid var(--logile-border-state-disabled-subtle)",
        color: "var(--logile-text-state-disabled)",
      },
    },
    text: {
      default: {
        borderRadius: "var(--radius-m)",
        background: "var(--logile-bg-container-1)",
        color: "var(--logile-text-state-violation)",
      },
      hover: {
        textDecorationLine: "underline",
      },
      pressed: {
        boxShadow:
          "1px 1px 2px 0 var(--logile-gray-light-5a) inset, -1px -1px 2px 0 var(--logile-white-4a) inset",
      },
      focus: {
        boxShadow:
          "0 0 0 2px var(--logile-bg-base), 0 0 0 4px var(--logile-focus-ring-error)",
      },
      disabled: {
        color: "var(--logile-text-state-disabled)",
      },
    },
  },
};
