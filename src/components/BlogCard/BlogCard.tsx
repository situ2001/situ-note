import { Link } from 'gatsby';
import styled from 'styled-components';
import * as React from 'react';

type Props = {
  title: string;
  date: string;
  link: string;
  description: string | null;
};

const BlogCard = ({ title, date, link, description }: Props) => (
  <div className="shadow hover:shadow-lg transform hover:scale-105 transition-transform delay-50 p-4 rounded w-11/12 flex flex-col md:flex-row flex-wrap items-center mb-4">
    <div className="flex-grow break-words">
      <Link
        className="text-3xl block max-w-max text-center md:text-left mb-1"
        to={link}
      >
        {title}
      </Link>
      <p className="text-center md:text-left mb-4">{date}</p>
      <p>{description || 'Author is so lazy that he left nothing here.'}</p>
    </div>
  </div>
);

export default BlogCard;
