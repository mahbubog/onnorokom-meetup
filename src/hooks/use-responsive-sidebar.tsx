import { useState, useEffect } from 'react';

export const useResponsiveSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      // Auto-collapse on screens smaller than 768px (md breakpoint)
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Check on mount
    checkScreenSize();

    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return {
    isCollapsed,
    setIsCollapsed,
    toggleSidebar: () => setIsCollapsed(prev => !prev)
  };
};