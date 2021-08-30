import * as React from 'react';
import styled from 'styled-components';

type Props = {
  children: JSX.Element | JSX.Element[];
};

const Container = styled.div`
  margin-left: auto;
  margin-right: auto;
  /* padding-left: 20px;
  padding-right: 20px; */
`;

const MyContainer = ({ children }: Props) => (
  <Container className="px-4 md:px-8">{children}</Container>
);

export default MyContainer;
