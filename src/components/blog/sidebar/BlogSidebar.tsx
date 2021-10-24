import * as React from 'react';
import Pagination from '../pagination';

const BlogSidebar = ({ currentPage, totalPage }: any) => {
  return (
    <div className="hidden md:flex flex-col justify-center md:w-3/12 shadow-lg rounded max-h-screen fixed top-0 right-0 h-screen">
      <div className="text-4xl">
        <p className="cursor-pointer my-2 py-4 border-l-4 border-blue-300 pl-7 bg-gradient-to-l from-purple-50 to-blue-50">
          POST
        </p>
        <p className="my-2 py-4 border-l-4 border-white pl-7 transition-colors delay-100 hover:border-blue-300">
          ARCHIVE
        </p>
        <p className="my-2 py-4 border-l-4 border-white pl-7 transition-colors delay-100 hover:border-blue-300">
          CATEGORY
        </p>
      </div>
      <div className="absolute text-2xl bottom-0 right-0 w-full">
        <Pagination
          prevTo={currentPage === 2 ? '/blog' : `/blog/page/${currentPage - 1}`}
          prevText={currentPage !== 1 ? '<' : null}
          nextTo={
            currentPage !== totalPage ? `/blog/page/${currentPage + 1}` : null
          }
          nextText={currentPage !== totalPage ? '>' : null}
          currentText={`${currentPage} / ${totalPage}`}
        />
      </div>
    </div>
  );
};

export default BlogSidebar;
