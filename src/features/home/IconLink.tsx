import clsx from "clsx";
import type { ImageMetadata } from "astro";
import SvgIcon from "@/features/site/SvgIcon";
import underline from "./AnimatedUnderline.module.css";

type IconSize = "sm" | "md" | "lg";

export interface IconLinkProps {
  link: string;
  icon: ImageMetadata | string;
  name: string;
  hideText?: boolean;
  size?: IconSize;
}

export default function IconLink(props: IconLinkProps) {
  const size = props.size ?? "md";
  const sizeClasses = { sm: "size-3", md: "size-4", lg: "size-5" };
  const textSizeClasses = { sm: "text-sm", md: "text-base", lg: "text-lg" };

  return (
    <a
      class={clsx(
        "flex max-w-fit items-center gap-1 transition-transform",
        "motion-safe:hover:scale-125 motion-safe:hover:rotate-[5deg] active:scale-90",
        !props.hideText && underline["slide-in"],
      )}
      title={props.name}
      href={props.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {typeof props.icon === "string"
        ? <SvgIcon markup={props.icon} class={sizeClasses[size]} />
        : <img class={sizeClasses[size]} src={props.icon.src} alt={props.name} />}
      {!props.hideText && <p class={textSizeClasses[size]}>{props.name}</p>}
    </a>
  );
}
