import React, { forwardRef, useMemo, useRef, useState } from 'react';

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonClasses {
  root?: string;
  label?: string;
  startIcon?: string;
  endIcon?: string;
  loader?: string;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: ButtonSize;
  fullWidth?: boolean;
  disableRipple?: boolean;
  loading?: boolean;
  loadingPosition?: 'start' | 'end' | 'center';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  classes?: ButtonClasses;
}

const sizeStyles: Record<ButtonSize, string> = {
  small: 'h-[32px] text-sm px-3 py-1.5',
  medium: 'h-[36px] text-sm px-4 py-2',
  large: 'h-[42px] text-base px-5 py-2.5',
};

const rippleDurationMs = 550;

const Spinner = () => (
  <svg
  className="w-6 h-6 animate-spin"
  viewBox="0 0 50 50"
  fill="currentColor"
>
  {Array.from({ length: 12 }).map((_, i) => {
    const angle = (i * 30);
    const opacity = 1 - i * 0.08;
    return (
      <rect
        key={i}
        x="22"
        y="6"
        width="6"
        height="12"
        rx="3"
        ry="3"
        transform={`rotate(${angle} 25 25)`}
        fill="currentColor"
        opacity={opacity}
      />
    );
  })}
</svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  size = 'medium',
  fullWidth = false,
  disableRipple = false,
  loading = false,
  loadingPosition = 'center',
  startIcon,
  endIcon,
  className = '',
  onMouseDown,
  onClick,
  disabled,
  classes,
  ...props
}, ref) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const mergedRef = (node: HTMLButtonElement | null) => {
    btnRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref && 'current' in ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disableRipple && !disabled && !loading) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const id = Date.now();
      setRipples((prev) => [...prev, { id, x, y }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, rippleDurationMs);
    }
    onMouseDown?.(event);
  };

  const base = useMemo(() => `
    relative inline-flex items-center justify-center select-none
    rounded-md font-medium whitespace-nowrap
    transition-[background,color,box-shadow,transform] duration-150 ease-out
    outline-none focus:outline-none focus:ring-0 focus:ring-offset-0
    disabled:pointer-events-none disabled:opacity-60
  `.trim().replace(/\s+/g, ' '), []);

  const sizeClass = sizeStyles[size];
  const full = fullWidth ? 'w-full' : '';

  const isDisabled = disabled || loading;

  const content = (
    <span className={['relative z-10 inline-flex items-center gap-2', classes?.label].filter(Boolean).join(' ')}>
      {(loading && loadingPosition === 'start') && (
        <span className={['inline-flex', classes?.loader].filter(Boolean).join(' ')}><Spinner /></span>
      )}
      {startIcon && !loading && (
        <span className={['inline-flex', classes?.startIcon].filter(Boolean).join(' ')}>{startIcon}</span>
      )}
      <span>{children}</span>
      {endIcon && !loading && (
        <span className={['inline-flex', classes?.endIcon].filter(Boolean).join(' ')}>{endIcon}</span>
      )}
      {(loading && loadingPosition === 'end') && (
        <span className={['inline-flex', classes?.loader].filter(Boolean).join(' ')}><Spinner /></span>
      )}
      {(loading && loadingPosition === 'center') && (
        <span className={['absolute inset-0 flex items-center justify-center', classes?.loader].filter(Boolean).join(' ')}>
          <Spinner />
        </span>
      )}
    </span>
  );

  return (
    <button
      ref={mergedRef}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        if (loading) { e.preventDefault(); return; }
        onClick?.(e);
      }}
      className={[
        base,
        sizeClass,
        full,
        className,
        classes?.root,
      ].filter(Boolean).join(' ')}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {content}
      {!disableRipple && (
        <span aria-hidden className="absolute inset-0 overflow-hidden rounded-md">
          {ripples.map((r) => (
            <span
              key={r.id}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-current/30 animate-[ripple_550ms_ease-out_forwards]"
              style={{
                left: r.x,
                top: r.y,
                width: 20,
                height: 20,
              } as React.CSSProperties}
            />
          ))}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
