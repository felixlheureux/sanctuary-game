import React from "react";
import Image from "../image";

interface CharacterCardProps {
  tokenId: number,
  name: string,
  imageURL: string,
  onClick?: () => void
}

const CharacterCard: React.FC<CharacterCardProps> = ({ tokenId, name, imageURL, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={"w-full rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all ease-in-out hover:-translate-y-0.5"}>
      <Image
        className={"relative w-full aspect-square rounded-t-xl overflow-hidden"}
        src={imageURL}
        alt={`Character image ${tokenId}`} />
      <div className="p-4 flex justify-between">
        <p className="font-medium text-sm">{name}</p>
        <p className="font-medium text-sm">#{tokenId}</p>
      </div>
    </div>
  );
};

export default CharacterCard;