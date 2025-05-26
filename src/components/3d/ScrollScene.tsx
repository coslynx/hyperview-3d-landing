import React, { memo, useCallback, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useTheme } from '../../context/ThemeContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { ThreeScene } from './ThreeScene';
import type { ComponentBaseProps } from '../../types';
import './scroll-scene.css';

interface ScrollSceneProps extends ComponentBaseProps {
  modelUrl: string;
  animationConfig: {
    start: number;
    end: number;
    duration: number;
  };
}

const ScrollScene: React.FC<ScrollSceneProps> = memo(({
  modelUrl,
  animationConfig,
  className,
  style,
  ...props
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { camera, scene } = useThree();
  const { isDarkMode } = useTheme();
  const { scrollY } = useScrollAnimation(sectionRef);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    try {
      if (!scene || !camera || !modelRef.current) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: animationConfig.start,
          end: animationConfig.end,
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      tl.to(camera.position, {
        x: 5,
        y: 5,
        z: 10,
        duration: animationConfig.duration,
        ease: "power2.inOut",
      });
    } catch (error) {
      console.warn("Error setting up scroll animation:", error);
    }
  }, [scene, camera, animationConfig.start, animationConfig.end, animationConfig.duration]);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  const renderContent = useCallback(() => {
    return (
      <ThreeScene modelUrl={modelUrl}>
      </ThreeScene>
    );
  }, [modelUrl]);

  return (
    <section
      ref={sectionRef}
      className={`scroll-scene ${className || ''}`}
      style={style}
      {...props}
    >
      {renderContent()}
    </section>
  );
});

ScrollScene.displayName = 'ScrollScene';

export default ScrollScene;