import { extend } from '@react-three/fiber';
import {
  EffectComposer,
  SMAA,
  SSAO,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

extend({ EffectComposer, ShaderPass, RenderPass });

export default function Effects() {
  return (
    <EffectComposer>
      {/*<DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />*/}
      {/*<Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} />*/}
      {/*<Noise opacity={0.02} />*/}
      {/*<Vignette eskil={false} offset={0.1} darkness={1.1} />*/}
      <SSAO
        blendFunction={BlendFunction.MULTIPLY} // Use NORMAL to see the effect
        samples={25}
        radius={0.03}
        intensity={50}
        rings={7}
        distanceThreshold={0.5}
        distanceFalloff={0.01}
        rangeThreshold={0.01}
        rangeFalloff={0.01}
        luminanceInfluence={1}
        bias={0.035}
      />
      <SMAA />
    </EffectComposer>
  );
}
