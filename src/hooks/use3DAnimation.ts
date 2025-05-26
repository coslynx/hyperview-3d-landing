import { useState, useEffect, useRef, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';

type AnimationTargetType =
  | THREE.Object3D
  | THREE.Mesh
  | THREE.Material
  | THREE.Vector3
  | THREE.Quaternion
  | THREE.Euler
  | number;

interface Use3DAnimationResult {
  start: () => void;
  pause: () => void;
  stop: () => void;
  seek: (value: number) => void;
  timeline: gsap.core.Timeline | null;
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
}

/**
 * Custom hook for managing and controlling 3D animations within React components.
 * Provides a centralized animation system using GSAP.
 *
 * @returns An object containing functions to control the animation timeline and animation state.
 */
export const use3DAnimation = (): Use3DAnimationResult => {
  const [timeline, setTimeline] = useState<gsap.core.Timeline | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const { scene } = useThree();
  const animationFrame = useRef(0);

  const start = useCallback(() => {
    if (!timeline) {
      console.warn('No timeline to start.');
      return;
    }
    timeline.play();
    setIsPlaying(true);
      setIsPaused(false);
  }, [timeline]);

  const pause = useCallback(() => {
    if (!timeline) {
      console.warn('No timeline to pause.');
      return;
    }
    timeline.pause();
    setIsPlaying(false);
      setIsPaused(true);
  }, [timeline]);

  const stop = useCallback(() => {
    if (!timeline) {
      console.warn('No timeline to stop.');
      return;
    }

    timeline.kill();
    setTimeline(null);
    setIsPlaying(false);
      setIsPaused(false);
    setProgress(0);
    cancelAnimationFrame(animationFrame.current)
  }, [timeline]);

  const seek = useCallback((value: number) => {
    if (!timeline) {
      console.warn('No timeline to seek.');
      return;
    }

    timeline.seek(value);
    setProgress(value);
  }, [timeline]);

  const createTimeline = useCallback(
    (
      tweens: {
        target: AnimationTargetType;
        duration: number;
        values: gsap.TweenVars;
      }[]
    ) => {
      if (!scene) {
        console.warn('No scene available to create timeline.');
        return;
      }
  
      // Kill existing timeline if it exists
      if (timeline) {
        stop();
      }
  
      const newTimeline = gsap.timeline();
      tweens.forEach((tween) => {
        newTimeline.to(tween.target, tween.values, tween.duration);
      });
      setTimeline(newTimeline);
        setIsPlaying(false);
      return newTimeline;
    },
    [scene, stop, timeline]
  );

  useEffect(() => {
    if (timeline) {
          animationFrame.current = requestAnimationFrame(updateProgress);
    }
      
    return () => {
      cancelAnimationFrame(animationFrame.current);
    };
  }, [timeline, isPlaying, progress]);

  const updateProgress = useCallback(() => {
    if (timeline && isPlaying) {
          setProgress(timeline.progress());
    }
      animationFrame.current = requestAnimationFrame(updateProgress);
  }, [timeline, isPlaying, progress]);

  return {
    start,
    pause,
    stop,
    seek,
    timeline,
    isPlaying,
    isPaused,
    progress,
    createTimeline,
  };
};