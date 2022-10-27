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
    <div className="px-4 md:px-8 flex flex-col h-screen mx-auto max-w-3xl">
      {!hideHeader && <Navbar />}
      <main
        className={`flex-1 ${
          flex && `flex flex-col ${center && `items-center`}`
        }`}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
