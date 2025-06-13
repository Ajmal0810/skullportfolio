import React, { useEffect, useRef } from 'react';
import { ExternalLink, Github, Play } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Projects: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const projectsRef = useRef<HTMLDivElement[]>([]);

  const projects = [
    {
      id: 1,
      title: "3D Product Configurator",
      description: "Interactive 3D product customization platform built with Three.js and React. Features real-time material changes, lighting adjustments, and AR preview capabilities.",
      image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600",
      technologies: ["Three.js", "React", "WebGL", "GSAP"],
      liveUrl: "#",
      githubUrl: "#",
      featured: true
    },
    {
      id: 2,
      title: "Medical Data Visualization",
      description: "Advanced medical imaging platform with 3D anatomical models, interactive surgical planning tools, and real-time collaboration features.",
      image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg?auto=compress&cs=tinysrgb&w=600",
      technologies: ["Three.js", "WebGL", "Node.js", "MongoDB"],
      liveUrl: "#",
      githubUrl: "#",
      featured: true
    },
    {
      id: 3,
      title: "Virtual Reality Showroom",
      description: "Immersive VR experience for automotive industry. Features realistic car models, interactive configurator, and virtual test drives.",
      image: "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=600",
      technologies: ["A-Frame", "WebXR", "Three.js", "WebRTC"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false
    },
    {
      id: 4,
      title: "AI-Powered Dashboard",
      description: "Modern analytics dashboard with real-time data visualization, predictive analytics, and interactive 3D charts.",
      image: "https://images.pexels.com/photos/669610/pexels-photo-669610.jpeg?auto=compress&cs=tinysrgb&w=600",
      technologies: ["React", "D3.js", "Python", "TensorFlow"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false
    },
    {
      id: 5,
      title: "Blockchain Visualization Tool",
      description: "Interactive blockchain explorer with 3D network visualization, transaction tracking, and smart contract analysis.",
      image: "https://images.pexels.com/photos/730547/pexels-photo-730547.jpeg?auto=compress&cs=tinysrgb&w=600",
      technologies: ["Three.js", "Web3.js", "React", "Solidity"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false
    },
    {
      id: 6,
      title: "Interactive Learning Platform",
      description: "Educational platform with 3D models, interactive simulations, and gamified learning experiences for STEM subjects.",
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=600",
      technologies: ["Three.js", "React", "Firebase", "WebGL"],
      liveUrl: "#",
      githubUrl: "#",
      featured: false
    }
  ];

  useEffect(() => {
    // Title animation
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: titleRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Projects stagger animation
    gsap.fromTo(projectsRef.current,
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !projectsRef.current.includes(el)) {
      projectsRef.current.push(el);
    }
  };

  return (
    <section id="projects" ref={sectionRef} className="py-20 bg-gradient-to-b from-space-950 to-space-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Projects</span>
          </h2>
          <p className="text-xl text-space-300 max-w-3xl mx-auto">
            A showcase of my work in 3D web development, interactive experiences, and cutting-edge technologies.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {projects.filter(project => project.featured).map((project) => (
            <div
              key={project.id}
              ref={addToRefs}
              className="group relative bg-space-800 rounded-2xl overflow-hidden border border-space-700 hover:border-blue-500/50 transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-transparent to-transparent opacity-60"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Featured
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-space-300 mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="bg-space-700 text-blue-300 text-sm px-3 py-1 rounded-lg border border-space-600"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-4">
                  <a
                    href={project.liveUrl}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors group/btn"
                  >
                    <Play size={16} />
                    <span>Live Demo</span>
                    <ExternalLink size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href={project.githubUrl}
                    className="flex items-center space-x-2 border border-space-600 hover:border-blue-500 text-space-300 hover:text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Github size={16} />
                    <span>Code</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.filter(project => !project.featured).map((project) => (
            <div
              key={project.id}
              ref={addToRefs}
              className="group bg-space-800 rounded-xl overflow-hidden border border-space-700 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-transparent to-transparent opacity-60"></div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-space-300 text-sm mb-3 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies.slice(0, 2).map((tech, index) => (
                    <span
                      key={index}
                      className="bg-space-700 text-blue-300 text-xs px-2 py-1 rounded border border-space-600"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 2 && (
                    <span className="text-space-400 text-xs px-2 py-1">
                      +{project.technologies.length - 2}
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <a
                    href={project.liveUrl}
                    className="flex-1 flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded transition-colors"
                  >
                    <Play size={14} />
                    <span>Demo</span>
                  </a>
                  <a
                    href={project.githubUrl}
                    className="flex items-center justify-center border border-space-600 hover:border-blue-500 text-space-300 hover:text-white p-2 rounded transition-colors"
                  >
                    <Github size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;