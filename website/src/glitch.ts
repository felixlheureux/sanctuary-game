import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";

import { EffectComposer, EffectPass, GlitchEffect, NormalPass, RenderPass } from "postprocessing";
import { HalfFloatType, Vector2 } from "three";

type GlitchEffectProps = {
  active?: boolean;
  ratio?: number;
  duration?: Vector2;
  delay?: Vector2;
  chromaticAberrationOffset?: Vector2;
};

type GlitchProps = {
  glitchEffectProps?: GlitchEffectProps;
};

const Glitch = ({ glitchEffectProps }: GlitchProps) => {
  const { gl, scene, camera, size } = useThree();

  const composer = useMemo(() => {
    const effectComposer = new EffectComposer(gl, {
      frameBufferType: HalfFloatType
    });
    effectComposer.addPass(new RenderPass(scene, camera));

    const normalPass = new NormalPass(scene, camera);

    effectComposer.addPass(normalPass);

    const glitchEffect = new GlitchEffect(glitchEffectProps);

    const glitchPass = new EffectPass(camera, glitchEffect);

    glitchPass.renderToScreen = true;

    effectComposer.addPass(glitchPass);

    return effectComposer;
  }, [ camera, gl, scene, glitchEffectProps ]);

  useEffect(() => composer.setSize(size.width, size.height), [ composer, size ]);
  return useFrame((_, delta) => composer.render(delta), 1);
};

export default Glitch;
