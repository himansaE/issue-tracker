import { Clipboard } from 'iconsax-react';

interface AuthHeroProps {
  title: string;
  description: string;
  delay?: number;
}

export function AuthHero({ title, description, delay = 0 }: AuthHeroProps) {
  return (
    <div className="mb-10 animate-enter" style={{ animationDelay: `${delay}ms` }}>
      <div className="lg:hidden w-12 h-12 rounded-xl bg-surface-800 border border-white/5 flex items-center justify-center mb-6 shadow-xl">
        <Clipboard variant="Bulk" color="currentColor" className="w-6 h-6 text-brand-400" />
      </div>
      <h2 className="font-heading text-3xl font-semibold text-white tracking-tight mb-2">
        {title}
      </h2>
      <p className="text-slate-400 whitespace-nowrap">
        {description}
      </p>
    </div>
  );
}
