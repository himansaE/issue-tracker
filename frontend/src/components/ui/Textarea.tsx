import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({ label, error, id, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-sm font-medium text-slate-300" htmlFor={id}>
          {label}
        </label>
      </div>
      <textarea
        id={id}
        {...props}
        className={`w-full px-4 py-3 rounded-lg bg-surface-800 border focus:bg-surface-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-input shadow-sm resize-none ${
          error ? 'border-red-500/60 animate-shake' : 'border-white/10'
        } ${props.className || ''}`}
      />
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
