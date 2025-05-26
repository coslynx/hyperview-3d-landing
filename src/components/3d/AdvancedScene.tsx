import React, { Suspense, useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame, Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, useHelper } from '@react-three/drei';
import gsap from 'gsap';
import { ThreeScene } from './ThreeScene';
import { use3DAnimation } from '../../hooks/use3DAnimation';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import type { ComponentBaseProps } from '../../types';
import { Bloom, DepthOfField, EffectComposer, SSAO } from '@react-three/postprocessing';
import { DirectionalLightHelper } from 'three';
import { ModelLoader } from './ModelLoader';

interface AdvancedSceneProps extends ComponentBaseProps {
  modelUrl: string;
  environmentMap?: string;
  shadowType?: 'basic' | 'advanced';
}

const AdvancedScene: React.FC<AdvancedSceneProps> = React.memo(({
  modelUrl,
  environmentMap,
  shadowType = 'basic',
  className,
  style,
  ...props
}) => {
  const { scene, camera, gl, size, viewport, performance } = useThree();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  const { quality } = use3DAnimation();

  // Load environment map
  useEffect(() => {
    let pmremGenerator: THREE.PMREMGenerator | null = null;

    const loadEnvMap = async () => {
      try {
        if (environmentMap) {
          const hdrLoader = new THREE.HDRCubeTextureLoader();
          const texture = await hdrLoader.load(environmentMap);
          pmremGenerator = new THREE.PMREMGenerator(gl.renderer);
          pmremGenerator.compileEquirectangularShader();
          const envMap = pmremGenerator.fromCubemap(texture).texture;

          scene.environment = envMap;

        }
      } catch (err) {
        console.error("Failed to load environment map:", err);
      } finally {
        if (pmremGenerator) {
          pmremGenerator.dispose();
        }
      }
    };

    loadEnvMap();
    return () => {
      scene.environment = null; // Clear the environment
    };
  }, [environmentMap, gl, scene]);

  // Postprocessing setup and effects
  const bloomProps = useMemo(() => ({
    intensity: 0.5,
    luminanceThreshold: 0.9,
    luminanceSmoothing: 0.9,
  }), []);

  const directionalLightIntensity = 0.7;

  return (
    <ThreeScene>
      <directionalLight
        ref={directionalLightRef}
        position={[10, 10, 5]}
        intensity={directionalLightIntensity}
        color="#ffffff"
        castShadow={shadowType === 'advanced'}
      />
      <OrbitControls enableDamping dampingFactor={0.1} />
      {shadowType === 'advanced' && directionalLightRef.current ?
        <directionalLightHelper light={directionalLightRef.current} size={3} /> : null
      }

      <Suspense fallback={null}>
        <ModelLoader
          modelUrl={modelUrl}
          onLoad={() => setLoading(false)}
          onError={(e) => setError(new Error("Model loading failed."))}
        />
      </Suspense>
      <ambientLight intensity={0.5} />
      <EffectComposer>
        <Bloom {...bloomProps} />
        <SSAO intensity={0.05} />
      </EffectComposer>
    </ThreeScene>
  );
});

AdvancedScene.displayName = 'AdvancedScene';

export default AdvancedScene;