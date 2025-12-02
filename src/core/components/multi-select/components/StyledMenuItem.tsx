import { MenuItem, styled } from "@mui/material";

const StyledMenuItem = styled(MenuItem)({
  padding: "var(--space-m) var(--space-xl) var(--space-m) var(--space-m)",
  display: "flex",
  alignItems: "center",
  gap: "var(--space-m)",
  borderRadius: "var(--space-m)",
  cursor: "pointer",
  margin: "0 var(--space-xs) 0 var(--space-xs)",
  fontSize: "var(--logile-size-body)",
  color: "var(--logile-text-primary)",
  fontWeight: "var(--logile-weight-400)",
  "&:hover": {
    backgroundColor: "var(--logile-bg-primary-x-subtle)",
  },
  "&.Mui-selected": {
    backgroundColor: "transparent",
  },
  "&.multiselect__menuitem--selected": {
    color: "var(--logile-text-brand-primary-dark-mode-alt)",
  },
  "& .multiselect__menuitem--select-all": {
    margin: "var(--space-xl)",
  },
});
export default StyledMenuItem;
