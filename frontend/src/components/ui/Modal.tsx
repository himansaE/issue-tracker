import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, description, children }: ModalProps) {
  const [shouldRender, setRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      const timer = setTimeout(() => {
        setRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-surface-950/60 backdrop-blur-sm transition-opacity duration-200"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div
            className="relative transform overflow-hidden rounded-xl bg-surface-800 border border-white/5 text-left shadow-xl transition-all duration-200 sm:my-8 sm:w-full sm:max-w-md p-6"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? 'scale(1)' : 'scale(0.95)',
              transformOrigin: 'center',
              transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)'
            }}
          >
            <div>
              <h3 className="text-lg font-semibold leading-6 text-white" id="modal-title">
                {title}
              </h3>
              {description && (
                <div className="mt-2">
                  <p className="text-sm text-slate-400">
                    {description}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
