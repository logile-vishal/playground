import { styled, Switch } from "@mui/material";

export const StyledSwitch = styled(Switch)(({ theme }) => ({
  width: "var(--size-7)",
  height: "var(--size-4)",
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: "var(--size-4)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: "var(--space-xxs)",
    "&.Mui-checked": {
      transform: "translateX(var(--size-3))",
      color: "var(--logile-icon-white)",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "var(--logile-bg-primary)",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: "var(--size-3)",
    height: "var(--size-3)",
    borderRadius: "var(--radius-s)",
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    backgroundColor: "var(--logile-utility-gray-700)",
    opacity: 1,
    boxSizing: "border-box",
  },
}));
