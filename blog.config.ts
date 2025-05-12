import type { BlogConfig } from './types';

import { BsGithub, BsTwitterX, BsInstagram, BsEnvelopeAt, BsTelegram, BsLinkedin } from 'react-icons/bs';
import { BsRss } from "react-icons/bs";
import { Friendship, Keyboard, GroupObjects, Migrate, Query, CharacterFraction, PromptTemplate } from '@carbon/icons-react';

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
      { name: "Telegram", link: "https://t.me/situ2001", icon: BsTelegram },
      { name: "Instagram", link: "https://instagram.com/situ2oo1", icon: BsInstagram },
      { name: "Email", link: "mailto:dogecong@gmail.com", icon: BsEnvelopeAt },
      { name: "LinkedIn", link: "https://www.linkedin.com/in/situ2001/", icon: BsLinkedin },
    ]
  },

  nav: {
    items: [
      { name: "Blog", link: "/blog", greeting: "Check my thoughts and ideas." },
      { name: "Projects", link: "/projects", greeting: "Check my projects." },
      { name: "Friends", link: "/friends", greeting: "You can visit my friends.", icon: Friendship, autoMinimal: true },
      { name: "RSS", link: "/rss.xml", greeting: "Why not subscribe to my RSS feed?", icon: BsRss, forceMinimal: true },
    ]
  },

  projects: [
    {
      title: "KeyPhantom",
      description: "Send keyboard events silently to background macOS applications.",
      link: "https://github.com/situ2001/KeyPhantom",
      icon: Keyboard
    },
    {
      title: "Unplugin MCP",
      description: "Let AI know more about your code and build process from JS bundlers.",
      link: "https://github.com/situ2001/unplugin-mcp",
      icon: PromptTemplate,
    },
    {
      title: "Obsidian Tab Group Arrangement",
      description: "Arrange your tabs in Obsidian like vscode.",
      link: "https://github.com/situ2001/obsidian-tab-group-arrangement",
      icon: GroupObjects
    },
    {
      title: "gitea-bulk-migration",
      description: "CLI for bulk migration of repositories to Gitea.",
      link: "https://github.com/situ2001/gitea-bulk-migration",
      icon: Migrate
    },

    {
      title: "which-npm",
      description: "CLI for locating the npm package of a given filename or path.",
      link: "https://github.com/situ2001/which-npm",
      icon: Query
    },
    {
      title: "oh-pluralize",
      description: "Pluralize library for OpenHarmony.",
      link: "https://github.com/situ2001/oh-pluralize",
      icon: CharacterFraction
    },
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
