export const textareaPalette = {
  default: {
    default: {
      root: {
        borderRadius: "var(--radius-m)",
        background: "var(--logile-bg-container-1)",
        outline: "none",
        border: "1px solid var(--logile-border-primary)",
        transition: "none",
      },
      input: {
        outline: "none",
        border: "none",
        color: "var(--logile-text-primary)",
      },
      fieldset: { border: "none", outline: "none" },
      icon: { color: "var(--logile-icon-secondary)" },
      placeholder: { color: "var(--logile-text-tertiary)" },
    },
    hover: {
      root: { border: "1px solid var(--logile-border-bold-subtle)" },
      input: {},
      fieldset: {},
      icon: {},
    },
    focus: {
      root: {
        boxShadow:
          "0 0 0 2px var(--logile-bg-container-1), 0 0 0 4px var(--logile-focus-ring-default)",
      },
      input: {},
      fieldset: {},
      icon: {},
    },
    active: {
      root: { border: "1px solid var(--logile-border-brand-primary-subtle)" },
      input: {},
      fieldset: {},
      icon: {},
    },
    disabled: {
      root: { background: "var(--logile-bg-state-disabled-subtle)" },
      input: { color: "var(--logile-text-state-disabled)" },
      fieldset: {},
      icon: {},
      placeholder: {},
    },
  },

  error: {
    default: {
      root: {
        borderRadius: "var(--radius-m)",
        background: "var(--logile-bg-container-1)",
        outline: "none",
        border: "1px solid var(--logile-border-state-violation)",
        transition: "none",
      },
      input: {
        outline: "none",
        border: "none",
        color: "var(--logile-text-primary)",
      },
      fieldset: { border: "none", outline: "none" },
      icon: { color: "var(--logile-icon-secondary)" },
      placeholder: { color: "var(--logile-text-tertiary)" },
    },
    hover: {
      root: { border: "1px solid var(--logile-border-state-violation-bold)" },
      input: {},
      fieldset: {},
      icon: {},
    },
    focus: {
      root: {
        boxShadow:
          "0 0 0 2px var(--logile-bg-container-1), 0 0 0 4px var(--logile-focus-ring-error)",
      },
      input: {},
      fieldset: {},
      icon: {},
    },
    active: {
      root: { border: "1px solid var(--logile-border-state-violation)" },
      input: {},
      fieldset: {},
      icon: {},
    },
    disabled: {
      root: {
        background: "var(--logile-bg-state-disabled-subtle)",
        border: "1px solid var(--logile-border-state-disabled)",
      },
      input: { color: "var(--logile-text-state-disabled)" },
      fieldset: {},
      icon: {},
      placeholder: {},
    },
  },
};
