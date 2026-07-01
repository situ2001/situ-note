import type { BlogConfig } from "./types";

import { BsGithub, BsTwitterX, BsTelegram, BsLinkedin } from "react-icons/bs";
import { BsRss } from "react-icons/bs";
import {
  Friendship,
  Keyboard,
  GroupObjects,
  Migrate,
  Query,
  CharacterFraction,
  PromptTemplate,
  Automatic,
  DirectionBearRight_02,
  Calendar,
  Stamp,
} from "@carbon/icons-react";

const config: BlogConfig = {
  title: "situ2001",
  description: "Frontend engineer by day, geek by night.",
  author: "situ2001",
  email: "dogecong@gmail.com",

  hero: {
    description: [],
    contacts: [
      { name: "GitHub", link: "https://github.com/situ2001", icon: BsGithub },
      {
        name: "Twitter/X",
        link: "https://twitter.com/situ2oo1",
        icon: BsTwitterX,
      },
      { name: "Telegram", link: "https://t.me/situ2001", icon: BsTelegram },
      // { name: "Instagram", link: "https://www.threads.com/@situ2oo1", icon: BsThreads },
      {
        name: "LinkedIn",
        link: "https://www.linkedin.com/in/situ2001/",
        icon: BsLinkedin,
      },
    ],
  },

  nav: {
    items: [
      { name: "Blog", link: "/blog" },
      // { name: "Insights", link: "/insight", },
      { name: "Projects", link: "/projects" },
      {
        name: "Friends",
        link: "/friends",
        icon: Friendship,
        autoMinimal: true,
      },
      { name: "RSS", link: "/rss.xml", icon: BsRss, forceMinimal: true },
    ],
  },

  projects: [
    {
      title: "KeyPhantom",
      description:
        "Send keyboard events silently to background macOS applications.",
      link: "https://github.com/situ2001/KeyPhantom",
      icon: Keyboard,
      featured: true,
      section: "featured",
    },
    {
      title: "Obsidian Tab Group Arrangement",
      description: "Arrange your tabs in Obsidian like VS Code.",
      link: "https://github.com/situ2001/obsidian-tab-group-arrangement",
      icon: GroupObjects,
      featured: true,
      section: "featured",
    },
    {
      title: "gitea-bulk-migration",
      description: "CLI for bulk migration of repositories to Gitea.",
      link: "https://github.com/situ2001/gitea-bulk-migration",
      icon: Migrate,
      featured: true,
      section: "featured",
    },
    {
      title: "auto-adb",
      description:
        "Automatically configure proxy and port forwarding when an Android device is connected over ADB.",
      link: "https://github.com/situ2001/auto-adb",
      icon: Automatic,
      featured: true,
      section: "featured",
    },
    {
      title: "which-npm",
      description:
        "Locate the npm package that owns the current file or directory.",
      link: "https://github.com/situ2001/which-npm",
      icon: Query,
      featured: true,
      section: "featured",
    },
    {
      title: "scoped-rem",
      description:
        "Webpack loader that rewrites rem units relative to a custom root font size.",
      link: "https://github.com/situ2001/scoped-rem",
      icon: DirectionBearRight_02,
      featured: true,
      section: "featured",
    },
    {
      title: "unplugin-mcp",
      description:
        "Explore how MCP can expose JS bundler inputs, process, and outputs to AI agents.",
      link: "https://github.com/situ2001/unplugin-mcp",
      icon: PromptTemplate,
      section: "experiment",
    },

    {
      title: "oh-pluralize",
      description: "Pluralize library for OpenHarmony.",
      link: "https://github.com/situ2001/oh-pluralize",
      icon: CharacterFraction,
    },
    {
      title: "nth-week",
      description: "Quickly query what the week is now.",
      link: "https://github.com/situ2001/nth-week",
      icon: Calendar,
    },
    {
      title: "picmark",
      description:
        "Add watermarks to your images in just a few lines of command or code.",
      link: "https://github.com/situ2001/picmark",
      icon: Stamp,
      section: "experiment",
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
    { name: "cos", link: "https://ysx.cosine.ren/" },
    { name: "Corey Chiu", link: "https://coreychiu.com" },
    { name: "HuanXin", link: "https://huanxin-chen.github.io/" },
    { name: "lz233", link: "https://with.fish/" },
    { name: "liruifengv", link: "https://liruifengv.com" },
    { name: "Guoqi Sun", link: "https://blog.guoqi.dev" },
    { name: "Charles", link: "https://www.charles-cheng.com/" },
    { name: "Zhongye", link: "https://zhongye.github.io" },
    { name: "HoHouman", link: "https://leidun.pp.ua" },
  ],
};

export default config;
