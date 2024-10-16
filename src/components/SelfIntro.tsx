import { useState } from "react";

import LinkButton from "./IconLink";
import links from "../config/links";

export const SelfLinks = () => {
  const [currentHoveredLink, setCurrentHoveredLink] = useState<
    string | null
  >("");

  return (
    <div className="flex flex-wrap md:flex-col">
      <header className="text-xl transition-transform duration-150 md:text-center">
        Find me on <span className="hidden md:inline italic">{currentHoveredLink}</span>
      </header>
      <div className="m-1"></div>
      <div className="flex gap-4 justify-center ml-auto md:m-0">
        {links.map((link) => (
          <div
            onPointerOver={() => setCurrentHoveredLink(link.name)}
            onPointerLeave={() => setCurrentHoveredLink("")}
          >
            <LinkButton
              icon={link.icon}
              link={link.link}
              name={link.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const SelfIntro = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-row">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Hi!</h1>
          <p>I'm situ2001.</p>
        </div>
        <img
          src="/avatar.png"
          loading="lazy"
          alt={"situ2001's GitHub avatar"}
          className="h-16 w-16 rounded-full transition-transform duration-300 hover:rotate-180"
          width="100"
          height="100"
        />
      </div>
      <div className="my-1"></div>
    </div>
  );
};
