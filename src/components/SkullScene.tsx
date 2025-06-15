import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface SkullPart {
  mesh: THREE.Mesh;
  originalPosition: THREE.Vector3;
  name: string;
  isExpanded: boolean;
  section: string;
  color: number;
}

const SkullScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const skullPartsRef = useRef<SkullPart[]>([]);
  const raycasterRef = useRef<THREE.Raycaster>();
  const mouseRef = useRef<THREE.Vector2>();
  const frameIdRef = useRef<number>();
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const anatomicalParts = [
    { name: 'Frontal Bone', color: 0x4ade80, position: [0, 2, 1.5], section: 'home' },
    { name: 'Parietal Bone (Left)', color: 0x3b82f6, position: [-1.5, 1.5, 0], section: 'projects' },
    { name: 'Parietal Bone (Right)', color: 0x3b82f6, position: [1.5, 1.5, 0], section: 'projects' },
    { name: 'Temporal Bone (Left)', color: 0xf59e0b, position: [-1.8, 0, 0], section: 'skills' },
    { name: 'Temporal Bone (Right)', color: 0xf59e0b, position: [1.8, 0, 0], section: 'skills' },
    { name: 'Occipital Bone', color: 0x8b5cf6, position: [0, 1, -2], section: 'resume' },
    { name: 'Mandible', color: 0xef4444, position: [0, -1.5, 0.5], section: 'contact' },
    { name: 'Maxilla', color: 0x06b6d4, position: [0, -0.5, 1.8], section: 'resume' },
  ];

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    raycasterRef.current = new THREE.Raycaster();
    mouseRef.current = new THREE.Vector2();

    // Renderer setup
    const container = mountRef.current;
    const { clientWidth, clientHeight } = container;
    
    renderer.setSize(clientWidth, clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    container.appendChild(renderer.domElement);

    // Camera setup
    camera.aspect = clientWidth / clientHeight;
    camera.position.set(0, 0, 8);
    camera.updateProjectionMatrix();

    // Enhanced Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);

    // Dynamic colored lights
    const pointLight1 = new THREE.PointLight(0x4ade80, 0.8, 50);
    pointLight1.position.set(-5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x3b82f6, 0.8, 50);
    pointLight2.position.set(5, -5, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xf59e0b, 0.6, 30);
    pointLight3.position.set(0, -5, -5);
    scene.add(pointLight3);

    // Rim light for dramatic effect
    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 0.5);
    rimLight.position.set(-10, 0, -10);
    scene.add(rimLight);

    // Create skull parts with enhanced materials
    const skullParts: SkullPart[] = [];

    anatomicalParts.forEach((part, index) => {
      let geometry: THREE.BufferGeometry;
      
      // Create more detailed geometries
      switch (part.name) {
        case 'Frontal Bone':
          geometry = new THREE.SphereGeometry(1.2, 32, 32, 0, Math.PI, 0, Math.PI * 0.6);
          break;
        case 'Parietal Bone (Left)':
        case 'Parietal Bone (Right)':
          geometry = new THREE.SphereGeometry(1, 24, 24, 0, Math.PI * 0.5, 0, Math.PI * 0.8);
          break;
        case 'Temporal Bone (Left)':
        case 'Temporal Bone (Right)':
          geometry = new THREE.BoxGeometry(0.8, 1.2, 1.5, 4, 4, 4);
          break;
        case 'Occipital Bone':
          geometry = new THREE.SphereGeometry(1.1, 32, 32, Math.PI, Math.PI, 0, Math.PI * 0.7);
          break;
        case 'Mandible':
          geometry = new THREE.BoxGeometry(2.5, 0.8, 1.2, 6, 3, 4);
          break;
        case 'Maxilla':
          geometry = new THREE.BoxGeometry(2, 0.6, 1, 5, 2, 3);
          break;
        default:
          geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);
      }

      // Enhanced material with more realistic properties
      const material = new THREE.MeshPhysicalMaterial({
        color: part.color,
        transparent: true,
        opacity: 0.85,
        roughness: 0.3,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        transmission: 0.1,
        thickness: 0.5,
        envMapIntensity: 1.5,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...part.position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { name: part.name, section: part.section };

      // Add subtle floating animation
      gsap.to(mesh.position, {
        y: mesh.position.y + 0.1,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      });

      // Add subtle rotation animation
      gsap.to(mesh.rotation, {
        x: mesh.rotation.x + 0.05,
        y: mesh.rotation.y + 0.03,
        duration: 4 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      });

      const skullPart: SkullPart = {
        mesh,
        originalPosition: mesh.position.clone(),
        name: part.name,
        isExpanded: false,
        section: part.section,
        color: part.color,
      };

      skullParts.push(skullPart);
      scene.add(mesh);
    });

    skullPartsRef.current = skullParts;

    // Enhanced particle system
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 2 + 1;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time + position.x * 0.01) * 0.3);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distance = length(gl_PointCoord - vec2(0.5));
          if (distance > 0.5) discard;
          
          float alpha = 1.0 - distance * 2.0;
          gl_FragColor = vec4(vColor, alpha * 0.6);
        }
      `,
      transparent: true,
      vertexColors: true,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      mouseRef.current!.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current!.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const navigateToSection = (section: string) => {
      setIsNavigating(true);
      
      // Enhanced camera animation
      gsap.to(cameraRef.current!.position, {
        z: 12,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          // Navigate to section
          const element = document.querySelector(`#${section}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
          
          // Return camera
          gsap.to(cameraRef.current!.position, {
            z: 8,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.3,
            onComplete: () => {
              setIsNavigating(false);
            }
          });
        }
      });

      // Add screen flash effect
      const flash = document.createElement('div');
      flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(45deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3));
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
      `;
      document.body.appendChild(flash);
      
      gsap.to(flash, {
        opacity: 1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          document.body.removeChild(flash);
        }
      });
    };

    const handleClick = (event: MouseEvent) => {
      if (!raycasterRef.current || !cameraRef.current || !mouseRef.current || isNavigating) return;

      handleMouseMove(event);
      
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      
      const meshes = skullPartsRef.current.map(part => part.mesh);
      const intersects = raycasterRef.current.intersectObjects(meshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const skullPart = skullPartsRef.current.find(part => part.mesh === clickedMesh);
        
        if (skullPart) {
          // Enhanced click animation
          gsap.to(clickedMesh.scale, {
            x: 1.3,
            y: 1.3,
            z: 1.3,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
          });

          // Pulse effect
          const material = clickedMesh.material as THREE.MeshPhysicalMaterial;
          gsap.to(material, {
            emissiveIntensity: 0.5,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
          });

          // Navigate after animation
          setTimeout(() => {
            navigateToSection(skullPart.section);
          }, 400);
        }
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1 && !isNavigating) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();
        
        mouseRef.current!.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current!.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        
        if (!raycasterRef.current || !cameraRef.current) return;
        
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        
        const meshes = skullPartsRef.current.map(part => part.mesh);
        const intersects = raycasterRef.current.intersectObjects(meshes);

        if (intersects.length > 0) {
          const clickedMesh = intersects[0].object as THREE.Mesh;
          const skullPart = skullPartsRef.current.find(part => part.mesh === clickedMesh);
          
          if (skullPart) {
            // Enhanced touch animation
            gsap.to(clickedMesh.scale, {
              x: 1.3,
              y: 1.3,
              z: 1.3,
              duration: 0.2,
              yoyo: true,
              repeat: 1,
              ease: 'power2.out',
            });

            const material = clickedMesh.material as THREE.MeshPhysicalMaterial;
            gsap.to(material, {
              emissiveIntensity: 0.5,
              duration: 0.3,
              yoyo: true,
              repeat: 1,
            });

            setTimeout(() => {
              navigateToSection(skullPart.section);
            }, 400);
          }
        }
      }
    };

    // Add event listeners
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);
    container.addEventListener('touchstart', handleTouchStart);

    // Enhanced animation loop
    let time = 0;
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      time += 0.01;
      
      // Update particle shader time
      if (particleMaterial.uniforms.time) {
        particleMaterial.uniforms.time.value = time;
      }

      // Rotate particles slowly
      particles.rotation.y += 0.002;
      particles.rotation.x += 0.001;
      
      // Rotate skull assembly slowly
      if (sceneRef.current && !isNavigating) {
        sceneRef.current.rotation.y += 0.003;
        sceneRef.current.rotation.x = Math.sin(time * 0.5) * 0.05;
      }

      // Dynamic lighting
      pointLight1.intensity = 0.8 + Math.sin(time * 2) * 0.2;
      pointLight2.intensity = 0.8 + Math.cos(time * 1.5) * 0.2;
      pointLight3.intensity = 0.6 + Math.sin(time * 3) * 0.1;

      // Enhanced hover effect
      if (raycasterRef.current && cameraRef.current && mouseRef.current && !isNavigating) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        
        const meshes = skullPartsRef.current.map(part => part.mesh);
        const intersects = raycasterRef.current.intersectObjects(meshes);

        // Reset all materials
        skullPartsRef.current.forEach(part => {
          const material = part.mesh.material as THREE.MeshPhysicalMaterial;
          material.opacity = 0.85;
          material.emissiveIntensity = 0;
          material.clearcoat = 0.8;
        });

        // Highlight hovered part
        if (intersects.length > 0) {
          const hoveredMesh = intersects[0].object as THREE.Mesh;
          const material = hoveredMesh.material as THREE.MeshPhysicalMaterial;
          const skullPart = skullPartsRef.current.find(part => part.mesh === hoveredMesh);
          
          if (skullPart) {
            material.opacity = 1;
            material.emissiveIntensity = 0.2;
            material.clearcoat = 1;
            container.style.cursor = 'pointer';
            setSelectedPart(`${skullPart.name} → ${skullPart.section.toUpperCase()}`);
          }
        } else {
          container.style.cursor = 'default';
          setSelectedPart(null);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      
      const { clientWidth, clientHeight } = container;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      container.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('resize', handleResize);
      
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      skullPartsRef.current.forEach(part => {
        part.mesh.geometry.dispose();
        (part.mesh.material as THREE.Material).dispose();
      });
      
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Enhanced navigation tooltip */}
      {selectedPart && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-space-800/95 to-space-700/95 backdrop-blur-md border border-blue-500/50 rounded-xl p-4 text-white shadow-2xl shadow-blue-500/20 transform transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <div>
              <h3 className="font-bold text-blue-400 text-lg">{selectedPart}</h3>
              <p className="text-sm text-space-300 mt-1">Click to navigate</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced navigation guide */}
      <div className="absolute bottom-4 right-4 bg-gradient-to-r from-space-800/95 to-space-700/95 backdrop-blur-md border border-space-600 rounded-xl p-4 text-white shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400">Green → Home</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-blue-400">Blue → Projects</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-yellow-400">Orange → Skills</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-purple-400">Purple → Resume</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-red-400">Red → Contact</span>
          </div>
        </div>
      </div>

      {/* Loading overlay for navigation */}
      {isNavigating && (
        <div className="absolute inset-0 bg-space-950/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-blue-400 font-semibold">Navigating...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkullScene;