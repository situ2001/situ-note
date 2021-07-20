import * as React from "react";
import Layout from '../components/Layout';
import Container from '../components/Container';

type Props = {
  location: Location;
};

const Index = (props: Props) => {
  const { location } = props;

  return (
    <Layout location={location}>
      <Container>
        <p>Welcome to my blog!</p>
        <p>Still under intense development.</p>
      </Container>
    </Layout>
  );
};

export default Index;