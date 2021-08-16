import * as React from 'react';
import styled from 'styled-components';

type Props = {
  children: JSX.Element | JSX.Element[],
}

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  padding-left: 20px;
  padding-right: 20px;
  @media screen and (min-width: 1340px) {
    display: block;
    max-width: 1260px;
  }
  @media screen and (min-width: 740px) {
    width: 90%;
  }
`;

const MyContainer = ({ children }: Props) => (
  <Container>
    {children}
  </Container>
);

export default MyContainer;
