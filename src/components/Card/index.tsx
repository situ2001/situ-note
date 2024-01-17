import {
  createComputed,
  createEffect,
  createMemo,
  createRenderEffect,
  createSignal,
} from "solid-js";

import styles from "./style.module.css";

export enum FadeFromDirection {
  Top,
  Right,
  Bottom,
  Left,
}

interface CardProps {
  fadeFromDirection?: FadeFromDirection;
  fullHeight?: boolean;
}

const Card = (props: CardProps & { children?: any }) => {
  const directionClassName = createMemo(() => {
    switch (props.fadeFromDirection) {
      case FadeFromDirection.Top:
        return styles.fadeFromTop;
      case FadeFromDirection.Right:
        return styles.fadeFromRight;
      case FadeFromDirection.Bottom:
        return styles.fadeFromBottom;
      case FadeFromDirection.Left:
        return styles.fadeFromLeft;
      default:
        return styles.fadeFromBottom;
    }
  });

  return (
    <div
      style={{
        height: props.fullHeight ? "100%" : "auto",
      }}
      class={
        directionClassName() +
        " " +
        "bg-white rounded-xl shadow-lg p-4 transition-all mb-4"
      }
    >
      {props.children}
    </div>
  );
};

export default Card;
