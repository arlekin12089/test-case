// useInfiniteScroll.js
import { useEffect, useRef } from "react";

const useInfiniteScroll = (callback) => {
  const observer = useRef();
  const lastElementRef = useRef();

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0,
    };

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    }, options);

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [callback]);

  return lastElementRef;
};

export default useInfiniteScroll;
