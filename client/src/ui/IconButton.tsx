import React, { forwardRef, useState } from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  ripple?: boolean;
  edge?: 'start' | 'end' | 'false';
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  children,
  size = 'medium',
  disabled = false,
  ripple = true,
  edge = 'false',
  className = '',
  onMouseDown,
  ...props
}, ref) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (ripple && !disabled) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const newRipple = { id: Date.now(), x, y };
      
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }
    
    onMouseDown?.(event);
  };

  const sizeClasses = {
    small: 'w-8 h-8 p-1',
    medium: 'w-10 h-10 p-2',
    large: 'w-12 h-12 p-3'
  };

  const edgeClasses = {
    start: '-ml-3',
    end: '-mr-3',
    false: ''
  };

  const baseClasses = `
    relative overflow-hidden
    inline-flex items-center justify-center
    rounded-full
    transition-all duration-200 ease-in-out
    outline-none focus:outline-none focus:ring-0 focus:ring-offset-0
    disabled:pointer-events-none disabled:opacity-60
    ${sizeClasses[size]}
    ${edgeClasses[edge]}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${className}`}
      disabled={disabled}
      onMouseDown={handleMouseDown}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
      
      {/* Ripple effect */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-current opacity-30 animate-ping pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: '600ms',
            animationFillMode: 'forwards'
          }}
        />
      ))}
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
