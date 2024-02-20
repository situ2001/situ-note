import LinkButton, {
  type ButtonWithColorfulBorderProps,
} from "./LinkButtonWithLogo";

import links from "../config/links";

import { createSignal, type JSXElement } from "solid-js";

const Links = () => {
  return (
    <div class="flex flex-wrap gap-4 justify-center">
      {links.map((link) => (
        <LinkButton iconUrl={link.iconUrl} link={link.link} name={link.name} />
      ))}
    </div>
  );
};

export const SelfLinks = () => {
  const [currentHoveredLink, setCurrentHoveredLink] = createSignal<
    string | null
  >("");

  return (
    <div class="flex flex-wrap md:flex-col">
      <header class="text-xl font-bold transition-all duration-150 md:text-center">
        Find me on <a>{currentHoveredLink()}</a>
      </header>
      <div class="m-1"></div>
      <div class="flex gap-4 justify-center ml-auto md:m-0">
        {links.map((link) => (
          <div
            onPointerOver={() => setCurrentHoveredLink(link.name)}
            onPointerLeave={() => setCurrentHoveredLink("")}
          >
            <LinkButton
              iconUrl={link.iconUrl}
              link={link.link}
              name={link.name}
            />
          </div>
        ))}
      </div>
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
    </div>
  );
};
