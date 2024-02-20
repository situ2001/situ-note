import LinkButton, {
  type ButtonWithColorfulBorderProps,
} from "./LinkButtonWithLogo";

import links from "../config/links";

import type { JSXElement } from "solid-js";

const Links = () => {
  return (
    <div class="flex flex-wrap gap-4">
      {links.map((link) => (
        <LinkButton iconUrl={link.iconUrl} link={link.link} name={link.name} />
      ))}
    </div>
  );
};

export const SelfIntro = ({ children }: { children: JSXElement }) => {
  return (
    <div class="flex flex-col h-full">
      <div class="flex flex-row">
        <div class="flex-1">
          <h1 class="text-3xl font-bold">Hi!</h1>
          <p>I'm situ2001.</p>
        </div>
        {children}
      </div>
      <div class="my-1"></div>
      <Links />
    </div>
  );
};
