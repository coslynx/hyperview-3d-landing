import React from 'react';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import type {  ComponentBaseProps } from '../../types';
import Header from './Header';
import Footer from './Footer';
import './minimal-layout.css';

interface MinimalLayoutProps extends ComponentBaseProps {
  children: React.ReactNode;
}

/**
 * @component
 * A minimal layout component providing a header, footer, and main content area. Manages theme context and responsive design.
 *
 * @param children - The content to be rendered within the layout.
 *
 * @example
 * <MinimalLayout>
 *   <LandingHero />
 *   <ModelShowcasePage />
 * </MinimalLayout>
 */
const MinimalLayout: React.FC<MinimalLayoutProps> = ({ children, className, style, ...props }) => {
  return (
    <div className={`minimal-layout ${className || ''}`} style={style} {...props}>
      <Header navLinks={[{ to: '/about', label: 'About' }, { to: '/models', label: 'Models' }, { to: '/contact', label: 'Contact' }]} />
      <main className="container mx-auto py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default React.memo(MinimalLayout);