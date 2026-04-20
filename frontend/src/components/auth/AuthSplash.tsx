import React from 'react';

interface AuthSplashProps {
  children: React.ReactNode;
  variant?: 'login' | 'register';
}

export function AuthSplash({ children, variant = 'login' }: AuthSplashProps) {
  const glows = {
    login: (
      <>
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/40 rounded-full blur-[100px]" />
      </>
    ),
    register: (
      <>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/30 rounded-full blur-[100px]" />
      </>
    )
  };

  return (
    <>
      {glows[variant]}
      <div className="relative z-10 max-w-lg text-white">
        {children}
      </div>
    </>
  );
}
