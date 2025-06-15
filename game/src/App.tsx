import '@childrenofukiyo/core/dist/style.css';
import { MantineProvider } from '@mantine/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import Div100vh from 'react-div-100vh';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { SwiperSlide } from 'swiper/react';
import './App.css';
import Navigation from './components/navigation';
// @ts-ignore
import { Loader } from '@childrenofukiyo/core';
import { Howl } from 'howler';

import Carousel from './components/carousel';
import ClanCard from './components/clan-card';
import Home from './pages/home';

// @ts-ignore
import { useLocalStorage } from '@mantine/hooks';
import GlitchedWriter from 'glitched-writer';
import gsap from 'gsap';
import { X } from 'tabler-icons-react';
import CharacterDialog from './components/character-dialog';
import { useGame } from './scripts/main';
import { useSketch } from './scripts/void';

const glyphs =
  'ABCDĐEFGHIJKLMNOPQRSTUVWXYZabcdđefghijklmnopqrstuvwxyzĄąĆćŻżŹźŃńóŁłАБВГҐДЂЕЁЄЖЗЅИІЇЙЈКЛЉМНЊОПРСТЋУЎФХЦЧЏШЩЪЫЬЭЮЯабвгґдђеёєжзѕиіїйјклљмнњопрстћуўфхцчџшщъыьэюяΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψωάΆέΈέΉίϊΐΊόΌύΰϋΎΫΏĂÂÊÔƠƯăâêôơư一二三四五六七八九十百千上下左右中大小月日年早木林山川土空田天生花草虫犬人名女男子目耳口手足見音力気円入出立休先夕本文字学校村町森正水火玉王石竹糸貝車金雨赤青白数多少万半形太細広長点丸交光角計直線矢弱強高同親母父姉兄弟妹自友体毛頭顔首心時曜朝昼夜分週春夏秋冬今新古間方北南東西遠近前後内外場地国園谷野原里市京風雪雲池海岩星室戸家寺通門道話言答声聞語読書記紙画絵図工教晴思考知才理算作元食肉馬牛魚鳥羽鳴麦米茶色黄黒来行帰歩走止活店買売午汽弓回会組船明社切電毎合当台楽公引科歌刀番用何ĂÂÊÔƠƯăâêôơư1234567890‘?’“!”(%)[#]{@}/\\&<-+÷×=>$€£¥¢:;,.*•°·…±†‡æ«»¦¯—–~˜¨_øÞ¿▬▭▮▯┐└╛░▒▓○‼⁇⁈⁉‽ℴℵℶℷℸℲ℮ℯ⅁⅂⅃⅄₠₡₢₣₤₥₦₧₨₩₪₫€₭₮₯₰₱₲₳₴₵₶₷₸₹₺₻₼₽₾₿          ̴̵̶̷̸̡̢̧̨̛̖̗̘̙̜̝̞̟̠̣̤̥̦̩̪̫̬̭̮̯̰̱̲̳̹̺̻̼͇͈͉͍͎̀́̂̃̄̅̆̇̈̉̊̋̌̍̎̏̐̑̒̓̔̽̾̿̀́͂̓̈́͆͊͋͌̕̚ͅ ͓͔͕͖͙͚͐͑͒͗͛ͣͤͥͦͧͨͩͪͫͬͭͮͯ͘͜͟͢͝͞͠͡͏҉';

