import { useEffect } from "react";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | Tech Truz`;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
}
