import Footer from "./Footer";
import Navbar from "./NavBar";

const Layout = ({
  children,
  hideHeader = false,
  hideFooter = false,
}: {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
}) => {
  return (
    <div className="flex flex-col h-screen">
      <main className={`flex-1`}>
        {!hideHeader && <Navbar />}
        <div className="px-4 mx-auto w-full max-w-3xl">{children}</div>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
