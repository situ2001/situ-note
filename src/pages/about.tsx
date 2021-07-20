import * as React from "react";
import Layout from '../components/Layout';
import * as styles from '../styles/about.module.css'

type Props = {
  location: Location;
};

const About = (props: Props) => {
  const { location } = props;

  return (
    <Layout location={location}>
      <div className={styles.container}>
        <p>This page intentionally leaves blank</p>
        <p>此页面有意留空</p>
      </div>
    </Layout>
  );
};

export default About;