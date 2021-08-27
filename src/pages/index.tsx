import * as React from 'react';
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
        <p>Welcome to my site!</p>
        <p>Still under intense development.</p>
        <p>
          So if you are looking for my other posts, just{' '}
          <a href="https://old.situ2001.com">click here</a> to visit.
        </p>
      </Container>
    </Layout>
  );
};

export default Index;
