export const checkboxPalette = {
  default: {
    normal: {
      default: {
        root: { background: "transparent" },
        icon: { stroke: "var(--logile-border-primary)", fill: "transparent" },
      },
      hover: {
        root: { background: "transparent" },
        icon: {
          stroke: "var(--logile-border-brand-primary-bold)",
          fill: "transparent",
        },
      },
      focus: {
        root: { background: "transparent" },
        icon: {
          stroke: "var(--logile-border-primary)",
          fill: "transparent",
          boxShadow: "0 0 0 2px var(--logile-focus-ring-default)",
          borderRadius: "var(--radius-xs)",
        },
      },
      disabled: {
        root: { background: "transparent" },
        icon: {
          stroke: "var(--logile-border-state-disabled)",
          fill: "transparent",
        },
      },
    },
    error: {
      default: {
        root: { background: "transparent" },
        icon: {
          stroke: "var(--logile-border-state-violation)",
          fill: "transparent",
        },
      },
      hover: {
        root: { background: "transparent" },
        icon: {
          stroke: "var(--logile-border-state-violation-bold)",
          fill: "transparent",
        },
      },
      focus: {
        root: { background: "transparent" },
        icon: {
          stroke: "var(--logile-border-state-violation)",
          fill: "transparent",
          boxShadow: "0 0 0 2px var(--logile-focus-ring-error)",
          borderRadius: "var(--radius-s)",
        },
      },
      disabled: {
        root: { background: "transparent" },
        icon: {
          stroke: "var(--logile-border-state-violation-subtle)",
          fill: "transparent",
        },
      },
    },
  },

  /* Checked state */
  checked: {
    normal: {
      default: {
        root: { background: "var(--logile-bg-primary)" },
        icon: { fill: "var(--logile-bg-primary)", stroke: "transparent" },
      },
      hover: {
        root: { background: "var(--logile-bg-primary)" },
        icon: {
          fill: "var(--logile-bg-primary)",
          stroke: "var(--logile-border-brand-primary-bold)",
        },
      },
      focus: {
        root: { background: "var(--logile-bg-primary)" },
        icon: {
          fill: "var(--logile-bg-primary)",
          stroke: "none",
          outline: "none",
          boxShadow: "0 0 0 2px var(--logile-focus-ring-default)",
          borderRadius: "var(--radius-xs)",
        },
      },
      disabled: {
        root: { background: "var(--logile-bg-primary)" },
        icon: { fill: "var(--logile-border-state-disabled)" },
      },
    },
    error: {
      default: {
        root: { background: "var(--logile-bg-state-violation)" },
        icon: {
          stroke: "var(--logile-border-state-violation)",
          fill: "var(--logile-bg-state-violation)",
        },
      },
      hover: {
        root: { background: "var(--logile-bg-state-violation)" },
        icon: {
          stroke: "var(--logile-border-state-violation-bold)",
          fill: "var(--logile-bg-state-violation-bold)",
          borderRadius: "var(--radius-xs)",
        },
      },
      focus: {
        root: { background: "var(--logile-bg-state-violation)" },
        icon: {
          stroke: "var(--logile-border-state-violation)",
          fill: "var(--logile-bg-state-violation)",
          boxShadow: "0 0 0 2px var(--logile-focus-ring-error)",
          borderRadius: "var(--radius-s)",
        },
      },
      disabled: {
        root: { background: "var(--logile-bg-state-violation-alpha)" },
        icon: {
          stroke: "var(--logile-border-state-violation-subtle)",
          fill: "var(--logile-bg-state-violation-subtle)",
        },
      },
    },
  },

  /* Intermidate State */
  intermediate: {
    normal: {
      default: {
        root: { background: "var(--logile-bg-primary)" },
        icon: { fill: "var(--logile-bg-primary)", stroke: "transparent" },
      },
      hover: {
        root: { background: "var(--logile-bg-primary)" },
        icon: {
          fill: "var(--logile-bg-primary)",
          stroke: "var(--logile-border-brand-primary-bold)",
        },
      },
      focus: {
        root: { background: "var(--logile-bg-primary)" },
        icon: {
          fill: "var(--logile-bg-primary)",
          stroke: "none",
          outline: "none",
          boxShadow: "0 0 0 2px var(--logile-focus-ring-default)",
          borderRadius: "var(--radius-xs)",
        },
      },
      disabled: {
        root: { background: "var(--logile-bg-primary)" },
        icon: { fill: "var(--logile-border-state-disabled)" },
      },
    },
    error: {
      default: {
        root: { background: "var(--logile-bg-state-violation)" },
        icon: {
          stroke: "var(--logile-border-state-violation)",
          fill: "var(--logile-bg-state-violation)",
        },
      },
      hover: {
        root: { background: "var(--logile-bg-state-violation)" },
        icon: {
          stroke: "var(--logile-border-state-violation-bold)",
          fill: "var(--logile-bg-state-violation-bold)",
          borderRadius: "var(--radius-xs)",
        },
      },
      focus: {
        root: { background: "var(--logile-bg-state-violation)" },
        icon: {
          stroke: "var(--logile-border-state-violation)",
          fill: "var(--logile-bg-state-violation)",
          boxShadow: "0 0 0 2px var(--logile-focus-ring-error)",
          borderRadius: "var(--radius-s)",
        },
      },
      disabled: {
        root: { background: "var(--logile-bg-state-violation-alpha)" },
        icon: {
          stroke: "var(--logile-border-state-violation-subtle)",
          fill: "var(--logile-bg-state-violation-subtle)",
        },
      },
    },
  },
};
