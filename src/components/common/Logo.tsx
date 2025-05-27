
import Link from 'next/link';
// import Image, { type ImageProps } from 'next/image'; // Temporarily comment out next/image
import { cn } from '@/lib/utils';

export interface LogoProps {
  className?: string;
  inSheet?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  priority?: boolean; // This prop will be unused with a standard img tag
}

export function Logo({
  className,
  inSheet = false,
  imageUrl,
  imageAlt = "AEC FSP Logo", // Default alt text
  imageWidth,
  imageHeight,
}: LogoProps) {
  const Comp = inSheet ? 'div' : Link;
  const rootProps = inSheet ? {} : { href: '/' };

  if (imageUrl && imageWidth && imageHeight) {
    // Using a standard HTML <img> tag for debugging
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <Comp {...rootProps} className={cn('flex items-center', className)}>
        <img
          src={imageUrl}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          data-ai-hint="placeholder logo" // Keep hint for placehold.co images
        />
      </Comp>
    );
  }

  // Fallback text if no image URL is provided
  return (
    <Comp {...rootProps} className={cn('font-bold text-xl tracking-tight flex items-center', className)}>
      AEC <span className="text-primary mx-1">FSP</span> Tracker
    </Comp>
  );
}
