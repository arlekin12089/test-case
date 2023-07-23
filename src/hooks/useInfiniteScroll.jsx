import { useState, useEffect, useRef } from "react";

const useInfiniteScroll = (callback) => {
  const observer = useRef();
  const lastElementRef = useRef(null);

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    if (lastElementRef.current) {
      observer.current.observe(lastElementRef.current);
    }

    return () => observer.current.disconnect();
  }, [callback]);

  return lastElementRef;
};

export default useInfiniteScroll;
