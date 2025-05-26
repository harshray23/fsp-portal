import Link from 'next/link';

export function Logo({ className, inSheet = false }: { className?: string, inSheet?: boolean }) {
  const Comp = inSheet ? 'div' : Link;
  const props = inSheet ? {} : { href: '/' };
  return (
    <Comp {...props} className={`font-bold text-xl tracking-tight flex items-center ${className}`}>
      AEC <span className="text-primary mx-1">FSP</span> Tracker
    </Comp>
  );
}
