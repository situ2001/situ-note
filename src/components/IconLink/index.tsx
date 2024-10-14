import { motion } from 'framer-motion';
import clsx from "clsx";

export interface IconLinkProps {
  link: string;
  iconUrl: string;
  name: string;
}

/**
 * A button with a colorful border.
 */
export default function IconLink(
  props: IconLinkProps
) {
  const { link, iconUrl, name } = props;

  return (
    <motion.a
      whileHover={{ scale: 1.2, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className={clsx("flex items-center dark:invert")}
      title={name}
      href={link}
    >
      <img className="h-6 w-6" src={iconUrl} alt={name}></img>
    </motion.a>
  );
}
