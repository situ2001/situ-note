import _ from "lodash";
import styles from "./style.module.css";

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
    <a
      className={styles.button + " " + "flex items-center dark:invert"}
      title={name}
      href={link}
    >
      <img className="h-6 w-6" src={iconUrl} alt={name}></img>
    </a>
  );
}
