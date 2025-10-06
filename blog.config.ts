import type { BlogConfig } from './types';

import { BsGithub, BsTwitterX, BsInstagram, BsEnvelopeAt, BsTelegram, BsLinkedin } from 'react-icons/bs';
import { BsRss } from "react-icons/bs";
import { Friendship, Keyboard, GroupObjects, Migrate, Query, CharacterFraction, PromptTemplate, Automatic, DirectionBearRight_02 } from '@carbon/icons-react';

const config: BlogConfig = {
  title: "situ2001",
  description: "With curiosity, I explore tech; with empathy, I build value.",
  author: "situ2001",
  email: "dogecong@gmail.com",

  hero: {
    description: [
      "I enjoy creating and solving problems, and I am passionate about how technology can improve user experience. I am keen to explore the essence of things and pursue solutions that are simple yet thoughtfully designed. This curiosity and empathy drive me to undertake broad technical practice and to give back to the community by sharing insights through open-source contributions and writing."
    ],
    contacts: [
      { name: "GitHub", link: "https://github.com/situ2001", icon: BsGithub },
      { name: "Twitter/X", link: "https://twitter.com/situ2oo1", icon: BsTwitterX },
      { name: "Telegram", link: "https://t.me/situ2001", icon: BsTelegram },
      { name: "Instagram", link: "https://instagram.com/situ2oo1", icon: BsInstagram },
      { name: "Email", link: "mailto:dogecong@gmail.com", icon: BsEnvelopeAt },
      { name: "LinkedIn", link: "https://www.linkedin.com/in/situ2001/", icon: BsLinkedin },
    ]
  },

  nav: {
    items: [
      { name: "Blog", link: "/blog", },
      { name: "Insights", link: "/insight", },
      { name: "Projects", link: "/projects" },
      { name: "Friends", link: "/friends", icon: Friendship, autoMinimal: true },
      { name: "RSS", link: "/rss.xml", icon: BsRss, forceMinimal: true },
    ]
  },

  projects: [
    {
      title: "KeyPhantom",
      description: "Send keyboard events silently to background macOS applications.",
      link: "https://github.com/situ2001/KeyPhantom",
      icon: Keyboard,
      featured: true
    },
    {
      title: "Unplugin MCP",
      description: "Let AI know more about your code and build process from JS bundlers.",
      link: "https://github.com/situ2001/unplugin-mcp",
      icon: PromptTemplate,
      featured: true
    },
    {
      title: "Obsidian Tab Group Arrangement",
      description: "Arrange your tabs in Obsidian like vscode.",
      link: "https://github.com/situ2001/obsidian-tab-group-arrangement",
      icon: GroupObjects,
      featured: true
    },
    {
      title: "gitea-bulk-migration",
      description: "CLI for bulk migration of repositories to Gitea.",
      link: "https://github.com/situ2001/gitea-bulk-migration",
      icon: Migrate,
      featured: true
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
    {
      title: "auto-adb",
      description: "Automatically execute commands when Android device is adb-connected.",
      link: "https://github.com/situ2001/auto-adb",
      icon: Automatic
    },
    {
      title: "scoped-rem",
      description: "Webpack loader that transforms rem units to be relative to a custom root font size.",
      link: "https://github.com/situ2001/scoped-rem",
      icon: DirectionBearRight_02
    }
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
    { name: 'lz233', link: 'https://with.fish/' },
    { name: "liruifengv", link: "https://liruifengv.com" }
  ]
}

export default config;
