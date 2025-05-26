import React, { memo, useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { ModelLoader } from '../3d/ModelLoader';
import { getSampleModels, SampleModel } from '../../utils/sampleModelHelper';
import type { ComponentBaseProps } from '../../types';
import './styles/pages/model-showcase.css';

interface ModelShowcasePageProps extends ComponentBaseProps {
  models?: SampleModel[];
}

const ModelShowcasePage: React.FC<ModelShowcasePageProps> = memo(({
  className,
  style,
  ...props
}) => {
  const { isDarkMode } = useTheme();
  const [models, setModels] = useState<SampleModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const sampleModels = getSampleModels();
      setModels(sampleModels);
      setLoading(false);
    } catch (e) {
      const loadError = e instanceof Error ? e : new Error('Failed to load sample models');
      setError(loadError);
      setLoading(false);
    }
  }, []);

  const renderThreeJsScene = useCallback((modelUrl: string) => {
    return (
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ height: '300px' }}
      >
        <ambientLight intensity={isDarkMode ? 0.3 : 0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={0.7}
          color={'#ffffff'}
          castShadow
        />
        <directionalLight
          position={[-10, 5, -5]}
          intensity={0.4}
          color={'#ffffff'}
        />
        <ModelLoader
          modelUrl={modelUrl}
          onLoad={() => setLoading(false)}
          onError={(e) => setError(new Error('Model loading failed'))}
        />
        <OrbitControls />
      </Canvas>
    );
  }, [isDarkMode]);

  if (error) {
    return (
      <div className={`model-showcase-page ${className || ''}`} style={style} {...props}>
        <div className="container mx-auto py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Error</h2>
          <p>Failed to load models. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`model-showcase-page ${className || ''} bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200`}
      style={style}
      {...props}
    >
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-semibold mb-4">3D Model Showcase</h1>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <li>Loading models...</li>
          ) : (
            models.map((model) => (
              <li key={model.url} className="model-item">
                <div className="relative">
                  {renderThreeJsScene(model.url)}
                </div>
                <div className="mt-2">
                  <h3 className="text-lg font-medium">{model.title}</h3>
                  <p className="text-sm text-gray-500">{model.description}</p>
                  <a
                      href={model.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-blue-500 hover:underline"
                  >
                      View details
                  </a>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
});

ModelShowcasePage.displayName = 'ModelShowcasePage';

export default ModelShowcasePage;

export interface SampleModel {
    url: string;
    title: string;
    description: string;
    href: string;
}