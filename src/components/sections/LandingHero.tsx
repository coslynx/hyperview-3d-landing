import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { use3DAnimation } from '../../hooks/use3DAnimation';
import { ModelLoader } from '../3d/ModelLoader';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import type { ComponentBaseProps } from '../../types';
import gsap from 'gsap';

interface LandingHeroProps extends ComponentBaseProps {
  modelUrl: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  ctaLink: string;
}

const LandingHero: React.FC<LandingHeroProps> = memo(({
  modelUrl,
  headline,
  subheadline,
  ctaLabel,
  ctaLink,
  className,
  style,
  ...props
}) => {
  const { isDarkMode, colors } = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<THREE.Group>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { scene } = useThree();

  const tl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    tl.current = gsap.timeline({
      paused: true,
      onComplete: () => {
        setLoading(false);
      }
    });

    tl.current.fromTo(
      modelRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
  }, [modelUrl]);

  useEffect(() => {
    if (sectionRef.current && loading) {
      tl.current?.play();
    }
  }, [loading]);

  const handleModelLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const renderThreeJsScene = useCallback(() => {
    return (
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ height: '400px' }}
      >
        <ambientLight intensity={isDarkMode ? 0.3 : 0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={isDarkMode ? 0.4 : 0.7}
          color={colors.primary}
          castShadow
        />
        <directionalLight
          position={[-10, 5, -5]}
          intensity={isDarkMode ? 0.2 : 0.4}
          color={colors.accent}
        />
        <ModelLoader
          modelUrl={modelUrl}
          onLoad={handleModelLoad}
          onError={(e) => setError(new Error("Model loading failed."))}
        />
        <Environment preset="city" blur={0.8} />
      </Canvas>
    );
  }, [isDarkMode, colors, modelUrl, handleModelLoad]);

  if (error) {
    return (
      <section className={`landing-hero ${className || ''}`} style={style} ref={sectionRef} {...props}>
        <div className="container mx-auto py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Error</h2>
          <p>Failed to load 3D model. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`landing-hero ${className || ''} bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200`}
      style={style}
      ref={sectionRef}
      {...props}
    >
      <div className="container mx-auto grid md:grid-cols-2 gap-8 py-12 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">{headline}</h1>
          <p className="text-lg mb-8">{subheadline}</p>
          <Link
            to={ctaLink}
            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
          >
            {ctaLabel}
          </Link>
        </div>
        <div className="relative">{renderThreeJsScene()}</div>
      </div>
    </section>
  );
});

LandingHero.displayName = 'LandingHero';

export default LandingHero;