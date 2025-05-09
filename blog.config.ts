import type { BlogConfig } from './types';

import { BsGithub, BsTwitterX, BsInstagram, BsEnvelopeAt, BsTelegram, BsCode } from 'react-icons/bs';

const config: BlogConfig = {
  title: "situ2001",
  description: "Personal website of situ2001",
  author: "situ2001",
  email: "dogecong@gmail.com",

  hero: {
    greeting: "I am situ2001.",
    description: "I am a software developer. In my spare time, I enjoy tinkering with various projects, creating tools and apps for both personal enjoyment and the benefit of the community. I love sharing my insights online and diving deep into anything that truly fascinates me, not just technology.",
    contacts: [
      { name: "GitHub", link: "https://github.com/situ2001", icon: BsGithub },
      { name: "Twitter/X", link: "https://twitter.com/situ200l", icon: BsTwitterX },
      { name: "Telegram", link: "https://t.me/situ2001_channel", icon: BsTelegram },
      { name: "Instagram", link: "https://instagram.com/situ2oo1", icon: BsInstagram },
      { name: "Email", link: "mailto:dogecong@gmail.com", icon: BsEnvelopeAt },
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
    { title: "Web Dev", at: "TME", icon: BsCode },
  ],

  projects: [
    // {
    //   title: "Situ Note",
    //   description: "My personal website. This is what you are looking at right now.",
    //   link: "https://situ2001.com",
    //   tags: ["Astro", "React", "Tailwind CSS"],
    //   // icon: FiBook,
    //   featured: true
    // }
  ],

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
    { name: 'Corey Chiu', link: 'https://coreychiu.com' },
    { name: 'HuanXin', link: 'https://huanxin-chen.github.io/' },
    { name: 'lz233', link: 'https://with.fish/' }
  ]
}

export default config;
