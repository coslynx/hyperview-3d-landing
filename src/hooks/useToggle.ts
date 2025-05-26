import { useState, useEffect, useCallback } from 'react';

/**
 * Interface for the return value of the useToggle hook.
 */
interface UseToggleReturnType {
  /**
   * Boolean value indicating the current toggle state (true for 'on', false for 'off').
   */
  isOn: boolean;
  /**
   * Function to toggle the state value.
   */
  toggle: () => void;
}

/**
 * Custom React hook for managing a boolean toggle with persistent state in local storage.
 *
 * @returns An object containing the toggle state and a function to toggle the state.
 */
export const useToggle = (defaultValue: boolean = false): UseToggleReturnType => {
  const [isOn, setIsOn] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const storedValue = localStorage.getItem('theme');
      return storedValue === 'dark' ? true : false;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return defaultValue;
    }
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('theme', isOn ? 'dark' : 'light');
      } catch (error) {
        console.error('Error setting localStorage:', error);
      }
    }
  }, [isOn]);

  const toggle = useCallback(() => {
    setIsOn(prevIsOn => !prevIsOn);
  }, []);

  return { isOn, toggle };
};