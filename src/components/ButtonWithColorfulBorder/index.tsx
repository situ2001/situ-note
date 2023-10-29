import { onCleanup, onMount, type JSXElement } from "solid-js";
import _ from "lodash";
import styles from "./style.module.css";

export interface ButtonWithColorfulBorderProps {
  children: JSXElement;
}

/**
 * A button with a colorful border.
 */
export default function ButtonWithColorfulBorder(
  props: ButtonWithColorfulBorderProps
) {
  const { children } = props;

  let btn: HTMLButtonElement | undefined;

  onMount(() => {
    const update = _.throttle((e: PointerEvent) => {
      const { x, y } = e;
      const currentTarget = e.currentTarget as HTMLButtonElement | null;
      if (currentTarget) {
        const styleObj = currentTarget.style;
        const bound = currentTarget.getBoundingClientRect();

        styleObj.setProperty("--rx", (x - bound.x) / bound.width + "");
        styleObj.setProperty("--x", (x - bound.x) / bound.width + "");
        styleObj.setProperty("--y", (y - bound.y) / bound.height + "");
      }
    }, 10);

    btn?.addEventListener("pointermove", update, { capture: true });
    onCleanup(() => {
      btn?.removeEventListener("pointermove", update);
    });
  });

  return (
    <button ref={btn} class={styles.button}>
      <span class={styles.backdrop}></span>
      <span class={styles.text}>{children}</span>
    </button>
  );
}
