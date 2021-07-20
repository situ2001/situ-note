import * as React from "react";
import Layout from '../components/Layout';

type Props = {
  location: Location;
};

const Index = (props: Props) => {
  const { location } = props;

  return (
    <Layout location={location}>
      <p>Welcome to my blog!</p>
      <p>Still under intense development.</p>
    </Layout>
  );
};

export default Index;