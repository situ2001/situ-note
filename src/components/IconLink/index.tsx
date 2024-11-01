import { motion } from 'framer-motion';
import clsx from "clsx";
import type { IconType } from 'react-icons/lib';
import type { ImageMetadata } from 'astro';

import underline from '../AnimatedUnderline/index.module.css';

export interface IconLinkProps {
  link: string;
  icon: ImageMetadata | IconType;
  name: string;
}

/**
 * A link with an icon and a name.
 */
export default function IconLink(
  props: IconLinkProps
) {
  const { link, icon, name } = props;

  const Icon = icon as IconType;

  return (
    <motion.a
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={clsx("flex max-w-fit items-center gap-1", underline['slide-in'])}
      title={name}
      href={link}
      target="_blank"
    >
      {
        (icon as ImageMetadata).src
          ? (<img className="h-4 w-4" src={(icon as ImageMetadata).src} alt={name}></img>)
          : <Icon className='h-4 w-4' />
      }
      <p>{name}</p>
    </motion.a>
  );
}
