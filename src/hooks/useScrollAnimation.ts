import { useState, useRef, useCallback, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as THREE from 'three';

interface ScrollAnimationConfig {
  start: string;
  end: string;
  triggerHook?: number;
  horizontal?: boolean;
}

interface UseScrollAnimationResult {
  scrollY: number;
  scrollX: number;
  sectionRef: React.RefObject<HTMLDivElement>;
  visible: boolean;
}

/**
 * Custom hook for managing scroll-based animations with GSAP ScrollTrigger in a Three.js scene.
 *
 * @param sectionRef - React ref to the HTML section that triggers the animation.
 * @param config - Configuration options for the scroll animation.
 * @returns An object containing the scroll progress, visibility state, and section ref.
 */
export const useScrollAnimation = (
  sectionRef: React.RefObject<HTMLDivElement>,
  config?: ScrollAnimationConfig
): UseScrollAnimationResult => {
  const [scrollY, setScrollY] = useState<number>(0);
  const [scrollX, setScrollX] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const { camera } = useThree();
  const scrollTrigger = useRef<gsap.core.Timeline | null>(null);

  const calculateScrollProgress = useCallback((event?: Event) => {
    if (!sectionRef.current) return;

    const element = sectionRef.current;
    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;

    let scrollProgress;

    if (config?.horizontal) {
      const elementWidth = element.offsetWidth;
      const start = rect.left;
      const end = rect.right - viewportWidth;
      scrollProgress = Math.max(0, Math.min(1, (start * -1) / end));
      setScrollX(scrollProgress);
      setScrollY(0);
    } else {
      const elementHeight = element.offsetHeight;
      const start = rect.top;
      const end = rect.bottom - viewportHeight;
      scrollProgress = Math.max(0, Math.min(1, (start * -1) / end));
      setScrollY(scrollProgress);
      setScrollX(0);
    }
  }, [config?.horizontal]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const element = sectionRef.current;

    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            setVisible(entry.isIntersecting);
          });
        },
        { threshold: config?.triggerHook !== undefined ? config?.triggerHook : 0 }
    );

    if (element) {
      observer.observe(element);
    }

    const scrollListener = (event: Event) => {
      calculateScrollProgress(event);
    };

    window.addEventListener('scroll', scrollListener, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scrollListener);
    };
  }, [sectionRef, calculateScrollProgress, config?.triggerHook]);

  return {
    scrollY,
    scrollX,
    sectionRef,
    visible
  };
};