const clans = [
  {
    name: 'Kitsune Clan',
    content:
      'The Kitsune clan is the founding clan of the Ukiyo Sanctuary and also the largest. Its members are often used to gather intel on new worlds and are known as the most versatile assets of the council. Its oldest families are often viewed as the leading figures of the CoU organization but recently they seem to have lost control over the council’s actions.',
    img: 'kitsune',
    color: 'text-[#ff238f]',
    visibility: '',
  },
  {
    name: 'Wolves of Asgard',
    content:
      'The Wolves are the shield and swords of the sanctuary. They count within their ranks some of its fiercest warriors. But recently, their numbers have dwindled which is making it harder to for them send troops to other world and forced them to remain in the surrounding mountains to fulfil their first mission: Defend against any who would disrupt the peace.',
    img: 'wolves',
    color: 'text-[#0d69fb]',
    visibility: '',
  },
  {
    name: "Engineer's Guild",
    content:
      'The Guild is the newest clan that was formed within the CoU organization, they host a large variety of builders, scientists, and inventors that are responsible for the technological advancements of the Sanctuary. Due to a few misfortunes and their reluctance to simply follow orders, they tend to work on their own to fulfill the common goals. ',
    img: 'engineer',
    color: 'text-[#0df8f3]',
    visibility: '',
  },
  {
    name: 'Yokai Ghosts',
    content:
      "The Ghosts are not often seen in plain light, they prefer to remain in the shadows where they can employ any means necessary to hunt down their target and carry out the orders of the council’s, away from prying eyes of the other clans. Since they lost their leader, they've been led by a group of mysterious and powerful demons of whom little is known.",
    img: 'yokai',
    color: 'text-[#f80e1c]',
    visibility: '',
  },
  {
    name: 'Order of Yggdrasil',
    content:
      "The Order of Yggdrasil is the smallest clan within the sanctuary. Most of their members are ancients beings with unknown abilities. They are guided by a group of druids & elementals with very strong affinity with the world's natural powers. The order is taking care of healing broken worlds and protecting the natural balance of the worlds at all costs.",
    img: 'yggdrasil',
    color: 'text-[#4bfb9a]',
    visibility: '',
  },
  {
    name: 'Children of Ukiyo',
    content:
      'The Children of Ukiyo is an organization that has been operating in the shadows of countless worlds over the past 8000 years. They helped civilizations rise to their pinnacle and sometimes, made sure others fell back to dust. Some Children have been living among us for generations, but now it’s clear they need help to handle the chaos of our world.',
    img: 'logo',
    color: 'text-white',
    visibility: '',
  },
  {
    name: 'Order of the First Child',
    content: (
      <>
        <p>
          The Order of the first child has long been forgotten by
          most...
        </p>
        <span className={'invisible'}>
          The Order of the first child has long been forgotten by
          most. Stories often describes them as a unit made of the
          strongest members of the sanctuary that was used to
          guarantee victory during difficult missions. It’s unclear
          what happened to them after they vanished?. Some say they
          were corrupted by dark forces and banished, but is this the
          truth? 1110
        </span>
      </>
    ),
    img: 'child',
    color: 'text-[#ff701e]/20 line-through',
    visibility: '',
  },
  {
    name: 'JBSA VM JOHVZ',
    content:
      'Johvz pz vul vm aol zayvunlza uhabyhs mvyjlz ha dvyr pu aol tbsapclyzlz. Pa’z bzbhssf h uvyths wpljl vm aol ihshujl iba aolyl hyl zvtl dov nva jvuzbtlk if pa huk uvd zllr vusf av kpzybwa aol msvd vm spml if zwylhkpun thkulzz. Aopz Jbsa vm Johvz pz ybtvylk av ohcl ahrlu zvspk mvvapun vu lhyao. Aol rlf vm johvz pz Zpe, Zpe, Zpe, Vul.',
    img: 'chaos',
    color: 'text-primary',
    visibility: '',
  },
  {
    name: 'Void',
    content:
      'The prophecy of the void signals the end of all life. It is said that the first Ukiyo Wizard avoided the worse, thousands of years ago, by sealing the void’s 8 cores and scattering them at the corners of the known worlds. The Elders buried to story to make sure nobody would seek the core’s powers. But something dark is on the move once more. 7531',
    img: 'void',
    color: 'text-white',
    visibility: 'invisible',
  },
];

