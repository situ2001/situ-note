import { Runtime, extend } from "@antv/g2/esm/api/index";
import { Cartesian } from "@antv/g2/esm/coordinate/index";
import { Constant, Field, Transform, Column } from "@antv/g2/esm/encode/index";
import { Line } from "@antv/g2/esm/mark/index";
import { Linear, Time, Identity } from "@antv/g2/esm/scale/index";
import { Light } from "@antv/g2/esm/theme/index";
import { AxisX, AxisY } from "@antv/g2/esm/component/index";
import { FadeIn, FadeOut, Morphing } from "@antv/g2/esm/animation/index";
import { Tooltip, LegendFilter, SliderFilter, ScrollbarFilter } from "@antv/g2/esm/interaction/index";
import { LabelShape } from "@antv/g2/esm/shape/index";
import { Inline } from "@antv/g2/esm/data/index";
import { OverlapDodgeY } from "@antv/g2/esm/label-transform/index";

// Register only the components used by the temperature line charts.
export const Chart = extend(Runtime, {
  "data.inline": Inline,
  "coordinate.cartesian": Cartesian,
  "encode.constant": Constant,
  "encode.field": Field,
  "encode.transform": Transform,
  "encode.column": Column,
  "mark.line": Line,
  "shape.label.label": LabelShape,
  "scale.linear": Linear,
  "scale.time": Time,
  "scale.identity": Identity,
  "theme.light": Light,
  "component.axisX": AxisX,
  "component.axisY": AxisY,
  "animation.fadeIn": FadeIn,
  "animation.fadeOut": FadeOut,
  "animation.morphing": Morphing,
  "interaction.tooltip": Tooltip,
  "interaction.legendFilter": LegendFilter,
  "interaction.sliderFilter": SliderFilter,
  "interaction.scrollbarFilter": ScrollbarFilter,
  "labelTransform.overlapDodgeY": OverlapDodgeY,
});
