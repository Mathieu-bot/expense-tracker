import React, { useId, forwardRef, useMemo } from 'react';
import { SIZE_PADDING_MAP, LABEL_BASE } from './constants/inputs';
import {
  TEXTFIELD_BASE_INTERACTIVE,
  TEXTFIELD_OUTLINED,
  TEXTFIELD_OUTLINED_OK,
  TEXTFIELD_OUTLINED_ERR,
  TEXTFIELD_FILLED,
  TEXTFIELD_FILLED_OK,
  TEXTFIELD_FILLED_ERR,
  TEXTFIELD_STANDARD,
  TEXTFIELD_STANDARD_OK,
  TEXTFIELD_STANDARD_ERR,
  labelBgByVariant,
  labelFocusBgByVariant,
} from './constants/textfield';

export interface TextFieldClasses {
  root?: string;
  input?: string;
  label?: string;
  helperText?: string;
  error?: string;
  startAdornment?: string;
  endAdornment?: string;
}

export interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string; // If provided, used for floating label. Falls back to placeholder.
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  classes?: TextFieldClasses;
  variant?: 'outlined' | 'filled' | 'standard';
  size?: 'small' | 'medium' | 'large';
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(({
  value,
  onChange,
  label,
  placeholder,
  helperText,
  error,
  disabled,
  fullWidth,
  startAdornment,
  endAdornment,
  className,
  classes,
  type = 'text',
  variant = 'outlined',
  size = 'medium',
  ...props
}, ref) => {
  const id = useId();
  const renderLabel = label ?? placeholder ?? '';

  const rootCls = [
    'relative',
    fullWidth ? 'w-full' : '',
    classes?.root,
    className,
  ].filter(Boolean).join(' ');

  // Sizing
  // large ≈56px (previous medium)
  // medium ≈52px (slightly reduced)
  // small ≈48px
  const sizePadding = SIZE_PADDING_MAP[size];
  const baseInteractive = TEXTFIELD_BASE_INTERACTIVE;

  const outlinedStyles = [TEXTFIELD_OUTLINED, error ? TEXTFIELD_OUTLINED_ERR : TEXTFIELD_OUTLINED_OK].join(' ');
  const filledStyles = [TEXTFIELD_FILLED, error ? TEXTFIELD_FILLED_ERR : TEXTFIELD_FILLED_OK].join(' ');
  const standardStyles = [TEXTFIELD_STANDARD, error ? TEXTFIELD_STANDARD_ERR : TEXTFIELD_STANDARD_OK].join(' ');

  const variantCls = variant === 'outlined' ? outlinedStyles : variant === 'filled' ? filledStyles : standardStyles;

const inputCls = [
  baseInteractive,
  sizePadding,
  variantCls,
  disabled ? 'opacity-60 cursor-not-allowed' : '',
  startAdornment ? 'pl-12' : '',
  endAdornment ? 'pr-12' : '',
  'placeholder-gray-500 dark:placeholder-white/60',
  classes?.input,
].filter(Boolean).join(' ');

  const labelBase = useMemo(() => LABEL_BASE.replace('peer-focus:px-1', 'peer-focus:px-1 peer-focus:font-medium'), []);

  const labelLeft = startAdornment ? 'left-8' : 'left-4';

  const labelBg = labelBgByVariant(variant);
  const labelFocusBg = labelFocusBgByVariant(variant);
  const labelRaised = `${labelBg} peer-placeholder-shown:bg-transparent ${labelFocusBg}`;

  const helperCls = [
    'mt-1 text-sm',
    error ? 'text-red-600' : 'text-gray-500',
    classes?.helperText,
  ].filter(Boolean).join(' ');

  const helperId = helperText ? `${id}-helper` : undefined;

  return (
    <div className={rootCls}>
      <div className="relative">
        {startAdornment && (
          <span className={[
            'absolute left-4 top-1/2 -translate-y-1/2 text-gray-500',
            classes?.startAdornment,
          ].filter(Boolean).join(' ')}>
            {startAdornment}
          </span>
        )}
        <input
          id={id}
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={renderLabel}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={helperId}
          className={inputCls}
          {...props}
        />
        {renderLabel && (
          <label
            htmlFor={id}
            className={[
              labelBase,
              labelLeft,
              labelRaised,
              classes?.label,
            ].filter(Boolean).join(' ')}
          >
            {renderLabel}
          </label>
        )}
        {endAdornment && (
          <span className={[
            'absolute right-2 top-1/2 -translate-y-1/2 text-gray-500',
            classes?.endAdornment,
          ].filter(Boolean).join(' ')}>
            {endAdornment}
          </span>
        )}
      </div>
      {helperText && (
        <p id={helperId} className={helperCls}>{helperText}</p>
      )}
      {error && (
        <span className={[
          'pointer-events-none absolute inset-0 rounded-md ring-2 ring-red-300',
          'ring-inset',
          classes?.error,
        ].filter(Boolean).join(' ')} aria-hidden />
      )}
    </div>
  );
});

TextField.displayName = 'TextField';

export default TextField;
