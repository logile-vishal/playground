import { Select, styled } from '@mui/material';

const StyledMuiSelect = styled(Select)({
  border: '0px',
  height: '36px', //TODO: UPDATE ONCE DESIGN TEAM PROVIDES VARIABLE
  padding: 'var(--space-xs) var(--space-m) var(--space-xs) var(--space-m)',
  gap: 'var(--space-xs)',

  '&.multiselect__menuitem--selected.Mui-selected:hover': {
    backgroundColor: 'var(--bg-primary-x-subtle)',
  },
  '&:focus-visible': {
    boxShadow: 'none',
    backgroundColor: 'var(--bg-container-1)',
    outline: '1px solid var(--border-brand-primary-focus)',
  },
  '&:active': {
    boxShadow: 'none',
    backgroundColor: 'var(--bg-container-1)',
    outline: 'unset',
  },

  '& > ul.MuiMenu-list': {
    paddingTop: 0,
  },
});
export default StyledMuiSelect;
