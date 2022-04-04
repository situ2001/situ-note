import Link from "next/link";

const Header = () => {
  return (
    <header>
      <div className="flex py-4 text-xl">
        <div>
          <div>
            <Link href="/">Situ Note</Link>
          </div>
        </div>
        <div className="flex flex-1 justify-end">
          <div>
            <Link href="/page/">Blog</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
