import * as React from 'react';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import Menu from './Menu';

type Props = {
  location: Location;
  children: JSX.Element[] | JSX.Element;
  title?: string; // TODO
};

const Content = styled.div`
  padding-top: 16px;
  padding-bottom: 16px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Layout = (props: Props) => {
  const { children, location } = props;

  const [open, setOpen] = React.useState(false);

  return (
    <main>
      <title>Situ Note</title>
      <Container>
        <Header setOpen={setOpen} />
        <Content>{children}</Content>
        <Menu open={open} setOpen={setOpen} location={location} />
        <Footer />
      </Container>
    </main>
  );
};

export default Layout;
