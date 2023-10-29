import LinkButton, {
  type ButtonWithColorfulBorderProps,
} from "./ButtonWithColorfulBorder";

import links from "../config/links";

import Avatar from "../assets/28241963.png";

const Links = () => {
  return (
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
  );
};

export const SelfIntro = () => {
  return (
    <div class="flex flex-col">
      <div class="flex flex-row">
        <div class="flex-1">
          <h1 class="text-3xl font-bold">Hi!</h1>
          <p>I'm situ2001.</p>
        </div>
        <img
          class="h-16 w-16 rounded-full transition-all duration-300 hover:rotate-180"
          src={Avatar.src}
          alt={"situ2001's GitHub avatar"}
        ></img>
      </div>
      <div class="my-1"></div>
      <Links />
    </div>
  );
};
