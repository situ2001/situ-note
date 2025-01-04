import type { BlogConfig } from './types';

import { FaGithub, FaXTwitter, FaInstagram, FaTelegram } from "react-icons/fa6";

const config: BlogConfig = {
  title: "Situ Note",
  description: "Personal website of situ2001",
  author: "situ2001",
  email: "dogecong@gmail.com",

  hero: {
    greeting: "I am situ2001.",
    description: "A software developer.",
    contacts: [
      { name: "GitHub", link: "https://github.com/situ2001", icon: FaGithub, },
      { name: "Twitter", link: "https://twitter.com/situ200l", icon: FaXTwitter, },
      { name: "Telegram", link: "https://t.me/situ2001_channel", icon: FaTelegram, },
      { name: "Instagram", link: "https://instagram.com/situ2oo1", icon: FaInstagram, }
    ]
  },

  nav: {
    items: [
      { name: "Blog", link: "/blog", greeting: "Check my thoughts and ideas." },
      { name: "Friends", link: "/friends", greeting: "You can visit my friends." },
      { name: "RSS", link: "/rss.xml", greeting: "Why not subscribe to my RSS feed?" },
    ]
  },

  roles: [
    { title: "Web Dev", at: "TME" },
    { title: "Open Source Contributor" },
    { title: "Writer" }
  ],

  projects: [],

  friends: [
    { name: "Airing", link: "https://ursb.me" },
    { name: "EMimTY", link: "https://www.eaimty.com" },
    { name: "Yuzi", link: "https://yuzi.dev" },
    { name: "RH-Xie", link: "https://rhxie.top" },
    { name: "7gugu", link: "https://7gugu.com" },
    { name: "songhn", link: "https://songhn.com" },
    { name: "younggglcy", link: "https://www.younggglcy.com/" },
    { name: "Talaxy", link: "https://www.talaxy.site/" },
    { name: "Lakphy", link: "https://lakphy.me/" },
    { name: 'cos', link: 'https://ysx.cosine.ren/' },
    { name: 'Corey Chiu', link: 'https://coreychiu.com' }
  ]
}

export default config;
