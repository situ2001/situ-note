import Link from "next/link";
import { FiEdit3, FiGithub, FiHome, FiMenu, FiPenTool } from "react-icons/fi";
import DarkMode from "./DarkMode";
import TopButtons from "./TopButtons";

const Header = () => {
  return (
    <header>
      <div className="flex py-2 items-center">
        <Link href="/">
          <div className="btn btn-ghost items-center px-0">
            <div className="text-xl normal-case">Situ Note</div>
          </div>
        </Link>

        <div className="flex flex-1 justify-end items-center">
          <TopButtons />
        </div>
      </div>
    </header>
  );
};

export default Header;
