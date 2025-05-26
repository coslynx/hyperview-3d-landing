import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MinimalLayout from './components/layout/MinimalLayout';

const LandingHero = lazy(() => import('./components/sections/LandingHero'));
const ModelShowcasePage = lazy(() => import('./pages/ModelShowcasePage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route
            path="/"
            element={
              <MinimalLayout>
                <Suspense fallback={<div>Loading Hero...</div>}>
                  <LandingHero
                    modelUrl="/models/laptop.glb"
                    headline="Experience Immersive 3D Web Design"
                    subheadline="Create stunning, interactive 3D landing pages with ease."
                    ctaLabel="Get Started"
                    ctaLink="/models"
                  />
                </Suspense>
              </MinimalLayout>
            }
          />
          <Route
            path="/models"
            element={
              <MinimalLayout>
                <Suspense fallback={<div>Loading Models...</div>}>
                  <ModelShowcasePage />
                </Suspense>
              </MinimalLayout>
            }
          />
          <Route
            path="/experience"
            element={
              <MinimalLayout>
                <Suspense fallback={<div>Loading Experience...</div>}>
                  <ExperiencePage modelUrl="/models/scene.glb" environmentMap="/hdri/skybox.hdr" />
                </Suspense>
              </MinimalLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <MinimalLayout>
                <Suspense fallback={<div>Loading Contact...</div>}>
                  <ContactPage />
                </Suspense>
              </MinimalLayout>
            }
          />
          <Route
            path="/about"
            element={
              <MinimalLayout>
                <Suspense fallback={<div>Loading About...</div>}>
                  <AboutPage />
                </Suspense>
              </MinimalLayout>
            }
          />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;