import {
  createComputed,
  createEffect,
  createMemo,
  createRenderEffect,
  createSignal,
} from "solid-js";

import styles from "./style.module.css";

const Card = (props: any) => {
  return (
    <div
      class={
        styles.root +
        " " +
        "bg-white rounded-xl shadow-lg p-4 transition-all mb-4"
      }
    >
      {props.children}
    </div>
  );
};

export default Card;
