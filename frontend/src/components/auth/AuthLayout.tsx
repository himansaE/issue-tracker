import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  splash: React.ReactNode;
}

export function AuthLayout({ children, splash }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-surface-900 overflow-hidden font-sans">
      <div className="hidden lg:flex w-1/2 relative bg-surface-800 border-r border-white/5 items-center justify-center p-12 overflow-hidden">
        {splash}
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
