import { onCleanup, onMount } from "solid-js";
import mediumZoom from "medium-zoom/dist/pure";
import "medium-zoom/dist/style.css";

export default function MediumZoom(props: { selectors: string[] }) {
  onMount(() => {
    const zoom = mediumZoom();
    zoom.attach(...props.selectors);
    onCleanup(() => zoom.detach());
  });

  return null;
}
