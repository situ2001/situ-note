import type { IconLinkProps } from "../components/IconLink";

// Credit: https://simpleicons.org/
import IconGitHub from "../assets/github.svg";
import IconMail from "../assets/gmail.svg";
import IconX from '../assets/x.svg';

const links: IconLinkProps[] = [
  {
    name: "GitHub",
    link: "https://github.com/situ2001",
    iconUrl: IconGitHub.src,
  },
  {
    name: "Twitter",
    link: "https://twitter.com/situ200l",
    iconUrl: IconX.src,
  },
  {
    name: "Gmail",
    link: "mailto:dogecong@gmail.com",
    iconUrl: IconMail.src,
  },
];

export default links;
