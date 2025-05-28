
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface LogoProps {
  className?: string;
  inSheet?: boolean;
}

export function Logo({
  className,
  inSheet = false,
}: LogoProps) {
  const Comp = inSheet ? 'div' : Link;
  const rootProps = inSheet ? {} : { href: '/' };

  return (
    <Comp {...rootProps} className={cn('flex items-center space-x-2', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo1.avif" alt="AEC Logo" className="h-16" loading="eager" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo2.png" alt="JIS Logo" className="h-16" loading="eager" />
    </Comp>
  );
}
