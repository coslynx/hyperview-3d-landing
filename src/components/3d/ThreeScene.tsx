import React, { useRef, useEffect, useCallback, useContext, createContext } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerformanceMonitor } from '@react-three/drei';
import { use3DAnimation } from '../../hooks/use3DAnimation';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import type { ComponentBaseProps } from '../../types';

interface ThreeSceneProps extends ComponentBaseProps {
  cameraPosition?: [number, number, number];
  fogColor?: string;
  bgColor?: string;
  children?: React.ReactNode;
}

interface ThreeSceneContextType {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.Renderer;
}

const ThreeSceneContext = createContext<ThreeSceneContextType | undefined>(undefined);

const ThreeScene: React.FC<ThreeSceneProps> = ({
  cameraPosition = [0, 0, 5],
  fogColor = '#ffffff',
  bgColor = '#ffffff',
  children,
  className,
  style,
  ...props
}) => {
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
  const cameraRef = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));
  const rendererRef = useRef<THREE.WebGLRenderer>(new THREE.WebGLRenderer({ antialias: true }));

  const { isAnimating } = use3DAnimation();
  const { gl } = useThree();

  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    // Camera setup
    camera.position.set(...cameraPosition);

    // Renderer setup
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;

    if (gl) {
      gl.domElement.classList.add('three-canvas');
      document.body.appendChild(gl.domElement); // Or attach it to a specific DOM element
    }
   
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Fog
    scene.fog = new THREE.Fog(fogColor, 0, 10);
    scene.background = new THREE.Color(bgColor);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
      
    // Performance Adjustments
        renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      scene.dispose();
        camera.removeFromParent();
        three3DHelpersUtil.recursiveDespose(scene);
    };
  }, [cameraPosition, fogColor, bgColor, gl]);

  useFrame(() => {
    if (isAnimating) {
      // Example animation: rotate the scene
      sceneRef.current.rotation.x += 0.01;
      sceneRef.current.rotation.y += 0.01;
    }
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  });

  const contextValue: ThreeSceneContextType = {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
  };

  return (
    <ThreeSceneContext.Provider value={contextValue}>
      <PerformanceMonitor/>
          {children}
    </ThreeSceneContext.Provider>
  );
};

export const useThreeScene = (): ThreeSceneContextType => {
  const context = useContext(ThreeSceneContext);
  if (!context) {
    throw new Error('useThreeScene must be used within a ThreeScene');
  }
  return context;
};

ThreeScene.displayName = 'ThreeScene';

export default ThreeScene;