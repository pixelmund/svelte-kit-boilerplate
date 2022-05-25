export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export const BUTTON_SIZE_CLASSES = {
    small: 'px-3 py-2 leading-4 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-4 py-2 text-base'
};

export const BUTTON_VARIANT_CLASSES = {
    primary:
        'border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    secondary:
        'border border-transparent text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:ring-indigo-500',
    ghost:
        'border border-gray-300 text-gray-700 bg-transparent hover:text-gray-800 focus:ring-indigo-500'
};