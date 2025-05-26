import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useToggle } from '../../hooks/useToggle';
import { Sun, Moon } from 'lucide-react';
import { three3DHelpersUtil } from '../../utils/three-helpers';
import * as THREE from 'three';

interface HeaderProps {
  navLinks: { to: string; label: string; }[];
}

const Header: React.FC<HeaderProps> = ({ navLinks }) => {
  const [isDarkMode, toggleTheme] = useToggle(false);
  const [rotation, setRotation] = useState(0);

  const handleToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') === 'dark';
    if (savedTheme !== isDarkMode) {
      handleToggle();
    }
  }, [isDarkMode, handleToggle]);

  useEffect(() => {
    const animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const animate = useCallback(() => {
    setRotation((prevRotation) => (prevRotation + 0.01) % (2 * Math.PI));
    requestAnimationFrame(animate);
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          3D SaaS
        </Link>

        <nav>
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          onClick={handleToggle}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6 text-yellow-500" />
          ) : (
            <Moon className="h-6 w-6 text-gray-500" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;