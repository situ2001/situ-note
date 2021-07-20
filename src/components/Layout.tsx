import * as React from 'react';
import * as styles from '../styles/layout.module.css';
import Header from './Header';
import Footer from './Footer';

type Props = {
  location: Location;
  children: JSX.Element[] | JSX.Element;
  title?: string;
};

const Layout = (props: Props) => {
  const { children, location } = props;

  return (
    <main>
      <title>Situ Note</title>
      <div className={styles.container}>
        <Header location={location} />
        <div className={styles.main}>
          {children}
        </div>
        <Footer />
      </div>
    </main>
  );
}

export default Layout;