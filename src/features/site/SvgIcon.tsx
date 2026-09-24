interface SvgIconProps {
  markup: string;
  class?: string;
}

/** Renders trusted SVG markup imported from local icon assets. */
export default function SvgIcon(props: SvgIconProps) {
  return <span aria-hidden="true" class={`inline-flex [&>svg]:size-full [&>svg]:fill-current ${props.class ?? ""}`} innerHTML={props.markup} />;
}
