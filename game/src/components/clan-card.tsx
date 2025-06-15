import React, { ReactNode } from 'react';
// @ts-ignore
import { ClANS_ASSETS_URL } from '@childrenofukiyo/core';
// @ts-ignore
import logo from '../favicon.png';

interface ClanCardProps {
  name: string;
  content: string | ReactNode;
  img: string;
  color: string;
  visibility: string;
}

const ClanCard: React.FC<ClanCardProps> = ({
  name,
  content,
  img,
  color,
  visibility,
}) => {
  return (
    <div
      className={
        'bg-[#000000eb] w-full h-[500px] xl:h-full flex justify-center items-center flex-col ' +
        visibility
      }
    >
      <div
        className={
          'w-full flex items-center justify-center pt-6 tall:xl:mt-16 tall:xl:mb-8'
        }
      >
        <img
          src={`${
            img !== 'logo' ? `${ClANS_ASSETS_URL}/${img}.png` : logo
          }`}
          alt={name}
          className={`object-fit max-w-[128px] tall:xl:max-w-[200px] ${
            img === 'child' ? 'opacity-20' : ''
          }`}
        />
      </div>
      <div
        className={'w-full text-center text-white p-4 tall:xl:mb-12'}
      >
        <h3 className={color}>{name}</h3>
      </div>
      <div
        className={
          'text-white p-4 xl:px-8 tall:xl:py-12 font-bold bg-[#1e1e1e] text-justify overflow-y-auto tall:xl:text-lg'
        }
      >
        {content}
        <span className={'text-[#1e1e1e]'}>as</span>
      </div>
    </div>
  );
};

export default ClanCard;
