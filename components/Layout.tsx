import Footer from "./Footer";
import Navbar from "./NavBar";

const Layout = ({
  children,
  flex = false,
  center = false,
  hideHeader = false,
  hideFooter = false,
}: {
  children: React.ReactNode;
  flex?: boolean;
  center?: boolean;
  hideHeader?: boolean;
  hideFooter?: boolean;
}) => {
  return (
    <div className="flex flex-col h-screen">
      <main
        className={`flex-1 ${
          flex && `flex flex-col ${center && `items-center`}` // TODO use npm package `cls`
        }`}
      >
        {!hideHeader && <Navbar />}
        <div className="px-4 mx-auto w-full max-w-3xl">{children}</div>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
