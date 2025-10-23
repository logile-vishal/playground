export const ToastVariant = {
    Filled: 'filled',
    Light: 'light',
    Lighter: 'lighter',
    Stroke: 'stroke'
};
export type ToastVariantType = typeof ToastVariant[keyof typeof ToastVariant];