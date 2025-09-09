import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface SelectClasses {
  root?: string;
  trigger?: string;
  icon?: string;
  list?: string;
  option?: string;
  label?: string;
  helperText?: string;
  error?: string;
}

export interface SelectProps<T = string | number> {
  value: T | null;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  classes?: SelectClasses;
}

const Select = <T extends string | number = string>({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled,
  error,
  helperText,
  classes,
}: SelectProps<T>) => {
  const id = useId();
  const triggerRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ left: number; top: number; width: number }>({ left: 0, top: 0, width: 0 });
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const selected = useMemo(() => options.find(o => o.value === value) ?? null, [options, value]);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(o => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const updatePosition = useCallback(() => {
    const t = triggerRef.current;
    if (!t) return;
    const r = t.getBoundingClientRect();
    setCoords({ left: r.left, top: r.bottom + 4, width: r.width });
  }, []);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const onResize = () => updatePosition();
    const onScroll = () => updatePosition();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (listRef.current?.contains(t) || triggerRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const rootCls = ['relative', classes?.root].filter(Boolean).join(' ');
  const triggerCls = [
    'w-full rounded-md border px-3 py-2 text-sm',
    'bg-white text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300',
    'focus:outline-none focus:ring-2 focus:ring-sky-500',
    disabled ? 'opacity-60 cursor-not-allowed' : '',
    error ? 'border-red-300 ring-red-300' : 'border-gray-300',
    classes?.trigger,
  ].filter(Boolean).join(' ');

  const listCls = [
    'fixed z-[1002] max-h-64 w-[--select-w] overflow-auto rounded-md border bg-white shadow-lg',
    'ring-1 ring-gray-200 p-1',
    classes?.list,
  ].filter(Boolean).join(' ');

  const optionBase = [
    'flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm',
    'text-gray-800 hover:bg-gray-100 aria-selected:bg-gray-100 aria-disabled:opacity-50',
    classes?.option,
  ].filter(Boolean).join(' ');

  const iconCls = ['ml-2 text-gray-500', classes?.icon].filter(Boolean).join(' ');
  const helperCls = ['mt-1 text-xs', error ? 'text-red-600' : 'text-gray-500', classes?.helperText].filter(Boolean).join(' ');

  const list = (
    <ul
      ref={listRef}
      role="listbox"
      id={`${id}-listbox`}
      className={listCls}
      style={{ left: coords.left, top: coords.top, width: coords.width }}
      onMouseLeave={() => setActiveIndex(-1)}
    >
      {filtered.map((opt, idx) => (
        <li
          key={String(opt.value)}
          role="option"
          aria-selected={opt.value === value}
          aria-disabled={opt.disabled || undefined}
          className={[optionBase, idx === activeIndex ? 'bg-black/10 dark:bg-white/10' : ''].filter(Boolean).join(' ')}
          onMouseEnter={() => setActiveIndex(idx)}
          onClick={() => {
            if (opt.disabled) return;
            onChange(opt.value);
            setOpen(false);
            setQuery('');
            setActiveIndex(-1);
          }}
        >
          {opt.label}
        </li>
      ))}
    </ul>
  );

  return (
    <div className={rootCls}>
      
      <div className="relative">
        <input
          ref={triggerRef}
          type="text"
          role="combobox"
          aria-controls={`${id}-listbox`}
          aria-expanded={open || undefined}
          aria-autocomplete="list"
          disabled={disabled}
          className={triggerCls}
          placeholder={placeholder}
          value={open ? query : (selected ? selected.label : '')}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => {
            if (!disabled) {
              setOpen(true);
              setQuery('');
              setActiveIndex(0);
            }
          }}
          onKeyDown={(e) => {
            if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
              setOpen(true); setActiveIndex(0); return;
            }
            if (!open) return;
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIndex((i) => Math.max(i - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              const opt = filtered[activeIndex];
              if (opt && !opt.disabled) {
                onChange(opt.value);
                setOpen(false);
                setQuery('');
              }
            }
          }}
          onClick={() => {
            if (!disabled) setOpen(true);
          }}
        />
        <span className={iconCls + ' pointer-events-none absolute right-2 top-1/2 -translate-y-1/2'}>▾</span>
      </div>
      {helperText && <p className={helperCls}>{helperText}</p>}
      {open && createPortal(list, document.body)}
    </div>
  );
};

export default Select;
