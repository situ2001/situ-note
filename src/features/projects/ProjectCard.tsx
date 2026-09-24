import SvgIcon from "@/features/site/SvgIcon";

interface CardProps {
  title: string;
  description: string;
  link?: string;

  /**
   * Trusted SVG markup or image URL.
   */
  icon?: string;
}

const ProjectCard = ({ title, description, link, icon }: CardProps) => {
  const iconComp = (() => {
    if (icon?.trimStart().startsWith("<svg")) {
      return <SvgIcon markup={icon} class="size-20 text-zinc-600 dark:text-zinc-400" />;
    }

    if (icon) {
      return (
        <img
          src={icon}
          alt={title}
          class="h-20 w-20 object-contain"
        />
      );
    }

    return (
      <span class="text-zinc-600 dark:text-zinc-400 text-xl font-medium">
        {title[0]}
      </span>
    );
  })();

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      class="block h-full"
    >
      <div class="group relative h-full min-h-30 overflow-hidden rounded-lg border border-transparent p-3 transition-colors duration-200 ease-in-out hover:border-zinc-200 hover:bg-surface dark:hover:border-zinc-800 dark:hover:bg-zinc-800/30">
        <div class="pointer-events-none absolute bottom-2 right-2 flex origin-bottom-right scale-100 items-center justify-center opacity-[0.06] transition-all duration-300 ease-out group-hover:scale-110 group-hover:opacity-[0.08] dark:opacity-[0.07] dark:group-hover:opacity-[0.1]">
          {iconComp}
        </div>

        <div class="relative flex h-full flex-col">
          <h3 class="relative isolate w-fit min-w-0 leading-snug after:pointer-events-none after:absolute after:-z-10 after:bottom-0 after:left-0 after:h-2 after:w-full after:origin-left after:scale-x-0 after:bg-highlight after:transition-transform after:duration-300 after:ease-out group-hover:after:scale-x-100">
            {title}
          </h3>
          <p class="mt-1 text-zinc-600 dark:text-zinc-400 text-sm transition ease-in-out duration-200 opacity-70 group-hover:opacity-90">
            {description}
          </p>
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;
