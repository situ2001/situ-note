import Footer from "./Footer";
import Header from "./Header";

const Layout = ({
  children,
  flex = false,
  center = false,
  hideHeader = false,
}: {
  children: React.ReactNode;
  flex?: boolean;
  center?: boolean;
  hideHeader?: boolean;
}) => {
  return (
    <div className="px-4 md:px-16 flex flex-col min-h-screen">
      {!hideHeader && <Header />}
      <main
        className={`flex-1 ${
          flex && `flex flex-col ${center && `items-center`}`
        }`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
