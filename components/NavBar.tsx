import Link from "next/link";
import TopButtons from "./TopButtons";

const NavBar = () => {
  return (
    <nav>
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
    </nav>
  );
};

export default NavBar;
