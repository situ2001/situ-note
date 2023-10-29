import LinkButton, {
  type ButtonWithColorfulBorderProps,
} from "./ButtonWithColorfulBorder";

import links from "../config/links";

export const Links = () => {
  return (
    <div>
      <header class="text-xl font-bold my-1">Find me at...</header>
      <div class="flex flex-wrap gap-1">
        {links.map((link) => (
          <LinkButton>
            <a class="flex items-center gap-1" href={link.link}>
              {link.iconUrl && <img class="h-4" src={link.iconUrl}></img>}
              <span>{link.name}</span>
            </a>
          </LinkButton>
        ))}
      </div>
    </div>
  );
};
