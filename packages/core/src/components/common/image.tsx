import React, { useState } from "react";
import { Skeleton } from "@mantine/core";

interface ImageProps {
  className: string;
  src: string;
  alt: string;
}

const Image: React.FC<ImageProps> = ({ className, src, alt }) => {
  const [ loaded, setLoaded ] = useState(false);

  return (
    <div
      className={`relative  w-full ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`animate-duration-[1s] w-full ${loaded && "animate-fadeIn"}`}
        onLoad={() => setLoaded(true)} />
      {!loaded &&
        <Skeleton className={`absolute top-0 left-0 w-full ${className}`} />
      }
    </div>
  );
};

export default Image;