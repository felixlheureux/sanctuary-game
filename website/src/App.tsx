import "@childrenofukiyo/core/dist/style.css";
import "./App.css";
import React, { Suspense } from "react";
import { Canvas, ThreeEvent, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { Vector2 } from "three";
// @ts-ignore
import scroll from "./assets/images/scroll.png";
// @ts-ignore
import arch from "./assets/images/arch2.png";
// @ts-ignore
import test from "./assets/images/black2.jpg";
import gsap from "gsap";
import { useSketch } from "./js/app";
import GlitchedWriter from "glitched-writer";
import Glitch from "./glitch";
import Modal from "./components/modal";

const glyphs = "ABCDĐEFGHIJKLMNOPQRSTUVWXYZabcdđefghijklmnopqrstuvwxyzĄąĆćŻżŹźŃńóŁłАБВГҐДЂЕЁЄЖЗЅИІЇЙЈКЛЉМНЊОПРСТЋУЎФХЦЧЏШЩЪЫЬЭЮЯабвгґдђеёєжзѕиіїйјклљмнњопрстћуўфхцчџшщъыьэюяΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψωάΆέΈέΉίϊΐΊόΌύΰϋΎΫΏĂÂÊÔƠƯăâêôơư一二三四五六七八九十百千上下左右中大小月日年早木林山川土空田天生花草虫犬人名女男子目耳口手足見音力気円入出立休先夕本文字学校村町森正水火玉王石竹糸貝車金雨赤青白数多少万半形太細広長点丸交光角計直線矢弱強高同親母父姉兄弟妹自友体毛頭顔首心時曜朝昼夜分週春夏秋冬今新古間方北南東西遠近前後内外場地国園谷野原里市京風雪雲池海岩星室戸家寺通門道話言答声聞語読書記紙画絵図工教晴思考知才理算作元食肉馬牛魚鳥羽鳴麦米茶色黄黒来行帰歩走止活店買売午汽弓回会組船明社切電毎合当台楽公引科歌刀番用何ĂÂÊÔƠƯăâêôơư1234567890‘?’“!”(%)[#]{@}/\\&<-+÷×=>$€£¥¢:;,.*•°·…±†‡æ«»¦¯—–~˜¨_øÞ¿▬▭▮▯┐└╛░▒▓○‼⁇⁈⁉‽ℴℵℶℷℸℲ℮ℯ⅁⅂⅃⅄₠₡₢₣₤₥₦₧₨₩₪₫€₭₮₯₰₱₲₳₴₵₶₷₸₹₺₻₼₽₾₿          ̴̵̶̷̸̡̢̧̨̛̖̗̘̙̜̝̞̟̠̣̤̥̦̩̪̫̬̭̮̯̰̱̲̳̹̺̻̼͇͈͉͍͎̀́̂̃̄̅̆̇̈̉̊̋̌̍̎̏̐̑̒̓̔̽̾̿̀́͂̓̈́͆͊͋͌̕̚ͅ ͓͔͕͖͙͚͐͑͒͗͛ͣͤͥͦͧͨͩͪͫͬͭͮͯ͘͜͟͢͝͞͠͡͏҉";
const scrollsState = [
  {
    image: scroll,
    hidden: false,
    animate: false
  },
  {
    image: scroll,
    hidden: false,
    animate: false
  },
  {
    image: scroll,
    hidden: false,
    animate: false
  },
  {
    image: scroll,
    hidden: false,
    animate: false
  },
  {
    image: scroll,
    hidden: false,
    animate: false
  },
  {
    image: scroll,
    hidden: false,
    animate: true
  }
];

const Carousel = ({ controlsRef, setShowVoid, setShowCarousel, setShowGlitch, setShowModal, sketch }: any) => {
  // const boxRef = useRef();
  // useFrame((state, delta) => {
  //   // @ts-ignore
  //   boxRef.current.rotation.y += 0.02;
  // });

  const scrollTexture = useLoader(THREE.TextureLoader, scroll as string);
  const archTexture = useLoader(THREE.TextureLoader, arch as string);
  const archAspectRatio = archTexture.image.height / archTexture.image.width;
  const scrollAspectRatio = scrollTexture.image.height / scrollTexture.image.width;
  const scrolls: any[] = [];

  const voidAnimation = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setShowGlitch(true);
    const glyphWriter = document.querySelector("#glitched-writer");
    glyphWriter?.classList.add("visible");
    gsap.delayedCall(5, () => {
      gsap.to(document.querySelector("#carousel"), { // target min distance
        duration: 1,
        overwrite: "auto",
        backgroundColor: ("rgba(0,0, 0, 1)")
      });
      gsap.to(controlsRef.current, {
        minDistance: 1000, // target min distance
        duration: 0,
        overwrite: "auto",
        onComplete: () => {
          setShowCarousel(false);
          const writer = new GlitchedWriter(
            glyphWriter,
            {
              glyphs: glyphs,
              steps: [ 1, 8 ],
              interval: [ 60, 170 ],
              delay: [ 0, 2000 ],
              changeChance: 0.6,
              ghostChance: 0.2,
              maxGhosts: 3,
              oneAtATime: false,
              glyphsFromText: false,
              fillSpace: true,
              mode: "matching",
              html: true,
              letterize: true,
              endless: false,
              fps: 60
            }
          );
          const phrases = [ "THE VOID IS COMING", "GET READY" ];
          writer.queueWrite(phrases, 1000, true);
          setShowVoid(true);
        }
      });
    });
    gsap.delayedCall(20, () => {
      setShowVoid(false);
      setShowGlitch(false);
      scrollsState[scrollsState.length - 1].hidden = true;
      glyphWriter?.classList.add("invisible");
      gsap.to(document.querySelector("#carousel"), { // target min distance
        duration: 0,
        overwrite: "auto",
        backgroundColor: ("#EFEADB"),
        onComplete: () => {
          setShowCarousel(true);
        }
      });
    });
  };
  const openModal = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    setShowModal(true);
  };

  let count = 6;

  if (scrollsState[scrollsState.length - 1].hidden) count = 5;

  scrollsState.forEach((state, i) => {
    if (state.hidden) return;

    const t = i / count * 2 * Math.PI;

    scrolls.push(
      <sprite
        onClick={(e) => state.animate ? voidAnimation(e) : openModal(e)}
        onPointerEnter={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
          gsap.to(e.eventObject.scale, {
            duration: 0.1,
            y: 1.4 * scrollAspectRatio,
            x: 1.4
          });
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "auto";
          gsap.to(e.eventObject.scale, {
            duration: 0.1,
            y: 1.2 * scrollAspectRatio,
            x: 1.2
          });
        }}
        scale={[ 1.2, 1.2 * scrollAspectRatio, 1 ]}
        position={[ Math.cos(t) * 6, 0, Math.sin(t) * 6 ]}
        // position={[ Math.sin(t) * 6, 0, Math.cos(t) * 6 ]}
        castShadow>
        <spriteMaterial rotation={0.35} attach="material" map={scrollTexture} />
      </sprite>
    );
  });

  return (
    <>
      {/*<Box ref={boxRef} args={[ 1, 1, 1 ]} rotation={[ 0.5, 0, 0 ]}>*/}
      {/*  <meshNormalMaterial />*/}
      {/*</Box>*/}
      {/*<ambientLight />*/}

      {scrolls.map((s, i) => (
        <React.Fragment key={i}>
          {s}
        </React.Fragment>
      ))}
      <sprite scale={[ 9, 8, 1 ]} position={[ 0, 1, 0 ]} castShadow>
        <spriteMaterial attach="material" map={archTexture} />
      </sprite>
    </>
  );
};

