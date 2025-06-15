import React from 'react';
import {
  A11y,
  Mousewheel,
  Navigation,
  Pagination,
  Scrollbar,
} from 'swiper';
import { Swiper } from 'swiper/react';

interface CarouselProps {
  children: React.ReactNode;
  slidesPerView?: 'auto' | number;
  breakpoints?: {
    [key: number]: {
      slidesPerView: 'auto' | number;
      spaceBetween?: number;
    };
  };
  loop?: boolean;
  centered?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  slidesPerView = 'auto',
  breakpoints,
  loop,
  centered,
}) => {
  return (
    <Swiper
      className={'z-[0]'}
      modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]}
      spaceBetween={15}
      slidesPerView={slidesPerView}
      breakpoints={breakpoints}
      navigation
      loop={loop}
      centeredSlides={centered}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
    >
      {children}
    </Swiper>
  );
};

export default Carousel;
