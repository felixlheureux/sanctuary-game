import React from 'react';
// @ts-ignore
import { X } from 'tabler-icons-react';

interface CharacterDialogProps {
  img: string;
  dialog: string;
  onClose: () => void;
}

const CharacterDialog: React.FC<CharacterDialogProps> = ({
  img,
  dialog,
  onClose,
}) => {
  const imgPath = () => {
    if (img === 'syf') return './images/ve.png';
    if (img === 'rin') return './images/syf.png';
    return './images/rin.png';
  };

  return (
    <div
      className={
        'relative max-w-4xl bg-[#EFEADB] mx-auto w-fit h-[200px]'
      }
    >
      <div className={'flex h-full border border-8 border-black'}>
        <img
          src={imgPath()}
          alt={''}
          className={
            'border border-r-8 border-black bg-black hidden md:inline-block'
          }
        />
        <p
          className={
            'text-mask py-5 px-6 text-black w-fit overflow-y-auto font-bold'
          }
        >
          {dialog}
        </p>
      </div>
      <div className={'absolute top-0 right-0'}>
        <button
          onClick={() => {
            // @ts-ignore
            document.querySelector(
              '#greeting-modal'
              // @ts-ignore
            ).style.visibility = 'hidden';
          }}
          className={'p-3'}
        >
          <X color={'black'} />
        </button>
      </div>
    </div>
  );
};

export default CharacterDialog;
