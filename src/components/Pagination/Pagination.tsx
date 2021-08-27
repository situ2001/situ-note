import { Link } from 'gatsby';
import * as React from 'react';
import styled from 'styled-components';

type Props = {
  prevText: string;
  prevTo: string;
  nextText: string;
  nextTo: string;
  currentText?: string;
};

const Container = styled.nav`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 24px 32px;
`;

const StyledLink = styled(Link)`
  color: black;
  text-decoration: none;
`;

const Pagination = ({
  prevText,
  prevTo,
  nextText,
  nextTo,
  currentText,
}: Props) => (
  <Container>
    <div>
      <StyledLink to={prevTo}>{prevText}</StyledLink>
    </div>
    <div>{currentText}</div>
    <div>
      <StyledLink to={nextTo}>{nextText}</StyledLink>
    </div>
  </Container>
);

Pagination.defaultProps = {
  currentText: '',
};

export default Pagination;
