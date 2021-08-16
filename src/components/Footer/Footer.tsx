import * as React from 'react';
import styled from 'styled-components';

const Footer = styled.footer`
  margin-top: auto;
  display: flex;
  justify-content: center;
  padding-top: 16px;
  padding-bottom: 16px;
`;

const MyFooter = () => (
  <Footer>
    Made with ❤ by&nbsp;
    <a
      href="https://www.github.com/situ2001"
      style={{ color: 'black', textDecoration: 'none' }}
    >
      situ2001
    </a>
  </Footer>
);

export default MyFooter;
