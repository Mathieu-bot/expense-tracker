import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface DialogClasses {
  overlay?: string;
  container?: string;
  header?: string;
  title?: string;
  body?: string;
  footer?: string;
  close?: string;
  panel?: string;
}

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  closeOnOverlayClick?: boolean;
  classes?: DialogClasses;
}

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  footer,
  children,
  closeOnOverlayClick = true,
  classes,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const overlayCls = [
    'fixed inset-0 z-[1000] bg-black/50 backdrop-blur-[1px]',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    classes?.overlay,
  ].filter(Boolean).join(' ');

  const containerCls = [
    'fixed inset-0 z-[1001] grid place-items-center p-4',
    classes?.container,
  ].filter(Boolean).join(' ');

  const panelCls = [
    'w-full max-w-lg rounded-lg bg-white shadow-xl',
    'border border-gray-200',
    classes?.panel,
  ].filter(Boolean).join(' ');

  const headerCls = ['px-5 pt-4 pb-2 flex items-start justify-between', classes?.header].filter(Boolean).join(' ');
  const titleCls = ['text-base font-semibold text-gray-900', classes?.title].filter(Boolean).join(' ');
  const bodyCls = ['px-5 py-3 text-sm text-gray-700', classes?.body].filter(Boolean).join(' ');
  const footerCls = ['px-5 pb-4 pt-2 flex items-center justify-end gap-2', classes?.footer].filter(Boolean).join(' ');
  const closeBtnCls = ['ml-2 rounded-md p-1 text-gray-500 hover:bg-gray-100', classes?.close].filter(Boolean).join(' ');

  const content = (
    <>
      <div
        data-state="open"
        className={overlayCls}
        onClick={() => closeOnOverlayClick && onClose()}
      />
      <div
        className={containerCls}
        onMouseDown={(e) => {
          if (!closeOnOverlayClick) return;
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          className={panelCls}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className={headerCls}>
            {title && <h3 className={titleCls}>{title}</h3>}
            <button aria-label="Close" className={closeBtnCls} onClick={onClose}>
              ✕
            </button>
          </div>
          <div className={bodyCls}>{children}</div>
          {footer && <div className={footerCls}>{footer}</div>}
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
};

export default Dialog;
