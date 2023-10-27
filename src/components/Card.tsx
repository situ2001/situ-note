import {
  createComputed,
  createEffect,
  createMemo,
  createRenderEffect,
  createSignal,
} from "solid-js";

import "../styles/card.css";

export const Card = (props: any) => {
  const [rotate, setRotate] = createSignal(217);

  const linearGradientStyle = createMemo(
    () => `
  background: linear-gradient(${rotate()}deg, rgba(255,0,0,.8), rgba(255,0,0,0) 70.71%),
  linear-gradient(${
    rotate() - 90
  }deg, rgba(0,255,0,.8), rgba(0,255,0,0) 70.71%),
  linear-gradient(${
    rotate() + 120
  }deg, rgba(0,0,255,.8), rgba(0,0,255,0) 70.71%);
  `
  );

  return (
    <div
      class={
        "card-root" +
        " " +
        "bg-white rounded-xl shadow-lg p-4 transition-all mb-4"
      }
      // class="bg-white rounded-xl shadow-lg p-4 w-64 h-64 transition-all duration-200 ease-in-out hover:scale-105"
      // style={linearGradientStyle()}
    >
      {props.children}
    </div>
  );
};
