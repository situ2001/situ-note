import Link from "next/link";
import TopButtons from "./TopButtons";

const NavBar = () => {
  return (
    <nav className="top-0 sticky backdrop-blur-xl z-50 px-4">
      <div className="flex py-2 items-center max-w-3xl mx-auto">
        <Link href="/">
          <div className="btn btn-ghost items-center px-0">
            <div className="text-xl normal-case">Situ Note</div>
          </div>
        </Link>

        <div className="flex flex-1 justify-end items-center">
          <TopButtons />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
