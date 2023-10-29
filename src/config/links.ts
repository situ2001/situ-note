import type { LinkButtonProps } from "../components/LinkButton";

import IconGitHub from "../assets/github.svg";
import IconMail from "../assets/mail.svg";

const links: LinkButtonProps[] = [
  {
    name: "Mail",
    link: "mailto:dogecong@gmail.com",
    iconUrl: IconMail.src,
  },
  {
    name: "GitHub",
    link: "https://github.com/situ2001",
    iconUrl: IconGitHub.src,
  },
];

export default links;
