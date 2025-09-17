import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export type ViewportSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const useGetViewPortSize = (): ViewportSize => {
    const theme = useTheme();

    const isXl = useMediaQuery(theme.breakpoints.only('xl'));
    const isLg = useMediaQuery(theme.breakpoints.only('lg'));
    const isMd = useMediaQuery(theme.breakpoints.only('md'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));

    if (isXl) return 'xl';
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    if (isXs) return 'xs';

    return 'md';
};