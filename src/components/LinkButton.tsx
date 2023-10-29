import { onCleanup, onMount } from "solid-js";
import _ from "lodash";
import styles from "../styles/link-button.module.css";

export interface LinkButtonProps {
  name: string;
  link: string;
  iconUrl?: string;
}

export const LinkButton = (props: LinkButtonProps) => {
  const { name, link, iconUrl } = props;

  let btn: HTMLButtonElement | undefined;

  onMount(() => {
    const update = _.throttle((e: PointerEvent) => {
      const { x, y } = e;
      const styleObj = (e.currentTarget as HTMLButtonElement).style;
      const bound = (
        e.currentTarget as HTMLButtonElement
      ).getBoundingClientRect();

      styleObj.setProperty("--rx", (x - bound.x) / bound.width + "");
      styleObj.setProperty("--x", (x - bound.x) / bound.width + "");
      styleObj.setProperty("--y", (y - bound.y) / bound.height + "");
    }, 10);

    btn?.addEventListener("pointermove", update, { capture: true });
    onCleanup(() => {
      btn?.removeEventListener("pointermove", update);
    });
  });

  return (
    <button ref={btn} class={styles.button}>
      <span class={styles.backdrop}></span>
      <a href={link} class={styles.text}>
        {iconUrl && <img class="h-4" src={iconUrl}></img>}
        <span>{name}</span>
      </a>
    </button>
  );
};
