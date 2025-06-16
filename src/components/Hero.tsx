import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SkullScene from './SkullScene';
import ErrorBoundary from './ErrorBoundary';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 2.2 });
    
    tl.fromTo(titleRef.current, 
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
    )
    .fromTo(subtitleRef.current,
      { opacity: 0, y: 30, x: -20 },
      { opacity: 1, y: 0, x: 0, duration: 1, ease: 'power3.out' },
      '-=0.6'
    )
    .fromTo(ctaRef.current,
      { opacity: 0, y: 20, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' },
      '-=0.4'
    );

    // Enhanced parallax effect
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.3;
        const opacity = Math.max(0, 1 - scrolled / window.innerHeight);
        
        heroRef.current.style.transform = `translateY(${rate}px)`;
        heroRef.current.style.opacity = opacity.toString();
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const scrollToProjects = () => {
    const projectsSection = document.querySelector('#projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Pure black animated background */}
      <div className="absolute inset-0 bg-black"></div>
      
      {/* Subtle animated mesh background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/3 to-yellow-500/5 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(220,38,38,0.05)_0%,transparent_50%)] animate-ping"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(251,146,60,0.03)_0%,transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Enhanced Text Content with dark theme */}
          <div className="text-center lg:text-left">
            <h1 
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Welcome to My
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-500 to-yellow-500 animate-pulse drop-shadow-2xl">
                Dark Universe
              </span>
            </h1>
            
            <p 
              ref={subtitleRef}
              className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              I'm <span className="text-red-400 font-semibold drop-shadow-lg">Mohammed Ajmal</span>, a passionate developer crafting 
              <span className="text-orange-400 font-semibold drop-shadow-lg"> haunting 3D experiences</span> and 
              <span className="text-yellow-400 font-semibold drop-shadow-lg"> dark web solutions</span>. 
              Navigate through my anatomical portfolio by clicking on the skull parts.
            </p>
            
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToProjects}
                className="group relative bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 overflow-hidden"
              >
                <span className="relative z-10">Explore My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-400/25 overflow-hidden"
              >
                <span className="relative z-10">Get In Touch</span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Enhanced 3D Skull Scene with clean visibility */}
          <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden bg-black border border-red-900/30 shadow-2xl shadow-red-500/10">
            <ErrorBoundary>
              <SkullScene />
            </ErrorBoundary>
            
            {/* Subtle glowing border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/5 via-orange-500/5 to-yellow-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            {/* Enhanced instructions */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center bg-black/95 backdrop-blur-md rounded-xl p-4 border border-red-600/50">
              <p className="text-red-300 text-sm mb-2 font-medium">💀 Interactive Navigation</p>
              <div className="flex items-center justify-center space-x-3">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-sm shadow-red-400/50"></div>
                  <span className="text-xs text-gray-400">Click skull parts</span>
                </div>
                <div className="w-px h-4 bg-red-600/50"></div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-sm shadow-orange-400/50"></div>
                  <span className="text-xs text-gray-400">Navigate sections</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <ChevronDown className="w-8 h-8 text-red-400 animate-pulse drop-shadow-lg" />
          <div className="w-px h-8 bg-gradient-to-b from-red-400 to-transparent"></div>
        </div>
      </div>

      {/* Subtle ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/3 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-yellow-500/3 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
    </section>
  );
};

export default Hero;