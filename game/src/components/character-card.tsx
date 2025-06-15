import { Skeleton } from '@mantine/core';
import React, { useState } from 'react';

interface CharacterCardProps {
  tokenID: string;
  name: string;
  onClick?: () => void;
  selected?: boolean;
  className?: string;
}

const CharacterCard: React.FC<CharacterCardProps> = ({
  tokenID,
  name,
  onClick,
  className,
  selected,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`${className} bg-black cursor-pointer bg-[#c66bff]/50 shadow-xl w-full hover:border hover:border-8 hover:border-white transition-all ${
        selected ? 'border border-8 border-white' : ''
      }`}
    >
      <div className={'relative w-full aspect-square'}>
        <img
          className={`animate-duration-[1s] w-full ${
            loaded && 'animate-fadeIn'
          }`}
          src={`./images/${tokenID}.png`}
          alt={name}
          onLoad={() => setLoaded(true)}
        />
        {!loaded && (
          <Skeleton
            className={'absolute top-0 left-0 w-full aspect-square'}
          />
        )}
      </div>
      <div
        className={
          'w-full text-center text-white font-bold text-4xl p-6 font-bangers tracking-widest bg-[#010722]/50'
        }
      >
        <p>{name}</p>
      </div>
      <button
        className={
          'w-full text-center text-white font-bold text-4xl p-6 font-bangers tracking-wide bg-[#110a1b] tracking-widest'
        }
      >
        <div>{selected ? 'Selected' : 'Select'}</div>
      </button>
    </div>
  );
};

export default CharacterCard;
