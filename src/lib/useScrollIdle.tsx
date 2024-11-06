import { useState, useEffect, useRef } from 'react';

const useScrollIdle = (idleDelay = 200, scrollThreshold = 100) => {
  const [isIdle, setIsIdle] = useState(true);
  let idleTimeout: NodeJS.Timeout;
  let lastScrollY = useRef(0);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const scrollDistance = Math.abs(scrollY - lastScrollY.current);

    if (scrollDistance > scrollThreshold) {
      setIsIdle(false);
      lastScrollY.current = scrollY; // Update lastScrollY to current position
      
      if (idleTimeout) {
        clearTimeout(idleTimeout);
      }

      idleTimeout = setTimeout(() => {
        setIsIdle(true);
      }, idleDelay);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (idleTimeout) {
        clearTimeout(idleTimeout);
      }
    };
  }, []); // Dependency array is empty to run only on mount/unmount

  return isIdle;
};

export default useScrollIdle;
