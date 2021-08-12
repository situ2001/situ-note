import * as React from 'react';
import * as styles from '../styles/layout.module.css';
import Header from './Header';
import Footer from './Footer';
import Menu from './Menu';

type Props = {
  location: Location;
  children: JSX.Element[] | JSX.Element;
  title?: string; // TODO
};

const Layout = (props: Props) => {
  const { children, location } = props;

  const [open, setOpen] = React.useState(false);

  return (
    <main>
      <title>Situ Note</title>
      <div className={styles.container}>
        <Header setOpen={setOpen} />
        <div className={styles.main}>
          {children}
        </div>
        <Menu open={open} setOpen={setOpen} location={location} />
        <Footer />
      </div>
    </main>
  );
};

export default Layout;
