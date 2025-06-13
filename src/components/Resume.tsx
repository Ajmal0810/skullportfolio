import React, { useEffect, useRef } from 'react';
import { Download, Eye, Briefcase, GraduationCap, Award } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Resume: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement[]>([]);

  const experience = [
    {
      title: "Senior 3D Web Developer",
      company: "TechVision Studios",
      period: "2022 - Present",
      description: "Leading development of interactive 3D web applications using Three.js and WebGL. Implemented complex 3D visualizations for medical, automotive, and architectural clients.",
      achievements: [
        "Increased client engagement by 85% through immersive 3D experiences",
        "Optimized 3D rendering performance by 60% using advanced LOD techniques",
        "Led a team of 5 developers on large-scale VR/AR projects"
      ]
    },
    {
      title: "Frontend Developer",
      company: "Digital Innovations Inc.",
      period: "2021 - 2022",
      description: "Developed responsive web applications using React.js and modern frontend technologies. Specialized in creating interactive user interfaces and data visualizations.",
      achievements: [
        "Built 20+ responsive web applications with 99.9% uptime",
        "Reduced page load times by 45% through optimization techniques",
        "Mentored junior developers in React.js best practices"
      ]
    },
    {
      title: "Junior Web Developer",
      company: "Creative Solutions",
      period: "2020 - 2021",
      description: "Started career developing websites and web applications. Gained expertise in HTML, CSS, JavaScript, and various web frameworks.",
      achievements: [
        "Delivered 15+ client projects on time and within budget",
        "Learned and implemented modern web development practices",
        "Collaborated with design team to create pixel-perfect interfaces"
      ]
    }
  ];

  const education = [
    {
      degree: "Bachelor of Computer Science",
      institution: "University of Technology",
      period: "2017 - 2020",
      description: "Specialized in Computer Graphics and Web Technologies. Graduated with honors.",
      courses: ["Computer Graphics", "Web Development", "Data Structures", "Software Engineering"]
    },
    {
      degree: "3D Graphics & Animation Certificate",
      institution: "Digital Arts Institute",
      period: "2020",
      description: "Intensive program covering 3D modeling, animation, and real-time rendering techniques.",
      courses: ["3D Modeling", "Animation", "Rendering", "Game Development"]
    }
  ];

  const certifications = [
    {
      name: "Three.js Certified Developer",
      issuer: "3D Web Academy",
      year: "2023"
    },
    {
      name: "React.js Advanced Certification",
      issuer: "Meta",
      year: "2022"
    },
    {
      name: "WebGL Fundamentals",
      issuer: "Khronos Group",
      year: "2021"
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

    // Content sections animation
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 60, scale: 0.95 },
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
    if (el && !contentRef.current.includes(el)) {
      contentRef.current.push(el);
    }
  };

  const handleDownloadResume = () => {
    // Create a mock PDF download (replace with actual PDF URL)
    const link = document.createElement('a');
    link.href = '#'; // Replace with actual PDF URL
    link.download = 'Mohammed_Ajmal_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="resume" ref={sectionRef} className="py-20 bg-gradient-to-b from-space-900 to-space-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Resume</span>
          </h2>
          <p className="text-xl text-space-300 max-w-3xl mx-auto mb-8">
            Comprehensive overview of my professional journey, education, and achievements in 3D web development.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadResume}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              <Download size={20} />
              <span>Download PDF</span>
            </button>
            <button className="inline-flex items-center space-x-2 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              <Eye size={20} />
              <span>View Online</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Experience */}
          <div ref={addToRefs} className="lg:col-span-2">
            <div className="bg-space-800 rounded-2xl p-8 border border-space-700 h-full">
              <div className="flex items-center mb-8">
                <Briefcase className="text-blue-400 mr-3" size={28} />
                <h3 className="text-2xl font-bold text-white">Professional Experience</h3>
              </div>
              
              <div className="space-y-8">
                {experience.map((job, index) => (
                  <div key={index} className="relative">
                    {index !== experience.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-space-600"></div>
                    )}
                    
                    <div className="flex">
                      <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <h4 className="text-xl font-bold text-white">{job.title}</h4>
                          <span className="text-blue-400 font-medium">{job.period}</span>
                        </div>
                        <p className="text-blue-300 font-medium mb-3">{job.company}</p>
                        <p className="text-space-300 mb-4">{job.description}</p>
                        
                        <ul className="space-y-2">
                          {job.achievements.map((achievement, achievementIndex) => (
                            <li key={achievementIndex} className="text-space-300 flex items-start">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education & Certifications */}
          <div className="space-y-8">
            {/* Education */}
            <div ref={addToRefs} className="bg-space-800 rounded-2xl p-8 border border-space-700">
              <div className="flex items-center mb-6">
                <GraduationCap className="text-green-400 mr-3" size={28} />
                <h3 className="text-2xl font-bold text-white">Education</h3>
              </div>
              
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="border-l-4 border-green-400 pl-6">
                    <h4 className="text-lg font-bold text-white mb-1">{edu.degree}</h4>
                    <p className="text-green-300 font-medium mb-2">{edu.institution}</p>
                    <span className="text-space-400 text-sm mb-3 block">{edu.period}</span>
                    <p className="text-space-300 text-sm mb-3">{edu.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {edu.courses.map((course, courseIndex) => (
                        <span
                          key={courseIndex}
                          className="bg-space-700 text-green-300 text-xs px-2 py-1 rounded border border-space-600"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div ref={addToRefs} className="bg-space-800 rounded-2xl p-8 border border-space-700">
              <div className="flex items-center mb-6">
                <Award className="text-yellow-400 mr-3" size={28} />
                <h3 className="text-2xl font-bold text-white">Certifications</h3>
              </div>
              
              <div className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="bg-space-700 rounded-lg p-4 border border-space-600">
                    <h4 className="text-lg font-semibold text-white mb-1">{cert.name}</h4>
                    <p className="text-yellow-300 text-sm mb-1">{cert.issuer}</p>
                    <span className="text-space-400 text-xs">{cert.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;