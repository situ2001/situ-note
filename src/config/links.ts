import type { IconLinkProps } from "../components/IconLink";
import { FaGithub, FaXTwitter, FaInstagram, FaTelegram, FaBilibili } from "react-icons/fa6";


const links: IconLinkProps[] = [
  {
    name: "GitHub",
    link: "https://github.com/situ2001",
    icon: FaGithub,
  },
  {
    name: "Twitter",
    link: "https://twitter.com/situ200l",
    icon: FaXTwitter,
  },
  {
    name: "Telegram",
    link: "https://t.me/situ2001_channel",
    icon: FaTelegram,
  },
  {
    name: "Instagram",
    link: "https://instagram.com/situ2oo1",
    icon: FaInstagram,
  }
];

export default links;
