import { LinkButton, type LinkButtonProps } from "./LinkButton";

import links from '../config/links';

export const Links = () => {
  return (
    <div>
      <header class="text-xl font-bold my-1">Find me at...</header>
      <div class="flex flex-wrap gap-1">
        {links.map((link) => (
          <LinkButton {...link} />
        ))}
      </div>
    </div>
  );
};
