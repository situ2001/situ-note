import * as React from 'react';
import Layout from '../components/Layout';
import Container from '../components/Container';

type Props = {
  location: Location;
};

const About = (props: Props) => {
  const { location } = props;

  return (
    <Layout location={location}>
      <Container>
        <article>
          <p>This page is intentionally left blank</p>
          <p>此页面有意留空</p>
        </article>
      </Container>
    </Layout>
  );
};

export default About;
