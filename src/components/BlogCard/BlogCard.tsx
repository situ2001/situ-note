import { Link } from 'gatsby';
import styled from 'styled-components';
import * as React from 'react';

type Props = {
  title: string;
  date: string;
  link: string;
  description: string | null;
};

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
  <div className="shadow hover:shadow-lg transform hover:scale-105 transition-transform delay-50 p-4 rounded w-11/12 flex flex-col md:flex-row flex-wrap items-center mb-4">
    <div className="flex-grow break-words">
      <Link className="text-3xl block text-center md:text-left mb-1" to={link}>
        {title}
      </Link>
      <p className="text-center md:text-left mb-4">{date}</p>
      <p>{description || 'Author is so lazy that he left nothing here.'}</p>
    </div>
    <div className="flex-grow-0">
      <ReadBtn className="hidden md:block rounded-full" to={link}>
        {'>> Read'}
      </ReadBtn>
    </div>
  </div>
);

export default BlogCard;
