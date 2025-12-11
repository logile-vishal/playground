export const radioPalette = {
  unchecked: {
    default: {
      normal: {
        root: {
          color: "var(--logile-border-secondary)",
          background: "var(--logile-bg-container-1)",
        },
        icon: {},
      },
      hover: {
        root: { color: "var(--logile-border-brand-primary-alt-dark-mode)" },
        icon: {},
      },
      focus: {
        root: {
          boxShadow:
            "0 0 0 2px var(--logile-bg-container-1), 0 0 0 4px var(--logile-focus-ring-default)",
        },
        icon: {},
      },
      disabled: {
        root: { color: "var(--logile-border-state-disabled)", opacity: 1 },
        icon: {},
      },
    },

    error: {
      normal: {
        root: {
          color: "var(--logile-border-state-violation-bold-subtle)",
          background: "var(--logile-bg-container-1)",
        },
        icon: {},
      },
      hover: {
        root: { color: "var(--logile-border-state-violation-bold-subtle)" },
        icon: {},
      },
      focus: {
        root: {
          boxShadow:
            "0 0 0 2px var(--logile-bg-container-1), 0 0 0 4px var(--logile-focus-ring-error)",
        },
        icon: {},
      },
      disabled: {
        root: { color: "var(--logile-border-state-disabled)", opacity: 1 },
        icon: {},
      },
    },
  },
  checked: {
    default: {
      normal: {
        root: {
          color: "var(--logile-border-brand-primary-alt-dark-mode)",
        },
        icon: {},
      },
      hover: {
        root: {},
        icon: {},
      },
      focus: {
        root: {
          border: "1px solid var(--logile-focus-ring-default)",
        },
        icon: {},
      },
      disabled: {
        root: { color: "var(--logile-border-state-disabled)", opacity: 1 },
        icon: {},
      },
    },

    error: {
      normal: {
        root: { color: "var(--logile-border-state-violation-bold-subtle)" },
        icon: {},
      },
      hover: {
        root: {},
        icon: {},
      },
      focus: {
        root: { border: "1px solid var(--logile-focus-ring-error)" },
        icon: {},
      },
      disabled: {
        root: { color: "var(--logile-border-state-disabled)", opacity: 1 },
        icon: {},
      },
    },
  },
};
