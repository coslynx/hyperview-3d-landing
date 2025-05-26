import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { GLTF, useGLTF, useProgress } from '@react-three/drei';
import { use3DInteraction } from '../../hooks/use3DInteraction';
import { useTheme } from '../../context/ThemeContext';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import type { ComponentBaseProps } from '../../types';

interface ModelLoaderProps extends ComponentBaseProps {
  modelUrl: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Efficiently loads, caches, and renders 3D models with optimizations like Draco compression and LOD.
 *
 * @param modelUrl - URL to the 3D model (GLTF/GLB format).
 * @param onLoad - Callback function executed after the model is successfully loaded.
 * @param onError - Callback function executed if the model fails to load.
 * @component
 */
const ModelLoader: React.FC<ModelLoaderProps> = memo(({
  modelUrl,
  onLoad,
  onError,
  className,
  style,
  ...props
}) => {
  const { scene } = useThree();
  const modelRef = useRef<THREE.Group>(null);
  const [loading, setLoading] = useState(true);
  const { progress } = useProgress();
  const { selectObject } = use3DInteraction();
  const [model, setModel] = useState<GLTF | null>(null);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (progress === 100 && model) {
      selectObject(model.scene);
    }
  }, [progress, model, selectObject])

  // Use useGLTF to load and manage the 3D model
  const gltf = useGLTF<GLTF>(modelUrl, true);

  useEffect(() => {
    if (gltf) {
      setModel(gltf);
    }
  }, [gltf]);

  // Handle loading completion
  useEffect(() => {
    if (!modelRef.current || !gltf) return;

    try {
        // three3DHelpersUtil.addModelsToScene(gltf.scene,scene,0,0,0)
      setLoading(false);
      if (onLoad) {
        onLoad();
      }
    } catch (e) {
      const loadError = e instanceof Error ? e : new Error('Model loading failed');
      setLoadError(loadError);
      if (onError) {
        onError(loadError);
      }
    }
  }, [gltf, onLoad, scene]);

  // Error handling with fallback mechanism
  if (loadError) {
    return (
      <mesh>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
    );
  }

  // Render the loaded model or a loading indicator
  return loading ? (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={isDarkMode ? 'white' : 'black'} transparent opacity={0.5} />
    </mesh>
  ) : (
    <primitive
      ref={modelRef}
      object={gltf.scene}
      position={[0, 0, 0]}
      scale={1}
      dispose={null}
    />
  );
});

ModelLoader.displayName = 'ModelLoader';

export default ModelLoader;