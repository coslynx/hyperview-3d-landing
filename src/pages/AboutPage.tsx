import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';
import { use3DAnimation } from '../../hooks/use3DAnimation';
import { ModelLoader } from '../3d/ModelLoader';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import type { ComponentBaseProps } from '../../types';
import MinimalLayout from '../layout/MinimalLayout';

interface AboutPageProps extends ComponentBaseProps {
    modelUrl?: string;
    title?: string;
    content?: string;
}

/**
 * @component
 * Displays the About Page with a combination of text and interactive 3D elements.
 */
const AboutPage: React.FC<AboutPageProps> = memo(({ className, style, modelUrl, title = "About Us", content = "Our company is dedicated to creating an awesome experience", ...props }) => {
    const { isDarkMode, colors } = useTheme();
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const { scene, camera, gl } = useThree();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.title = 'About Us - 3D SaaS';

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
                    modelUrl={modelUrl || '/models/abstract-scene.glb'}
                    onLoad={() => setLoading(false)}
                    onError={(e) => setError(new Error('Model loading failed'))}
                />
                <OrbitControls />
            </Canvas>
        );
    }, [isDarkMode, modelUrl]);

    return (
        <MinimalLayout>
            <div
                className={`about-page ${className || ''} bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200`}
                style={style}
                {...props}
                ref={scrollRef}
            >
                <div className="container mx-auto py-12">
                    <h1 className="text-3xl font-semibold mb-4">{title}</h1>
                    {loading && <p>Loading content please wait</p>}
                    {renderThreeJsScene()}
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-50">
                        Our Values
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-100">
                       Our mission is to push the limits of interactive experiences by combining the capabilities of WebGL graphics and web development frameworks.
                      </p>
                    </div>
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-50">
                        What We Do
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-100">
                       We are a top notch SaaS provider with a history of making awesome webpages.
                      </p>
                    </div>
                </div>
            </div>
        </MinimalLayout>
    );
});

AboutPage.displayName = 'AboutPage';

export default AboutPage;