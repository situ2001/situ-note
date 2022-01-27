import { useEffect } from "react";

const useDocumentTitle = (title: string, suffix: string = " - Situ Note") => {
  useEffect(() => {
    const currentTitle = document.title;
    document.title = title + suffix;
    return () => {
      document.title = currentTitle;
    };
  }, [title, suffix]);
};

export default useDocumentTitle;
