import React from 'react';
import { SwiperSlide } from 'swiper/react';
import Carousel from '../components/carousel';
import CharacterCard from '../components/character-card';

const characters = [
  {
    tokenID: 1,
    name: 'Rin',
    model: 'rin',
    selected: true,
  },
  {
    tokenID: 2,
    name: 'Syf',
    model: 'syf',
    selected: false,
  },
  {
    tokenID: 3,
    name: 'Vé',
    model: 've',
    selected: false,
  },
];

const Home: React.FC<{
  handleMenu: (visible: boolean) => void;
  game: any;
  selectedCharacter: string;
  setSelectedCharacter: (
    val: string | ((prevState: string) => string)
  ) => void;
}> = ({
  handleMenu,
  game,
  setSelectedCharacter,
  selectedCharacter,
}) => {
  const handleSelect = (index: number) => {
    setSelectedCharacter(characters[index].model);
  };

  return (
    <div className={'w-full flex flex-col justify-center'}>
      <div
        className={
          'w-full flex justify-center flex-col items-center mb-8'
        }
      >
        <h1 className={'mb-6'}>Children of Ukiyo</h1>
      </div>
      <div className={'w-full p-4 pr-0 md:p-8'}>
        <Carousel
          slidesPerView={'auto'}
          breakpoints={{ 768: { slidesPerView: 3 } }}
        >
          {characters.map((character, i) => (
            <SwiperSlide
              key={character.tokenID}
              className={'w-[256px] md:w-full mb-10'}
            >
              <CharacterCard
                tokenID={character.model}
                name={character.name}
                selected={character.model === selectedCharacter}
                onClick={() => handleSelect(i)}
              />
            </SwiperSlide>
          ))}
        </Carousel>
        <div className={'flex justify-center mt-2'}>
          <button
            onClick={() => {
              handleMenu(false);
              game._Initialize();
            }}
            className={
              'py-2 px-6 mt-4 bg-primary text-black text-4xl font-bangers tracking-wide shadow-lg active:shadow-md active:translate-y-0.5 transition-all ease-out'
            }
          >
            <div>Explore The Lore</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
