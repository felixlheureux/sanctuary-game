import React, { useState } from "react";
// @ts-ignore
import { CHARACTERS_ASSETS_URL } from "@childrenofukiyo/core";
import { Skeleton } from "@mantine/core";

interface ModalProps {
  tokenID: number | string;
  name: string;
  aka: string;
  description: string;
}

const CharacterCard: React.FC<ModalProps> = ({ tokenID, name, aka, description }) => {
  const [ loaded, setLoaded ] = useState(false);

  return (
    <div
      className={"bg-[#c66bff]/50 bg-black shadow-xl md:w-full"}>
      <div className={"relative w-full aspect-square"}>
        <img className={`animate-duration-[1s] w-full ${loaded && "animate-fadeIn"}`}
             src={`${CHARACTERS_ASSETS_URL}/${tokenID}.png`}
             alt={name}
             onLoad={() => setLoaded(true)} />
        {!loaded &&
          <Skeleton className={"absolute top-0 left-0 w-full aspect-square"} />
        }
      </div>
      <div
        className={"w-full text-center text-white font-bold text-4xl p-4 font-bangers tracking-wide bg-[#010722]/50"}>
        <p className={"font-normal tracking-widest"}>{name}</p>
      </div>
      <div className={"text-white p-4 font-bold bg-[#110a1b] text-center"}>
        <p>{aka}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default CharacterCard;