import * as React from "react";
import Container from '../components/Container';
import Layout from '../components/Layout';

type Props = {
  location: Location;
};

const About = (props: Props) => {
  const { location } = props;

  return (
    <Layout location={location}>
      <Container>
          <article>
            <p>This page intentionally leaves blank</p>
            <p>此页面有意留空</p>
          </article>
      </Container>
    </Layout>
  );
};

export default About;