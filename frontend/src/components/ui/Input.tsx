import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export function Input({ label, error, rightElement, id, ...props }: InputProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-slate-300" htmlFor={id}>
          {label}
        </label>
        {rightElement}
      </div>
      <input
        id={id}
        {...props}
        className={`w-full px-4 py-3 rounded-xl bg-surface-800 border focus:bg-surface-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-input shadow-sm ${
          error ? 'border-red-500/60' : 'border-white/10'
        } ${props.className || ''}`}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