const App = () => {
  const [showSite, setShowSite] = useState(true);
  const [showVoid, setShowVoid] = useState(false);
  const [game, setGame] = useState<any>(null);
  const [sketch, setSketch] = useState<any>(null);
  const [selectedStorage, setSelectedStorage] = useLocalStorage({
    key: 'character:selected',
    defaultValue: 'rin',
  });
  const audioRef = useRef(
    new Howl({
      src: ['./music/website_theme_music.mp3'],
      loop: true,
      volume: 0.5,
    })
  );
  const [audioPlaying, setAudioPlaying] = useState(true);

  useEffect(() => {
    audioRef.current.play();
    setGame(useGame());
    setSketch(useSketch());
  }, []);

  useEffect(() => {
    if (game && sketch) {
      window.addEventListener('storage', voidHandler, true);
    }
  }, [game, sketch]);

  const voidHandler = useCallback(() => {
    const show = localStorage.getItem('void:show');
    if (show && JSON.parse(show)) {
      document.querySelector('#threejs')?.remove();
      setShowVoid(true);
      gsap.delayedCall(1, () => {
        const glyphWriter = document.querySelector(
          '#glitched-writer'
        );
        glyphWriter?.classList.add('visible');
        const writer = new GlitchedWriter(glyphWriter, {
          glyphs: glyphs,
          steps: [1, 8],
          interval: [60, 170],
          delay: [0, 2000],
          changeChance: 0.6,
          ghostChance: 0.2,
          maxGhosts: 3,
          oneAtATime: false,
          glyphsFromText: false,
          fillSpace: true,
          mode: 'matching',
          html: true,
          letterize: true,
          endless: false,
          fps: 60,
        });
        const phrases = ['THE VOID IS COMING', 'GET READY ∞ 闇'];
        writer.queueWrite(phrases, 1000, true);
      });
      gsap.delayedCall(10, () => {
        game._Initialize();
        sketch.destroy();
        setShowVoid(false);
      });
    }
  }, [game, sketch]);

  const handleMenu = (visible: boolean) => {
    setShowSite(visible);
  };

  const handleAudio = () => {
    if (audioRef.current.playing()) {
      audioRef.current.pause();
      setAudioPlaying(false);
      return;
    }
    audioRef.current.play();
    setAudioPlaying(true);
  };

  return (
    <>
      <Div100vh
        className="game relative overflow-hidden"
        id="container"
      >
        <div
          id={'greeting-modal'}
          className={
            'absolute w-full bottom-32 md:bottom-48 left-0 invisible'
          }
        >
          <CharacterDialog
            img={selectedStorage}
            dialog={
              "Welcome back, we started the final preparations in order to summon the Children of Ukiyo to this world. This remote location has a high concentration of Arcane energy that we thought we could use to amplify our power during the Summoning Ritual but there seem to be some disturbances in the Arcana blocking us from doing so. The second squad went to recruit more help and the third squad went to investigate. I have a bad feeling about this... Feel free to take a look around, maybe you’ll find something we missed and don't forget to report to the council if you find any clue."
            }
            onClose={() => null}
          />
        </div>
        <div
          id={'clans-carousel'}
          className={
            'absolute z-10 bg-[#1c1c1cbf] top-0 left-0 flex justify-center items-center h-full w-full hidden'
          }
          onClick={() => {
            // @ts-ignore
            document.querySelector('#clans-carousel').style.display =
              'none';
          }}
        >
          <div
            className={'w-screen max-w-screen-2xl pl-4 xl:p-6'}
            onClick={(e) => e.stopPropagation()}
          >
            <Carousel
              slidesPerView={'auto'}
              loop
              breakpoints={{ 1280: { slidesPerView: 3 } }}
            >
              {clans.map((clan) => (
                <SwiperSlide
                  key={clan.name}
                  className={'w-[256px] xl:w-full mb-10'}
                >
                  <ClanCard {...clan} />
                </SwiperSlide>
              ))}
            </Carousel>
            <div className={'absolute top-0 right-0'}>
              <button
                onClick={() => {
                  // @ts-ignore
                  document.querySelector(
                    '#clans-carousel'
                    // @ts-ignore
                  ).style.display = 'none';
                }}
                className={
                  'py-2 px-6 mt-4 bg-primary text-black text-3xl font-bangers tracking-wide shadow-lg active:shadow-md active:translate-y-0.5 transition-all ease-out'
                }
              >
                <div>Close</div>
              </button>
            </div>
          </div>
        </div>
        <div
          id={'arch-modal'}
          className={
            'absolute z-10 bg-[#1c1c1cbf] top-0 left-0 flex justify-center items-center h-full w-full hidden'
          }
          onClick={() => {
            // @ts-ignore
            document.querySelector('#arch-modal').style.display =
              'none';
          }}
        >
          <div
            className={'w-screen max-w-screen-xl p-4 md:px-6'}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div
                className={
                  'p-4 md:p-12 grid grid-cols-1 gap-4 lg:grid-cols-2 bg-[#1e1e1e] overflow-y-auto max-h-[650px] md:max-h-full'
                }
              >
                <div className={'text-justify'}>
                  <h2 className={'mb-4'}>The Summoning Ritual</h2>
                  <p className={'mb-4 font-bold text-lg'}>
                    On the other side of this portal lies the realm of
                    the Ukiyo Sanctuary, a place of wonders, peace and
                    prosperity, home of the Children of Ukiyo
                    Organization.
                  </p>
                  <p className={'mb-4 font-bold text-lg'}>
                    In order to open up the door between our worlds
                    and allow entry to a large number of Children, we
                    need to gather as much help as we can from the
                    inhabitants of this world. The more Summoning
                    Scrolls we can bind to worthy candidates, the more
                    we stand a chance to save this world and have an
                    impact.
                  </p>
                  <p className={'font-bold text-lg'}>
                    Before we can start, we also need to harness
                    enough arcane and elemental resources to power up
                    such a massive magic ritual. It's usually not a
                    problem, especially with strong magic users like
                    Hina, Muugi & Kana, but there seems to be a few
                    conflicting forces playing against our efforts.
                    See if you can help the council determine what
                    we're up against and how we can move forward.
                    There's an ominous aura starting to float in the
                    air, we need to act quickly and will need all the
                    help we can get.
                  </p>
                </div>
                <div
                  className={
                    'w-full h-full flex justify-center items-center'
                  }
                >
                  <img
                    src={'./images/scroll_sideways.png'}
                    alt={'team ukiyo'}
                    className={'w-[400px]'}
                  />
                </div>
              </div>
              <div className={'absolute top-0 right-0'}>
                <button
                  onClick={() => {
                    // @ts-ignore
                    document.querySelector(
                      '#arch-modal'
                      // @ts-ignore
                    ).style.display = 'none';
                  }}
                  className={
                    'py-2 px-6 mt-4 bg-primary text-black text-3xl font-bangers tracking-wide shadow-lg active:shadow-md active:translate-y-0.5 transition-all ease-out'
                  }
                >
                  <div>Close</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Div100vh>
      <MantineProvider
        theme={{ fontFamily: 'Space Grotesk', colorScheme: 'dark' }}
      >
        <div className={'absolute top-0 left-0'}>
          <button
            onClick={() => handleMenu(true)}
            className={
              'py-2 px-6 mt-4 bg-primary text-black text-3xl font-bangers tracking-wide shadow-lg active:shadow-md active:translate-y-0.5 transition-all ease-out'
            }
          >
            <div>Menu</div>
          </button>
        </div>
        {showSite && (
          <>
            <Div100vh className={'absolute w-screen top-0 left-0'}>
              <div
                className={
                  'w-full h-full bg-black overflow-y-auto overflow-x-hidden'
                }
              >
                <BrowserRouter>
                  <div className={'max-w-screen-2xl mx-auto'}>
                    <header
                      className={
                        'sticky top-0 w-full mb-8 md:mb-16 z-50'
                      }
                    >
                      <Navigation />
                    </header>
                    <main className={'mx-auto'}>
                      <Routes>
                        <Route
                          path=""
                          element={
                            <Home
                              handleMenu={handleMenu}
                              game={game}
                              selectedCharacter={selectedStorage}
                              setSelectedCharacter={
                                setSelectedStorage
                              }
                            />
                          }
                        />
                      </Routes>
                    </main>
                    {/*<footer className={"bg-[#020720] flex text-white font-bangers text-4xl p-6 -m-6"}>*/}
                    {/*  <div className={"self-end"}>Children of Ukiyo</div>*/}
                    {/*</footer>*/}
                  </div>
                </BrowserRouter>
              </div>
            </Div100vh>
          </>
        )}
        <Div100vh
          id={'loader'}
          className={
            'absolute top-0 left-0 bg-black h-full w-full flex justify-center items-center hidden'
          }
        >
          <Loader />
        </Div100vh>
        <div
          className={
            'absolute bottom-0 left-0 cursor-pointer w-[48px] ml-4 mb-2 animate-infinite'
          }
          onClick={handleAudio}
        >
          <div
            className={
              'relative flex justify-center items-center h-full cursor-pointer z-50'
            }
          >
            <img
              src={'./images/sound_off.png'}
              className={'object-contain'}
              alt={'earbuds audio controls'}
            />
            {!audioPlaying && (
              <X className={'absolute text-red-600'} size={36} />
            )}
          </div>
        </div>
      </MantineProvider>
      {showVoid && (
        <>
          <Div100vh
            id={'canvasContainer'}
            className={
              'h-full w-full absolute top-0 left-0 animate-fade-in z-20 bg-black overflow-hidden'
            }
            data-grid="500"
            data-mouse="0.11"
            data-strength="0.36"
            data-relaxation="0.96"
          >
            <img
              id="test"
              src={'./images/black2.jpg'}
              alt=""
              className={'invisible absolute w-[100px]'}
              onLoad={() => sketch.init(false)}
            />
          </Div100vh>
          <div
            className={
              'h-screen w-full absolute top-0 left-0 flex justify-center items-center z-30 invisible'
            }
          >
            <div
              id={'glitched-writer'}
              className={
                'text-[68px] leading-normal text-neutral-500 text-center'
              }
            />
          </div>
        </>
      )}
    </>
  );
};
export default App;
