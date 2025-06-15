import React, { useEffect, useRef } from 'react';
import { ExternalLink, Github, Play, Zap, Eye } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const projectsRef = useRef<HTMLDivElement[]>([]);
  const floatingElementsRef = useRef<HTMLDivElement[]>([]);

  const projects = [
    {
      id: 1,
      title: "3D Product Configurator",
      description: "Interactive 3D product customization platform built with Three.js and React. Features real-time material changes, lighting adjustments, and AR preview capabilities with advanced physics simulation.",
      image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600",
      technologies: ["Three.js", "React", "WebGL", "GSAP", "WebXR"],
      liveUrl: "#",
      githubUrl: "#",
      featured: true,
      stats: { views: "15.2K", likes: "892", forks: "156" }
    },
    {
      id: 2,
      title: "Medical Data Visualization",
      description: "Advanced medical imaging platform with 3D anatomical models, interactive surgical planning tools, and real-time collaboration features. Includes AI-powered diagnosis assistance.",
      image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=600",
      technologies: ["Three.js", "WebGL", "Node.js", "MongoDB", "TensorFlow.js"],
      liveUrl: "#",
      githubUrl: "#",
      featured: true,
      stats: { views: "23.7K", likes: "1.2K", forks: "234" }
    },
    {
      id: 3,
      title: "Virtual Reality Showroom",
      description: "Immersive VR experience for automotive industry. Features realistic car models, interactive configurator, and virtual test drives with haptic feedback integration.",
      image: "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=600",
      technologies: ["A-Frame", "WebXR", "Three.js", "WebRTC", "Socket.io"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      stats: { views: "8.9K", likes: "445", forks: "89" }
    },
    {
      id: 4,
      title: "AI-Powered Dashboard",
      description: "Modern analytics dashboard with real-time data visualization, predictive analytics, and interactive 3D charts. Features machine learning insights and automated reporting.",
      image: "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=600",
      technologies: ["React", "D3.js", "Python", "TensorFlow", "FastAPI"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      stats: { views: "12.3K", likes: "678", forks: "123" }
    },
    {
      id: 5,
      title: "Blockchain Visualization Tool",
      description: "Interactive blockchain explorer with 3D network visualization, transaction tracking, and smart contract analysis. Real-time monitoring of DeFi protocols.",
      image: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=600",
      technologies: ["Three.js", "Web3.js", "React", "Solidity", "GraphQL"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      stats: { views: "19.1K", likes: "934", forks: "187" }
    },
    {
      id: 6,
      title: "Interactive Learning Platform",
      description: "Educational platform with 3D models, interactive simulations, and gamified learning experiences for STEM subjects. Includes VR classroom integration.",
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600",
      technologies: ["Three.js", "React", "Firebase", "WebGL", "WebXR"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
      stats: { views: "14.6K", likes: "756", forks: "145" }
    }
  ];

  useEffect(() => {
    // Enhanced title animation with 3D effect
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 100, rotationX: -90, scale: 0.5 },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Enhanced projects stagger animation
    gsap.fromTo(projectsRef.current,
      { 
        opacity: 0, 
        y: 100, 
        scale: 0.8,
        rotationY: -15,
        z: -100
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationY: 0,
        z: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Floating elements animation
    floatingElementsRef.current.forEach((element, index) => {
      if (element) {
        gsap.to(element, {
          y: `random(-20, 20)`,
          x: `random(-15, 15)`,
          rotation: `random(-10, 10)`,
          duration: `random(3, 5)`,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2,
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !projectsRef.current.includes(el)) {
      projectsRef.current.push(el);
    }
  };

  const addToFloatingRefs = (el: HTMLDivElement | null) => {
    if (el && !floatingElementsRef.current.includes(el)) {
      floatingElementsRef.current.push(el);
    }
  };

  return (
    <section id="projects" ref={sectionRef} className="relative py-20 bg-gradient-to-b from-space-950 via-space-900 to-space-950 overflow-hidden">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-green-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            ref={addToFloatingRefs}
            className={`absolute opacity-10 ${
              i % 4 === 0 ? 'w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full' :
              i % 4 === 1 ? 'w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rotate-45' :
              i % 4 === 2 ? 'w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg rotate-12' :
              'w-4 h-12 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full rotate-45'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 ref={titleRef} className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">Projects</span>
          </h2>
          <p className="text-xl sm:text-2xl text-space-300 max-w-4xl mx-auto leading-relaxed">
            A showcase of my work in <span className="text-blue-400 font-semibold">3D web development</span>, 
            <span className="text-purple-400 font-semibold"> interactive experiences</span>, and 
            <span className="text-green-400 font-semibold"> cutting-edge technologies</span>.
          </p>
        </div>

        {/* Featured Projects */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {projects.filter(project => project.featured).map((project) => (
            <div
              key={project.id}
              ref={addToRefs}
              className="group relative bg-gradient-to-br from-space-800/80 to-space-900/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-space-700 hover:border-blue-500/50 transition-all duration-700 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20"
            >
              {/* Enhanced image container */}
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-72 object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-transparent to-transparent opacity-80"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Enhanced badges */}
                <div className="absolute top-6 left-6 flex space-x-2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    ⭐ Featured
                  </span>
                  <span className="bg-space-800/90 backdrop-blur-sm text-green-400 text-sm font-semibold px-3 py-2 rounded-full border border-green-500/30">
                    <Zap size={14} className="inline mr-1" />
                    Live
                  </span>
                </div>

                {/* Project stats */}
                <div className="absolute top-6 right-6 bg-space-800/90 backdrop-blur-sm rounded-xl p-3 border border-space-600">
                  <div className="flex items-center space-x-4 text-xs">
                    <div className="flex items-center space-x-1">
                      <Eye size={12} className="text-blue-400" />
                      <span className="text-space-300">{project.stats.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-red-400">♥</span>
                      <span className="text-space-300">{project.stats.likes}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-space-300 mb-6 leading-relaxed text-lg">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-space-700 to-space-600 text-blue-300 text-sm font-medium px-4 py-2 rounded-xl border border-space-500 hover:border-blue-500/50 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  <a
                    href={project.liveUrl}
                    className="group/btn flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                  >
                    <Play size={18} />
                    <span>Live Demo</span>
                    <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href={project.githubUrl}
                    className="flex items-center space-x-2 border-2 border-space-600 hover:border-blue-500 text-space-300 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:bg-blue-500/10"
                  >
                    <Github size={18} />
                    <span>Code</span>
                  </a>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Other Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.filter(project => !project.featured).map((project) => (
            <div
              key={project.id}
              ref={addToRefs}
              className="group bg-gradient-to-br from-space-800/60 to-space-900/60 backdrop-blur-sm rounded-2xl overflow-hidden border border-space-700 hover:border-blue-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/20"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-transparent to-transparent opacity-70"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Mini stats */}
                <div className="absolute top-4 right-4 bg-space-800/90 backdrop-blur-sm rounded-lg p-2 border border-space-600">
                  <div className="flex items-center space-x-2 text-xs">
                    <Eye size={10} className="text-blue-400" />
                    <span className="text-space-300">{project.stats.views}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-space-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className="bg-space-700 text-blue-300 text-xs font-medium px-3 py-1 rounded-lg border border-space-600"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-space-400 text-xs px-2 py-1 font-medium">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-3">
                  <a
                    href={project.liveUrl}
                    className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Play size={14} />
                    <span>Demo</span>
                  </a>
                  <a
                    href={project.githubUrl}
                    className="flex items-center justify-center border-2 border-space-600 hover:border-blue-500 text-space-300 hover:text-white p-2 rounded-lg transition-all duration-300 hover:bg-blue-500/10"
                  >
                    <Github size={16} />
                  </a>
                </div>
              </div>

              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-gradient-to-r from-space-800/80 to-space-700/80 backdrop-blur-sm border border-space-600 rounded-2xl p-6">
            <div className="text-4xl">🚀</div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white mb-1">Ready to collaborate?</h3>
              <p className="text-space-300 text-sm">Let's build something amazing together</p>
            </div>
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Get In Touch
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;