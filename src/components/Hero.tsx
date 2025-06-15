import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import SkullScene from './SkullScene';

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

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

    // Floating animation for particles
    if (particlesRef.current) {
      const particles = particlesRef.current.children;
      Array.from(particles).forEach((particle, index) => {
        gsap.to(particle, {
          y: `random(-30, 30)`,
          x: `random(-20, 20)`,
          rotation: `random(-180, 180)`,
          duration: `random(3, 6)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.1,
        });
      });
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToProjects = () => {
    const projectsSection = document.querySelector('#projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced background gradients */}
      <div className="absolute inset-0 bg-gradient-radial opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-conic opacity-40"></div>
      
      {/* Animated mesh background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1)_0%,transparent_50%)] animate-ping"></div>
      </div>
      
      {/* Enhanced particle background */}
      <div ref={particlesRef} className="absolute inset-0 opacity-30">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-pulse ${
              i % 4 === 0 ? 'w-2 h-2 bg-blue-400' :
              i % 4 === 1 ? 'w-1 h-1 bg-purple-400' :
              i % 4 === 2 ? 'w-3 h-3 bg-green-400' :
              'w-1.5 h-1.5 bg-yellow-400'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute opacity-20 ${
              i % 3 === 0 ? 'w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full' :
              i % 3 === 1 ? 'w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rotate-45' :
              'w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-lg rotate-12'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Enhanced Text Content */}
          <div className="text-center lg:text-left">
            <h1 
              ref={titleRef}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Welcome to My
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse">
                Digital Universe
              </span>
            </h1>
            
            <p 
              ref={subtitleRef}
              className="text-xl sm:text-2xl text-space-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              I'm <span className="text-blue-400 font-semibold">Mohammed Ajmal</span>, a passionate developer crafting 
              <span className="text-purple-400 font-semibold"> interactive 3D experiences</span> and 
              <span className="text-green-400 font-semibold"> modern web solutions</span>. 
              Navigate through my anatomical portfolio by clicking on skull parts.
            </p>
            
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToProjects}
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 overflow-hidden"
              >
                <span className="relative z-10">Explore My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-400/25 overflow-hidden"
              >
                <span className="relative z-10">Get In Touch</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>

          {/* Enhanced 3D Skull Scene */}
          <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden bg-gradient-to-br from-space-800/50 to-space-900/50 backdrop-blur-sm border border-space-700 shadow-2xl shadow-blue-500/10">
            <SkullScene />
            
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            {/* Enhanced instructions */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center bg-space-800/90 backdrop-blur-md rounded-xl p-4 border border-space-600">
              <p className="text-space-300 text-sm mb-2 font-medium">🎯 Interactive Navigation</p>
              <div className="flex items-center justify-center space-x-3">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-space-400">Click skull parts</span>
                </div>
                <div className="w-px h-4 bg-space-600"></div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-space-400">Navigate sections</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <ChevronDown className="w-8 h-8 text-blue-400 animate-pulse" />
          <div className="w-px h-8 bg-gradient-to-b from-blue-400 to-transparent"></div>
        </div>
      </div>

      {/* Ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};

export default Hero;