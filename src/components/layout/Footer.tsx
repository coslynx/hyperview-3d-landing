import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTheme } from '../../context/ThemeContext';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import { ModelLoader } from '../3d/ModelLoader';
import type { ComponentBaseProps } from '../../types';
import './footer.css';

interface FooterProps extends ComponentBaseProps {
  copyright?: string;
  legalLinks?: Array<{ label: string; href: string }>;
  has3D?: boolean;
}

const Footer: React.FC<FooterProps> = ({ copyright = '© 2024 3D SaaS', legalLinks = [], has3D = true, className, style, ...props }) => {
  const { isDarkMode, colors } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  const legalLinksList = useMemo(() => (
    <ul className="flex space-x-4">
      {legalLinks.map((link) => (
        <li key={link.href}>
          <Link
            to={link.href}
            className="text-gray-500 hover:text-gray-300 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  ), [legalLinks]);

  const render3DBackground = useCallback(() => {
    return (
      <Canvas className="absolute inset-0 z-0" dpr={[1, 2]} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={isDarkMode ? 0.3 : 0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={isDarkMode ? 0.4 : 0.7}
          color={colors.primary}
        />
        <directionalLight
          position={[-10, 5, -5]}
          intensity={isDarkMode ? 0.2 : 0.4}
          color={colors.accent}
        />
        <ModelLoader modelPath="/models/abstract-scene.glb" />
      </Canvas>
    );
  }, [isDarkMode, colors]);

  return (
    <footer
      className={`relative py-6 ${className || ''} bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300`}
      style={style}
      {...props}
      ref={containerRef}
    >
      {has3D && (
        <div className="absolute inset-0 overflow-hidden">
          {render3DBackground()}
        </div>
      )}
      <div className="container mx-auto relative z-10 flex items-center justify-between">
        <p className="text-sm">{copyright}</p>
        {legalLinksList}
      </div>
    </footer>
  );
};

export default memo(Footer);