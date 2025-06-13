import React, { useEffect, useState } from 'react';
import { gsap } from 'gsap';

const LoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Animate loading screen out
      gsap.to('.loading-screen', {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut',
        onComplete: () => {
          const element = document.querySelector('.loading-screen');
          if (element) {
            element.remove();
          }
        }
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="loading-screen fixed inset-0 bg-space-950 z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-300 border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <h2 className="text-xl font-semibold text-blue-400 animate-pulse">Loading Portfolio</h2>
        <p className="text-space-400 mt-2">Initializing 3D Experience...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;