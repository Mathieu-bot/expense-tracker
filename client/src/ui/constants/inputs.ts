// Shared UI input constants (Tailwind literal classes only)

export type InputSize = 'small' | 'medium' | 'large';

// Heights are approximate based on padding + line-height:
// - large ≈56px (previous default for inputs)
// - medium ≈52px (new default)
// - small ≈48px
export const SIZE_PADDING_MAP: Record<InputSize, string> = {
  large: 'px-4 py-3.5 text-base',
  medium: 'px-4 py-3 text-base',
  small: 'px-4 py-2.5 text-sm',
};

// Floating label base used by inputs that implement a Material-like label.
// Keep as a literal string so Tailwind can see all classes.
export const LABEL_BASE = (
  `pointer-events-none absolute z-10 transition-all duration-150
    -top-1 translate-y-0 text-xs text-gray-700 font-medium px-1
    peer-focus:-top-1 peer-focus:text-xs peer-focus:text-accent dark:peer-focus:text-primary peer-focus:translate-y-0 peer-focus:px-1
    peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-base
    peer-placeholder-shown:text-gray-500 peer-placeholder-shown:font-normal peer-placeholder-shown:px-0`
).trim().replace(/\s+/g, ' ');

// Common input base classes that many inputs can share (optional).
export const INPUT_BASE = (
  'peer block w-full rounded-md border'
);

export const INPUT_RING_BASE = (
  'bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300'
);

export const INPUT_FOCUS_BASE = (
  'focus:outline-none focus:ring-2 focus:ring-sky-500'
);
