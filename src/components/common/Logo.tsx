
import Link from 'next/link';
import Image, { type ImageProps } from 'next/image'; // Import ImageProps

export interface LogoProps {
  className?: string;
  inSheet?: boolean;
  imageUrl?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  priority?: boolean;
}

export function Logo({
  className,
  inSheet = false,
  imageUrl,
  imageAlt = "AEC FSP Portal Logo",
  imageWidth,
  imageHeight,
  priority = false,
}: LogoProps) {
  const Comp = inSheet ? 'div' : Link;
  const rootProps = inSheet ? {} : { href: '/' };

  if (imageUrl && imageWidth && imageHeight) {
    const imageComponentProps: Omit<ImageProps, 'src'> & { src: string } = {
      src: imageUrl,
      alt: imageAlt,
      width: imageWidth,
      height: imageHeight,
      "data-ai-hint": "logo portal",
    };
    if (priority) {
      imageComponentProps.priority = true;
    }

    return (
      <Comp {...rootProps} className={`flex items-center ${className || ''}`}>
        <Image {...imageComponentProps} />
      </Comp>
    );
  }

  return (
    <Comp {...rootProps} className={`font-bold text-xl tracking-tight flex items-center ${className || ''}`}>
      AEC <span className="text-primary mx-1">FSP</span> Tracker
    </Comp>
  );
}
