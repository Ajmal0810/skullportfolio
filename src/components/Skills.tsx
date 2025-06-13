import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const skillsRef = useRef<HTMLDivElement[]>([]);

  const skillCategories = [
    {
      title: "3D Development",
      icon: "🎲",
      skills: [
        { name: "Three.js", level: 95, color: "from-green-400 to-blue-500" },
        { name: "WebGL", level: 88, color: "from-purple-400 to-pink-500" },
        { name: "GSAP", level: 92, color: "from-yellow-400 to-orange-500" },
        { name: "Blender", level: 78, color: "from-blue-400 to-purple-500" },
      ]
    },
    {
      title: "Frontend Development",
      icon: "💻",
      skills: [
        { name: "React.js", level: 96, color: "from-cyan-400 to-blue-500" },
        { name: "TypeScript", level: 90, color: "from-blue-400 to-indigo-500" },
        { name: "Next.js", level: 87, color: "from-gray-400 to-gray-600" },
        { name: "Tailwind CSS", level: 94, color: "from-teal-400 to-blue-500" },
      ]
    },
    {
      title: "Backend & Database",
      icon: "🔧",
      skills: [
        { name: "Node.js", level: 89, color: "from-green-400 to-green-600" },
        { name: "Python", level: 85, color: "from-yellow-400 to-yellow-600" },
        { name: "MongoDB", level: 82, color: "from-green-500 to-green-700" },
        { name: "PostgreSQL", level: 80, color: "from-blue-500 to-blue-700" },
      ]
    },
    {
      title: "Tools & Technologies",
      icon: "🚀",
      skills: [
        { name: "Git/GitHub", level: 93, color: "from-gray-400 to-gray-600" },
        { name: "Docker", level: 75, color: "from-blue-400 to-blue-600" },
        { name: "AWS", level: 73, color: "from-orange-400 to-orange-600" },
        { name: "Figma", level: 88, color: "from-purple-400 to-purple-600" },
      ]
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

    // Skills categories animation
    gsap.fromTo(skillsRef.current,
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

    // Skill bars animation
    skillCategories.forEach((category, categoryIndex) => {
      category.skills.forEach((skill, skillIndex) => {
        gsap.fromTo(`.skill-bar-${categoryIndex}-${skillIndex}`,
          { width: 0 },
          {
            width: `${skill.level}%`,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: `.skill-category-${categoryIndex}`,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !skillsRef.current.includes(el)) {
      skillsRef.current.push(el);
    }
  };

  return (
    <section id="skills" ref={sectionRef} className="py-20 bg-space-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Expertise</span>
          </h2>
          <p className="text-xl text-space-300 max-w-3xl mx-auto">
            A comprehensive overview of my technical skills and proficiency levels across various technologies and tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              ref={addToRefs}
              className={`skill-category-${categoryIndex} bg-space-800 rounded-2xl p-8 border border-space-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10`}
            >
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-4">{category.icon}</span>
                <h3 className="text-2xl font-bold text-white">{category.title}</h3>
              </div>
              
              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-space-200 font-medium">{skill.name}</span>
                      <span className="text-blue-400 font-semibold">{skill.level}%</span>
                    </div>
                    
                    <div className="w-full bg-space-700 rounded-full h-3 relative overflow-hidden">
                      <div
                        className={`skill-bar-${categoryIndex}-${skillIndex} h-full bg-gradient-to-r ${skill.color} rounded-full relative`}
                        style={{ width: 0 }}
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "50+", label: "Projects Completed", icon: "🎯" },
            { number: "3+", label: "Years Experience", icon: "⏱️" },
            { number: "15+", label: "Technologies Mastered", icon: "🛠️" },
            { number: "100%", label: "Client Satisfaction", icon: "⭐" }
          ].map((stat, index) => (
            <div
              key={index}
              ref={addToRefs}
              className="text-center p-6 bg-space-800/50 rounded-xl border border-space-700 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-blue-400 mb-1">{stat.number}</div>
              <div className="text-space-300 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;