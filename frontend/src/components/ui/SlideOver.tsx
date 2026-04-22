import React, { useEffect, useState } from 'react';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SlideOver({ isOpen, onClose, title, children }: SlideOverProps) {

  const [shouldRender, setRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      const timer = setTimeout(() => {
        setRender(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-surface-950/60 backdrop-blur-sm transition-opacity duration-400"
          style={{ opacity: isOpen ? 1 : 0 }}
          onClick={onClose}
          aria-hidden="true"
        />

        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div
            className="pointer-events-auto w-screen max-w-lg transform transition-transform duration-400 bg-surface-900 border-l border-white/5 shadow-2xl"
            style={{
              transform: isOpen ? 'translateX(0%)' : 'translateX(100%)',
              transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)'
            }}
          >
            <div className="flex h-full flex-col overflow-y-scroll scrollbar-hide py-6 shadow-xl">
              <div className="px-6 flex items-start justify-between">
                <h2 className="text-xl font-semibold leading-6 text-white" id="slide-over-title">
                  {title}
                </h2>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="relative rounded-md text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                    onClick={onClose}
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="relative mt-6 flex-1 px-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
