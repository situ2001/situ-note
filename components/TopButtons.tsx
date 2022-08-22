import Link from "next/link";
import React from "react";
import { FiGithub, FiPenTool } from "react-icons/fi";
import DarkMode from "./DarkMode";

const TopButtons = () => {
  return (
    <React.Fragment>
      <Link href="https://github.com/situ2001">
        <div className="btn btn-ghost">
          <FiGithub size={20} />
          <div className="ml-2 hidden md:block">Github</div>
        </div>
      </Link>
      <Link href="/page/">
        <div className="btn btn-ghost">
          <FiPenTool size={20} />
          <div className="ml-2 hidden md:block">Blog</div>
        </div>
      </Link>
      <DarkMode />
    </React.Fragment>
  );
};

export default TopButtons;
