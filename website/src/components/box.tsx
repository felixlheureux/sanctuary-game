import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

const Box = () => {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh<any>>();
  // Set up state for the hovered and active state
  const [ hovered, setHover ] = useState(false);
  const [ active, setActive ] = useState(false);
  // Rotate mesh every frame, this is outside of React without overhead
  // @ts-ignore
  useFrame(() => (mesh.current.rotation.x += 0.01));

  return (
    <mesh
      // @ts-ignore
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[ 1, 2, 3 ]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
};

export default Box;