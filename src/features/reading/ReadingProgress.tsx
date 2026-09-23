import { useEffect, useState } from "react";

export interface ReadingProgressProps {
  querySelector: string;
}

export default function ReadingProgress(props: ReadingProgressProps) {
  let { querySelector } = props;

  const [readingProgress, setReadingProgress] = useState(0);
  const getReadingProgress = () => {
    const contentRef = document.querySelector(querySelector);

    if (!contentRef) return;

    // compute reading progress
    let contentHeight = contentRef.clientHeight;
    let documentOffset = document.documentElement.scrollTop;
    let contentHeightForComputation = contentHeight - window.outerHeight; // base line is the top of the viewport when scrolled to the bottom

    let progress = Math.floor((documentOffset / contentHeightForComputation) * 100);

    // restrict progress to 0-100
    progress = Math.min(progress, 100);
    progress = Math.max(progress, 0);

    setReadingProgress(progress);
  };

  useEffect(() => {
    getReadingProgress();
    window.addEventListener("scroll", getReadingProgress);
    return () => {
      window.removeEventListener("scroll", getReadingProgress);
    };
  }, []);

  return <div>Read {readingProgress}%</div>
}
