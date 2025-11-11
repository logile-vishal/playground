export const buttonPalette = {
    primary: {
      solid: {
        default: { 
            background: "var(--bg-primary)", 
            color: "var(--text-white)", 
            borderRadius: 'var(--radius-m)',
         },
        hover: { 
            background: "var(--bg-primary-bold)", 
        },
        pressed: { 
            borderRadius: 'var(--radius-m)',
            background: 'var(--bg-primary)',
            boxShadow: '1px 1px 2px 0 var(--gray-light-5a) inset, -1px -1px 2px 0 var(--white-4a)) inset'
        },
        focus: { 
            borderRadius: "var(--radius-m)",
            background: "var(--bg-primary)", 
            boxShadow: "0 0 0 2px var(--bg-base), 0 0 0 4px var(--focus-ring-default)" 
        },
        disabled: { 
            background: "var(--bg-state-disabled)",
            color: "var(--text-state-disabled)",
         },
      },
      outline: {
        default: {
            borderRadius: 'var(--radius-m)',
            border: '1px solid var(--border-brand-primary)',
            background: 'var(--bg-container-1)',
            color: "var(--text-brand-primary)",
        },
        hover: {
            background: 'var(--bg-primary-x-subtle)',
         },
        pressed: { 
            boxShadow: "1px 1px 2px 0 var(--gray-light-5a) inset, -1px -1px 2px 0 var(--white-4a) inset"
         },
        focus: {
            boxShadow: "0 0 0 2px var(--bg-base), 0 0 0 4px var(--focus-ring-default)"
         },
        disabled: { 
            border: "1px solid var(--border-state-disabled)",
            color: "var(--text-state-disabled)",
        },
      },
      text: {
        default: { 
           color: "var(--text-brand-primary)",
         },
        hover: { 
           textDecorationLine: "underline",
         },
        pressed: { 
            boxShadow: "1px 1px 2px 0 var(--gray-light-5a) inset, -1px -1px 2px 0 var(--white-4a) inset"
         },
        focus: {
            background: "var(--bg-container-1)",
            boxShadow: "0 0 0 2px var(--bg-base), 0 0 0 4px var(--focus-ring-default)",
         },
        disabled: { 
            color: "var(--text-state-disabled)",
         },
      },
    },

    secondary: {
      solid: {
        default: { 
            borderRadius: "var(--radius-m)",
            background: "var(--bg-surface-bold)",
            color: "var(--text-white)",
        },
        hover: { 
            background: "var(--bg-surface-x-bold)"
        },
        pressed: {
          boxShadow: "1px 1px 2px 0 var(--gray-light-5a) inset, -1px -1px 2px 0 var(--white-4a) inset"
        },
        focus: { 
            boxShadow: "0 0 0 2px var(--bg-base), 0 0 0 4px var(--focus-ring-default)"
         },
        disabled: { 
            background: "var(--bg-state-disabled)",
            color: "var(--text-state-disabled)",
        },
      },
      outline: {
        default: {
            borderRadius: "var(--radius-m)",
            border: "1px solid var(--border-secondary)",
            background: "var(--bg-container-1)",
            color: "var(--text-primary)",
        },
        hover: { 
            background: "var(--bg-base)"
         },
        pressed: { 
            boxShadow: "1px 1px 2px 0 var(--gray-light-5a) inset, -1px -1px 2px 0 var(--white-4a) inset"
         },
        focus: { 
            boxShadow: "0 0 0 2px var(--bg-base), 0 0 0 4px var(--focus-ring-default)"
         },
        disabled: { 
            border: "1px solid var(--border-state-disabled)",
            color: "var(--text-state-disabled)",
         },
      },
      text: {
        default: { 
            borderRadius: "var(--radius-m, 8px)",
            color: "var(--text-primary)",
         },
        hover: { 
            textDecorationLine: "underline"
         },
        pressed: { 
            boxShadow: "1px 1px 2px 0 var(--gray-light-5a) inset, -1px -1px 2px 0 var(--white-4a) inset"
         },
        focus: { 
            background: "var(--bg-container-1)",
            boxShadow: "0 0 0 2px var(--bg-base), 0 0 0 4px var(--focus-ring-default)",
        },
        disabled: { 
            color: "var(--text-state-disabled)",
         },
      },
    },

    destructive: {
      solid: {
        default: { 
            borderRadius: "var(--radius-m)",
            background: "var(--bg-state-violation)",
            color: "var(--text-white)",
         },
        hover: { 
            background: "var(--bg-state-violation-bold)",
         },
        pressed: {
           boxShadow: "1px 1px 2px 0 var(--gray-light-5a) inset, -1px -1px 2px 0 var(--white-4a) inset"
         },
        focus: {
            boxShadow: "0 0 0 2px var(--bg-base), 0 0 0 4px var(--focus-ring-error)"
         },
        disabled: { 
          background: "var(--bg-state-disabled)",
          color: "var(--text-state-disabled)",
        },
      },
      outline: {
        default: {
            borderRadius: "var(--radius-m)",
            border: "1px solid var(--border-state-violation)",
            color: "var(--text-state-violation)",
            background: "var(--bg-container-1)",
         },
        hover: { 
            border: "1px solid var(--border-state-violation-bold)",
            background: "var(--bg-state-violation-alpha)",
         },
        pressed: { 
            boxShadow: "1px 1px 2px 0 var(--gray-light-5a) inset, -1px -1px 2px 0 var(--white-4a) inset"
         },
        focus: { 
            boxShadow: "0 0 0 2px var(--bg-base), 0 0 0 4px var(--focus-ring-error)"
         },
        disabled: {
          border: "1px solid var(--border-state-disabled-subtle)",
          color: "var(--text-state-disabled)",
         },
      },
      text: {
        default: { 
          borderRadius: "var(--radius-m)",
          background: "var(--bg-container-1)",
          color: "var(--text-state-violation)",
        },
        hover: { 
          textDecorationLine: "underline",
         },
        pressed: { 
            boxShadow: "1px 1px 2px 0 var(--gray-light-5a) inset, -1px -1px 2px 0 var(--white-4a) inset"
        },
        focus: {
           boxShadow: "0 0 0 2px var(--bg-base), 0 0 0 4px var(--focus-ring-error)"
         },
        disabled: { 
          color: "var(--text-state-disabled)",
        },
      },
    },
};
