import type { LinkButtonProps } from "../components/LinkButton";

// Credit: https://simpleicons.org/
import IconGitHub from "../assets/github.svg";
import IconMail from "../assets/gmail.svg";
import IconX from '../assets/x.svg';

const links: LinkButtonProps[] = [
  {
    name: "Mail me",
    link: "mailto:dogecong@gmail.com",
    iconUrl: IconMail.src,
  },
  {
    name: "GitHub",
    link: "https://github.com/situ2001",
    iconUrl: IconGitHub.src,
  },
  {
    name: "X(Twitter)",
    link: "https://twitter.com/situ2oo1",
    iconUrl: IconX.src,
  }
];

export default links;
