import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { ViewportSize } from '@/core/types/viewport.type';

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

const DESKTOP_VIEWPORTS: ViewportSize[] = ['xl', 'lg'];

/**
 * @function IsDesktopViewport Determines whether the current viewport size matches a desktop breakpoint.
 * @returns {boolean} `true` if the viewport size is considered desktop, otherwise `false`.
 */
export const IsDesktopViewport = () => {
    const viewportSize = useGetViewPortSize();
    return DESKTOP_VIEWPORTS.includes(viewportSize);
}