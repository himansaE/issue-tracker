import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ 
  children, 
  loading, 
  variant = 'primary', 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseStyles = "w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group transition-[transform,background-color,box-shadow,opacity] duration-[160ms] ease-ui-out active:scale-[0.98]";
  
  const variants = {
    primary: "bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.15)] hover:shadow-[0_0_25px_rgba(79,70,229,0.3)] ring-1 ring-white/10 ring-inset",
    secondary: "bg-surface-800 border border-white/10 text-white hover:bg-surface-700",
    ghost: "text-slate-400 hover:text-white"
  };

  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${loading ? 'cursor-not-allowed' : ''} ${className}`}
    >
      <div className={`relative flex items-center justify-center transition-all duration-[250ms] ${loading ? 'opacity-100' : 'opacity-0 scale-75 hidden'}`}>
        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <span className={`transition-all duration-[250ms] ${loading ? 'blur-[2px] opacity-70' : 'blur-0 opacity-100'}`}>
        {children}
      </span>
    </button>
  );
}
