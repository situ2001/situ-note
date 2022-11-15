import Link from "next/link";
import React from "react";
import { FiInfo, FiMenu, FiPenTool } from "react-icons/fi";
import DarkMode from "./DarkMode";

interface ILinkedButton {
  href: string;
  icon: React.ReactElement;
  text: string;
  primary: boolean;
  showTextOnMobile?: boolean;
}

const LinkedButton = ({
  href,
  icon,
  text,
  showTextOnMobile = false,
}: ILinkedButton) => (
  <React.Fragment>
    <Link href={href}>
      <a className="btn btn-ghost">
        {icon}
        <span
          className={`ml-2 ${!showTextOnMobile ? "hidden md:block" : "block"}`}
        >
          {text}
        </span>
      </a>
    </Link>
  </React.Fragment>
);

const TopButtons = () => {
  const buttons: ILinkedButton[] = [
    {
      href: "/page/1",
      icon: <FiPenTool size={20} />,
      text: "Blog",
      primary: true,
    },
    {
      href: "/about/",
      icon: <FiInfo size={20} />,
      text: "About",
      primary: false,
    },
  ];

  return (
    <React.Fragment>
      {buttons
        .filter((v) => v.primary)
        .map((button, i) => (
          <LinkedButton {...button} key={i} />
        ))}

      <div className="hidden md:block">
        {buttons
          .filter((v) => !v.primary)
          .map((button, i) => (
            <LinkedButton {...button} key={i} />
          ))}
      </div>

      <DarkMode />

      <div className="dropdown dropdown-end block md:hidden">
        <div tabIndex={0} className="btn btn-ghost ">
          <FiMenu size={20} />
          <div className="ml-2 hidden md:block">Menu</div>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu shadow bg-base-100 rounded-box p-4 w-52"
        >
          {buttons.map((button, i) =>
            button.primary ? null : (
              <li key={i}>
                <LinkedButton {...button} showTextOnMobile />
              </li>
            )
          )}
        </ul>
      </div>
    </React.Fragment>
  );
};

export default TopButtons;
