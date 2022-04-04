import Footer from "./Footer";
import Header from "./Header";

// TODO 添加 Footer
const Layout = (props: { children: React.ReactNode }) => {
  const { children } = props;
  return (
    <div className="px-4 md:px-16 flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
