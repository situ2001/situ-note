import { onCleanup, onMount } from "solid-js";

type Data = {
  temp: number;
  date: string;
};

export function TempChart(props: { data: Data[] }) {
  let container: HTMLDivElement | undefined;

  onMount(() => {
    let disposed = false;
    let chart: import("@antv/g2").Chart | undefined;

    void import("@antv/g2").then(({ Chart }) => {
      if (disposed || !container) return;
      chart = new Chart({ container, autoFit: true, height: 480 });
      chart
        .line()
        .data({ value: props.data })
        .style("shape", "smooth")
        .encode("x", (d: Data) => new Date(d.date))
        .encode("y", "temp")
        .axis("x", { title: "时间" })
        .axis("y", { title: "体温 (°C)" })
        .label({ text: "temp", transform: [{ type: "overlapDodgeY" }], fontSize: 8 });
      void chart.render();
    });

    onCleanup(() => {
      disposed = true;
      chart?.destroy();
    });
  });

  return <div style={{ height: "480px" }} ref={container} />;
}
