import React from 'react';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
  const baseStyles = "w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 group transition-btn active:scale-98";
  
  const variants = {
    primary: "bg-brand-600 hover:bg-brand-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.15)] hover:shadow-[0_0_25px_rgba(79,70,229,0.3)] ring-1 ring-white/10 ring-inset",
    secondary: "bg-surface-800 border border-white/10 text-white hover:bg-surface-700 focus:bg-surface-700",
    ghost: "text-slate-400 hover:text-white"
  };

  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${loading ? 'cursor-not-allowed opacity-90' : ''} ${className}`}
    >
      {/* We conditionally render the wrapper to prevent DOM flex gap shifting when hidden */}
      {loading && (
        <div className={`relative flex items-center justify-center transition-content ${loading ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <Spinner size={18} className="text-white" />
        </div>
      )}
      <span className={`transition-content ${loading ? 'blur-[2px] opacity-70 scale-98' : 'blur-0 opacity-100 scale-100'}`}>
        {children}
      </span>
    </button>
  );
}