function App() {
  const controlsRef = React.useRef<any>();
  const cameraRef = React.useRef<any>();
  const [ showVoid, setShowVoid ] = React.useState(false);
  const [ showCarousel, setShowCarousel ] = React.useState(true);
  const [ showGlitch, setShowGlitch ] = React.useState(false);
  const [ showModal, setShowModal ] = React.useState(false);

  const sketch = useSketch();

  return (
    <>
      <div id={"carousel"} className={"h-screen w-full bg-[#EFEADB] absolute top-0 left-0 z-10"}>
        {showCarousel &&
          <Canvas>
            {showGlitch &&
              <Glitch glitchEffectProps={{ ratio: 0, delay: new Vector2(1, 1) }} />
            }
            <PerspectiveCamera ref={cameraRef}
                               isPerspectiveCamera fov={70}
                               position={[ 0, 6, 15 ]}
                               aspect={window.innerWidth / window.innerHeight}
                               near={0.01}
                               far={100}
                               makeDefault />
            <OrbitControls ref={controlsRef}
                           minPolarAngle={Math.PI / 2}
                           maxPolarAngle={Math.PI / 2}
                           enableDamping
                           autoRotate
                           rotateSpeed={0.5}
                           autoRotateSpeed={0.5}
                           makeDefault
                           enableZoom={false} />
            <Suspense>
              <Carousel controlsRef={controlsRef} setShowVoid={setShowVoid} setShowCarousel={setShowCarousel}
                        setShowGlitch={setShowGlitch}
                        setShowModal={setShowModal}
                        sketch={sketch} />
            </Suspense>
          </Canvas>
        }
      </div>
      {showVoid &&
        <>
          <div id={"canvasContainer"}
               className={"h-screen w-full absolute top-0 left-0 animate-fade-in z-20"}
               data-grid="500"
               data-mouse="0.11"
               data-strength="0.36"
               data-relaxation="0.96">
            <img id="test"
                 src={test}
                 alt=""
                 className={"invisible absolute w-[100px]"}
                 onLoad={() => sketch.init(false)} />
          </div>
        </>
      }
      <div className={"h-screen w-full relative top-0 left-0 flex justify-center items-center z-30 invisible"}>
        <div id={"glitched-writer"} className={"text-[68px] text-neutral-500 text-center"} />
      </div>
      <Modal visible={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

export default App;
