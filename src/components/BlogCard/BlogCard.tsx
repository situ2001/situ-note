import { Link } from 'gatsby';
import styled from 'styled-components';
import * as React from 'react';

type Props = {
  title: string;
  date: string;
  link: string;
  description: string | null;
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
  @media screen and (max-width: 740px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex-grow: 1;
  word-wrap: break-word;
  @media screen and (max-width: 740px) {
    width: 100%;
  }
`;

const Right = styled.div`
  flex-grow: 0;
`;

const Title = styled(Link)`
  font-size: 1.75rem;
  text-decoration: none;
  color: black;
`;

const ReadBtn = styled(Link)`
  & {
    color: black;
    background-color: white;
    text-decoration: none;
    border: 2px solid black;
    border-radius: 2px;
    padding: 0 20px;
    transition: background-color 0.2s ease-in-out;
  }
  &:hover {
    background-color: black;
    color: white;
  }
`;

const BlogCard = ({ title, date, link, description }: Props) => (
  <Container>
    <Left>
      <Title to={link}>{title}</Title>
      <p>
        {'Posted: '}
        {date}
      </p>
      <p>{description || 'Author is so lazy that he left nothing here.'}</p>
    </Left>
    <Right>
      <ReadBtn to={link}>{'>> Read'}</ReadBtn>
    </Right>
  </Container>
);

export default BlogCard;
