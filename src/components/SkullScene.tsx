import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface SkullPart {
  mesh: THREE.Mesh;
  originalPosition: THREE.Vector3;
  name: string;
  isExpanded: boolean;
  section: string;
  color: number;
  glowColor: number;
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
  const isInitializedRef = useRef(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const anatomicalParts = [
    { 
      name: 'Frontal Bone', 
      color: 0xf5f5f5, 
      glowColor: 0xff4444,
      position: [0, 2.2, 1.5], 
      section: 'home',
      scale: [1.8, 1.5, 1.2]
    },
    { 
      name: 'Parietal Bone (Left)', 
      color: 0xf0f0f0, 
      glowColor: 0x4488ff,
      position: [-1.5, 1.8, -0.4], 
      section: 'projects',
      scale: [1.3, 1.6, 1.8]
    },
    { 
      name: 'Parietal Bone (Right)', 
      color: 0xf0f0f0, 
      glowColor: 0x4488ff,
      position: [1.5, 1.8, -0.4], 
      section: 'projects',
      scale: [1.3, 1.6, 1.8]
    },
    { 
      name: 'Temporal Bone (Left)', 
      color: 0xeeeeee, 
      glowColor: 0xffaa44,
      position: [-2.0, 0.3, 0.3], 
      section: 'skills',
      scale: [1.0, 1.3, 1.5]
    },
    { 
      name: 'Temporal Bone (Right)', 
      color: 0xeeeeee, 
      glowColor: 0xffaa44,
      position: [2.0, 0.3, 0.3], 
      section: 'skills',
      scale: [1.0, 1.3, 1.5]
    },
    { 
      name: 'Occipital Bone', 
      color: 0xebebeb, 
      glowColor: 0xaa44ff,
      position: [0, 1.0, -2.2], 
      section: 'resume',
      scale: [1.6, 1.4, 1.2]
    },
    { 
      name: 'Maxilla', 
      color: 0xf8f8f8, 
      glowColor: 0x44ffaa,
      position: [0, -0.4, 1.8], 
      section: 'resume',
      scale: [2.2, 0.8, 1.0]
    },
    { 
      name: 'Mandible', 
      color: 0xf5f5f5, 
      glowColor: 0xff6644,
      position: [0, -1.5, 1.0], 
      section: 'contact',
      scale: [2.5, 0.9, 1.3]
    },
    { 
      name: 'Eye Socket (Left)', 
      color: 0x1a1a1a, 
      glowColor: 0xff2222,
      position: [-0.8, 0.5, 1.3], 
      section: 'projects',
      scale: [1.0, 1.3, 0.8]
    },
    { 
      name: 'Eye Socket (Right)', 
      color: 0x1a1a1a, 
      glowColor: 0xff2222,
      position: [0.8, 0.5, 1.3], 
      section: 'skills',
      scale: [1.0, 1.3, 0.8]
    },
    { 
      name: 'Nasal Cavity', 
      color: 0x0a0a0a, 
      glowColor: 0xff8844,
      position: [0, -0.1, 1.5], 
      section: 'contact',
      scale: [0.5, 1.0, 0.4]
    }
  ];

  const navigateToSection = useCallback((section: string) => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    // Enhanced camera animation with dramatic zoom
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        z: 18,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          // Navigate to section
          const element = document.querySelector(`#${section}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
          
          // Return camera with bounce effect
          if (cameraRef.current) {
            gsap.to(cameraRef.current.position, {
              z: 12,
              duration: 1.5,
              ease: 'elastic.out(1, 0.5)',
              delay: 0.5,
              onComplete: () => {
                setIsNavigating(false);
              }
            });
          }
        }
      });
    }

    // Enhanced screen flash effect
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(circle, rgba(255, 68, 68, 0.6) 0%, rgba(255, 136, 68, 0.3) 50%, transparent 100%);
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
    `;
    document.body.appendChild(flash);
    
    gsap.to(flash, {
      opacity: 1,
      duration: 0.2,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        if (document.body.contains(flash)) {
          document.body.removeChild(flash);
        }
      }
    });
  }, [isNavigating]);

  const handleInteraction = useCallback((event: MouseEvent | Touch, isTouch = false) => {
    if (!mountRef.current || !raycasterRef.current || !cameraRef.current || !mouseRef.current || isNavigating) return;

    const container = mountRef.current;
    const rect = container.getBoundingClientRect();
    
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
    
    const meshes = skullPartsRef.current.map(part => part.mesh);
    const intersects = raycasterRef.current.intersectObjects(meshes);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object as THREE.Mesh;
      const skullPart = skullPartsRef.current.find(part => part.mesh === clickedMesh);
      
      if (skullPart) {
        // Dramatic click animation with glow pulse
        gsap.to(clickedMesh.scale, {
          x: clickedMesh.scale.x * 1.6,
          y: clickedMesh.scale.y * 1.6,
          z: clickedMesh.scale.z * 1.6,
          duration: 0.4,
          yoyo: true,
          repeat: 1,
          ease: 'power3.out',
        });

        // Enhanced glow effect
        const material = clickedMesh.material as THREE.MeshPhysicalMaterial;
        const originalEmissive = material.emissive.getHex();
        material.emissive.setHex(skullPart.glowColor);
        
        gsap.to(material, {
          emissiveIntensity: 2.0,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            material.emissive.setHex(originalEmissive);
            material.emissiveIntensity = 0;
          }
        });

        // Screen shake effect
        if (cameraRef.current) {
          const originalPosition = cameraRef.current.position.clone();
          gsap.to(cameraRef.current.position, {
            x: originalPosition.x + (Math.random() - 0.5) * 0.4,
            y: originalPosition.y + (Math.random() - 0.5) * 0.4,
            duration: 0.1,
            repeat: 7,
            yoyo: true,
            onComplete: () => {
              if (cameraRef.current) {
                cameraRef.current.position.copy(originalPosition);
              }
            }
          });
        }

        // Navigate after dramatic effects
        setTimeout(() => {
          navigateToSection(skullPart.section);
        }, 800);
      }
    }
  }, [isNavigating, navigateToSection]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!mountRef.current || !mouseRef.current) return;
    
    const container = mountRef.current;
    const rect = container.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }, []);

  const handleClick = useCallback((event: MouseEvent) => {
    handleInteraction(event, false);
  }, [handleInteraction]);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (event.touches.length === 1) {
      event.preventDefault();
      handleInteraction(event.touches[0], true);
    }
  }, [handleInteraction]);

  useEffect(() => {
    if (!mountRef.current || isInitializedRef.current) return;

    try {
      // Scene setup with pure black background
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);
      
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: false,
        powerPreference: 'high-performance'
      });

      sceneRef.current = scene;
      cameraRef.current = camera;
      rendererRef.current = renderer;
      raycasterRef.current = new THREE.Raycaster();
      mouseRef.current = new THREE.Vector2();

      // Enhanced renderer setup for clear visibility
      const container = mountRef.current;
      const { clientWidth, clientHeight } = container;
      
      renderer.setSize(clientWidth, clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 1);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      
      container.appendChild(renderer.domElement);

      // Camera setup for better skull visibility
      camera.aspect = clientWidth / clientHeight;
      camera.position.set(0, 0, 12);
      camera.updateProjectionMatrix();

      // Enhanced lighting for clear white skull visibility
      const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      // Main bright light for skull visibility
      const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
      mainLight.position.set(5, 10, 8);
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = 4096;
      mainLight.shadow.mapSize.height = 4096;
      mainLight.shadow.camera.near = 0.1;
      mainLight.shadow.camera.far = 50;
      mainLight.shadow.camera.left = -20;
      mainLight.shadow.camera.right = 20;
      mainLight.shadow.camera.top = 20;
      mainLight.shadow.camera.bottom = -20;
      scene.add(mainLight);

      // Additional fill lights for even illumination
      const fillLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
      fillLight1.position.set(-5, 5, 5);
      scene.add(fillLight1);

      const fillLight2 = new THREE.DirectionalLight(0xffffff, 0.8);
      fillLight2.position.set(0, -5, 8);
      scene.add(fillLight2);

      // Colored accent lights for glow effects (dimmer)
      const redLight = new THREE.PointLight(0xff2222, 1.5, 25);
      redLight.position.set(-4, 3, 10);
      scene.add(redLight);

      const orangeLight = new THREE.PointLight(0xff6644, 1.2, 20);
      orangeLight.position.set(4, -3, 8);
      scene.add(orangeLight);

      const blueLight = new THREE.PointLight(0x4488ff, 1.0, 18);
      blueLight.position.set(0, 6, -8);
      scene.add(blueLight);

      // Create realistic white skull parts
      const skullParts: SkullPart[] = [];

      anatomicalParts.forEach((part, index) => {
        let geometry: THREE.BufferGeometry;
        
        // Create more realistic skull geometries
        switch (part.name) {
          case 'Frontal Bone':
            geometry = new THREE.SphereGeometry(1.2, 32, 32, 0, Math.PI, 0, Math.PI * 0.7);
            break;
          case 'Parietal Bone (Left)':
          case 'Parietal Bone (Right)':
            geometry = new THREE.SphereGeometry(1.1, 24, 24, 0, Math.PI * 0.6, 0, Math.PI * 0.8);
            break;
          case 'Temporal Bone (Left)':
          case 'Temporal Bone (Right)':
            geometry = new THREE.CylinderGeometry(0.8, 1.0, 1.5, 16, 4);
            break;
          case 'Occipital Bone':
            geometry = new THREE.SphereGeometry(1.2, 32, 32, Math.PI * 0.3, Math.PI * 0.7, 0, Math.PI * 0.8);
            break;
          case 'Mandible':
            geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2, 8, 4, 6);
            // Add curve to mandible
            const positions = geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
              const x = positions[i];
              const y = positions[i + 1];
              if (y < 0) {
                positions[i + 2] += Math.abs(x) * 0.4; // Curve the jaw
              }
            }
            geometry.attributes.position.needsUpdate = true;
            break;
          case 'Maxilla':
            geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2, 6, 3, 4);
            break;
          case 'Eye Socket (Left)':
          case 'Eye Socket (Right)':
            geometry = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6);
            break;
          case 'Nasal Cavity':
            geometry = new THREE.ConeGeometry(0.4, 1.0, 8, 4);
            break;
          default:
            geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2, 4, 4, 4);
        }

        // Clean white bone material for maximum visibility
        const material = new THREE.MeshPhysicalMaterial({
          color: part.color,
          transparent: false,
          opacity: 1,
          roughness: 0.3,
          metalness: 0.0,
          clearcoat: 0.5,
          clearcoatRoughness: 0.2,
          transmission: 0,
          thickness: 0,
          envMapIntensity: 0.5,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...part.position as [number, number, number]);
        mesh.scale.set(...part.scale as [number, number, number]);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { name: part.name, section: part.section };

        // Enhanced floating animation with more pronounced movement
        gsap.to(mesh.position, {
          y: mesh.position.y + (Math.random() * 0.3 + 0.1),
          duration: 4 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 2,
        });

        // More visible breathing-like rotation
        gsap.to(mesh.rotation, {
          x: mesh.rotation.x + (Math.random() * 0.2 - 0.1),
          y: mesh.rotation.y + (Math.random() * 0.2 - 0.1),
          z: mesh.rotation.z + (Math.random() * 0.1 - 0.05),
          duration: 8 + Math.random() * 4,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 3,
        });

        const skullPart: SkullPart = {
          mesh,
          originalPosition: mesh.position.clone(),
          name: part.name,
          isExpanded: false,
          section: part.section,
          color: part.color,
          glowColor: part.glowColor,
        };

        skullParts.push(skullPart);
        scene.add(mesh);
      });

      skullPartsRef.current = skullParts;

      // Add event listeners
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('click', handleClick);
      container.addEventListener('touchstart', handleTouchStart, { passive: false });

      // Enhanced animation loop
      let time = 0;
      const animate = () => {
        if (!isInitializedRef.current) return;
        
        frameIdRef.current = requestAnimationFrame(animate);
        time += 0.01;
        
        // Subtle skull assembly rotation for better visibility
        if (scene && !isNavigating) {
          scene.rotation.y += 0.003;
          scene.rotation.x = Math.sin(time * 0.4) * 0.05;
        }

        // Dynamic lighting effects for dramatic shadows
        redLight.intensity = 1.5 + Math.sin(time * 2) * 0.3;
        orangeLight.intensity = 1.2 + Math.cos(time * 1.8) * 0.2;
        blueLight.intensity = 1.0 + Math.sin(time * 2.5) * 0.2;

        // Move lights for dynamic shadows
        redLight.position.x = -4 + Math.sin(time * 0.6) * 2;
        orangeLight.position.z = 8 + Math.cos(time * 0.4) * 2;

        // Enhanced hover effect with strong glow
        if (raycasterRef.current && camera && mouseRef.current && !isNavigating) {
          raycasterRef.current.setFromCamera(mouseRef.current, camera);
          
          const meshes = skullPartsRef.current.map(part => part.mesh);
          const intersects = raycasterRef.current.intersectObjects(meshes);

          // Reset all materials
          skullPartsRef.current.forEach(part => {
            const material = part.mesh.material as THREE.MeshPhysicalMaterial;
            material.emissiveIntensity = 0;
            material.emissive.setHex(0x000000);
          });

          // Strong highlight for hovered part
          if (intersects.length > 0) {
            const hoveredMesh = intersects[0].object as THREE.Mesh;
            const material = hoveredMesh.material as THREE.MeshPhysicalMaterial;
            const skullPart = skullPartsRef.current.find(part => part.mesh === hoveredMesh);
            
            if (skullPart) {
              material.emissive.setHex(skullPart.glowColor);
              material.emissiveIntensity = 0.8 + Math.sin(time * 10) * 0.2;
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

      // Handle resize
      const handleResize = () => {
        if (!container || !camera || !renderer) return;
        
        const { clientWidth, clientHeight } = container;
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(clientWidth, clientHeight);
      };

      window.addEventListener('resize', handleResize);
      isInitializedRef.current = true;
      animate();

      // Cleanup function
      return () => {
        isInitializedRef.current = false;
        
        if (frameIdRef.current) {
          cancelAnimationFrame(frameIdRef.current);
        }
        
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('click', handleClick);
        container.removeEventListener('touchstart', handleTouchStart);
        window.removeEventListener('resize', handleResize);
        
        if (container && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        
        // Dispose of Three.js resources
        skullPartsRef.current.forEach(part => {
          if (part.mesh.geometry) part.mesh.geometry.dispose();
          if (part.mesh.material) {
            const material = part.mesh.material as THREE.Material;
            material.dispose();
          }
        });
        
        if (renderer) renderer.dispose();
        
        // Clear refs
        skullPartsRef.current = [];
        sceneRef.current = undefined;
        rendererRef.current = undefined;
        cameraRef.current = undefined;
        raycasterRef.current = undefined;
        mouseRef.current = undefined;
      };
    } catch (err) {
      console.error('Error initializing 3D scene:', err);
      setError('Failed to initialize 3D scene. Please refresh the page.');
    }
  }, [handleMouseMove, handleClick, handleTouchStart, isNavigating]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black rounded-2xl border border-red-900">
        <div className="text-center p-8">
          <div className="text-red-400 text-4xl mb-4">💀</div>
          <h3 className="text-white text-xl font-bold mb-2">Skull Scene Error</h3>
          <p className="text-red-300 text-sm mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              window.location.reload();
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Resurrect Scene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Enhanced navigation tooltip */}
      {selectedPart && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-black/95 to-red-900/95 backdrop-blur-md border border-red-500/50 rounded-xl p-4 text-white shadow-2xl shadow-red-500/20 transform transition-all duration-300">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse shadow-lg shadow-red-400/50"></div>
            <div>
              <h3 className="font-bold text-red-400 text-lg drop-shadow-lg">{selectedPart}</h3>
              <p className="text-sm text-red-200 mt-1 drop-shadow">Click to navigate</p>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced navigation guide */}
      <div className="absolute bottom-4 right-4 bg-gradient-to-r from-black/95 to-gray-900/95 backdrop-blur-md border border-gray-600 rounded-xl p-4 text-white shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-sm shadow-red-400/50"></div>
            <span className="text-xs text-red-400">Red → Home/Contact</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-sm shadow-blue-400/50"></div>
            <span className="text-xs text-blue-400">Blue → Projects</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse shadow-sm shadow-orange-400/50"></div>
            <span className="text-xs text-orange-400">Orange → Skills</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-sm shadow-purple-400/50"></div>
            <span className="text-xs text-purple-400">Purple → Resume</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
            <span className="text-xs text-green-400">Green → Resume</span>
          </div>
        </div>
      </div>

      {/* Loading overlay for navigation */}
      {isNavigating && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4 shadow-lg shadow-red-500/30"></div>
            <p className="text-red-400 font-semibold drop-shadow-lg">Entering the Void...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkullScene;