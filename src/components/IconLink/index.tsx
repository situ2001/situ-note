import { motion } from 'framer-motion';
import clsx from "clsx";
import type { IconType } from 'react-icons/lib';
import type { ImageMetadata } from 'astro';

import underline from '../AnimatedUnderline/index.module.css';
import { useMemo } from 'react';
import useEnvInfo from '../../lib/useEnvInfo';

type IconSize = 'sm' | 'md' | 'lg';

export interface IconLinkProps {
  link: string;
  icon: ImageMetadata | IconType;
  name: string;
  hideText?: boolean;
  size?: IconSize;
}

/**
 * A link with an icon and a name.
 */
export default function IconLink(
  props: IconLinkProps
) {
  const { link, icon, name, hideText = false, size = 'md' } = props;

  const Icon = icon as IconType;

  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const { isMobile, isTouch } = useEnvInfo();

  const motionPropsForHeroSectionHint = useMemo(() => {
    return isMobile || isTouch
      ? {}
      : {
        whileHover: { scale: 1.25, rotate: 5 },
        whileTap: { scale: 0.9 }
      }
  }, [isMobile]);

  return (
    <motion.a
      {...motionPropsForHeroSectionHint}
      className={clsx(
        "flex max-w-fit items-center gap-1",
        !hideText && underline['slide-in']
      )}
      title={name}
      href={link}
      target="_blank"
    >
      {
        (icon as ImageMetadata).src
          ? (<img className={sizeClasses[size]} src={(icon as ImageMetadata).src} alt={name}></img>)
          : <Icon className={sizeClasses[size]} />
      }
      {!hideText && <p className={textSizeClasses[size]}>{name}</p>}
    </motion.a>
  );
}
