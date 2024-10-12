// TODO why not work?
// import { Chart } from "@antv/g2";

import { useEffect, useRef } from "react";

type Data = {
  temp: number;
  date: string;
};

export const TempChart = ({ data }: { data: Data[] }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    import("@antv/g2").then(({ Chart }) => {
      const chart = new Chart({
        container: container.current!,
        autoFit: true,
        height: 480, // static height to avoid layout shift
      });

      chart
        .line()
        .data({
          value: data,
        })
        .style("shape", "smooth")
        .encode("x", (d: Data) => new Date(d.date))
        .encode("y", "temp")
        .axis("x", { title: "时间" })
        .axis("y", { title: "体温 (°C)" })
        .label({
          text: "temp",
          transform: [{ type: "overlapDodgeY" }],
          fontSize: 8,
        });

      chart.render();
    });
  }, [container]);

  return <div style={{ height: "480px" }} ref={container}></div>;
};
