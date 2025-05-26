import Link from 'next/link';
import Image from 'next/image'; // Import next/image

export interface LogoProps {
  className?: string;
  inSheet?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export function Logo({
  className,
  inSheet = false,
  imageUrl,
  imageAlt = "AEC FSP Portal Logo", // More specific default alt
  imageWidth,
  imageHeight,
}: LogoProps) {
  const Comp = inSheet ? 'div' : Link;
  const rootProps = inSheet ? {} : { href: '/' };

  if (imageUrl && imageWidth && imageHeight) {
    return (
      <Comp {...rootProps} className={`flex items-center ${className || ''}`}>
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={imageWidth}
          height={imageHeight}
          data-ai-hint="logo portal"
        />
      </Comp>
    );
  }

  return (
    <Comp {...rootProps} className={`font-bold text-xl tracking-tight flex items-center ${className || ''}`}>
      AEC <span className="text-primary mx-1">FSP</span> Tracker
    </Comp>
  );
}
