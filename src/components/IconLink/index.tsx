import { motion } from 'framer-motion';
import clsx from "clsx";
import type { IconType } from 'react-icons/lib';
import type { ImageMetadata } from 'astro';

export interface IconLinkProps {
  link: string;
  icon: ImageMetadata | IconType;
  name: string;
}

/**
 * A button with a colorful border.
 */
export default function IconLink(
  props: IconLinkProps
) {
  const { link, icon, name } = props;

  const Icon = icon as IconType;

  return (
    <motion.a
      whileHover={{ scale: 1.2, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className={clsx("flex items-center dark:invert")}
      title={name}
      href={link}
    >
      {
        (icon as ImageMetadata).src
          ? (<img className="h-6 w-6" src={(icon as ImageMetadata).src} alt={name}></img>)
          : <Icon className='h-6 w-6' />
      }
    </motion.a>
  );
}
