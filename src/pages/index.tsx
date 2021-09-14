import * as React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { FiPenTool, FiGithub, FiInfo } from 'react-icons/fi';
import { Link } from 'gatsby';

const Index = () => {
  // TODO: Complete personal card
  return (
    <main>
      <title>Situ Note</title>
      <div className="container flex min-h-screen p-8 justify-center md:items-center mx-auto">
        {/* Card starts */}
        <div className="w-full h-full md:shadow-lg md:rounded-2xl md:max-w-screen-sm">
          <div className="max-w-md mx-auto w-full flex flex-col justify-center md:p-8">
            {/* avatar & nickname */}
            <div className="mx-auto my-4 self-center">
              <div className="w-24 h-auto">
                <StaticImage
                  src="../images/28241963.jpg"
                  alt="test"
                  className="rounded-full"
                />
              </div>
              <p className="text-center mt-2">situ2001</p>
            </div>
            {/* intro */}
            <p className="text-center">Welcome to my site</p>
            {/* Links */}
            <div className="flex justify-center m-4">
              <Link to="/blog" className="mx-2">
                <FiPenTool />
              </Link>
              <Link to="https://github.com/situ2001" className="mx-2">
                <FiGithub />
              </Link>
              <Link to="/about" className="mx-2">
                <FiInfo />
              </Link>
            </div>
          </div>
        </div>
        {/* Card ends */}
      </div>
    </main>
  );
};

export default Index;
