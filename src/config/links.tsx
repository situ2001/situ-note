import type { IconLinkProps } from "../components/IconLink";
import { FaGithub, FaTwitter } from "react-icons/fa6";

// Credit: https://simpleicons.org/
import IconMail from "../assets/gmail.svg";

const links: IconLinkProps[] = [
  {
    name: "GitHub",
    link: "https://github.com/situ2001",
    icon: FaGithub,
  },
  {
    name: "Twitter",
    link: "https://twitter.com/situ200l",
    icon: FaTwitter,
  },
  {
    name: "Gmail",
    link: "mailto:dogecong@gmail.com",
    icon: IconMail,
  },
];

export default links;
