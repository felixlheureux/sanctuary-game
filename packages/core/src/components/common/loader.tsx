import React from "react";
import scroll from "../../../../assets/scroll.png";

const Loader: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img className={"object-contain h-[128px] animate-bounce animate-duration-[1000] animate-infinite"}
         src={scroll}
         alt={"Loader"} />
  );
};

export default Loader;