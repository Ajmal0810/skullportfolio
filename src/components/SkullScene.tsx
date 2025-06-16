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
      color: 0x8a8a8a, 
      glowColor: 0xff4444,
      position: [0, 1.8, 1.2], 
      section: 'home',
      scale: [1.4, 1.2, 1.0]
    },
    { 
      name: 'Parietal Bone (Left)', 
      color: 0x7a7a7a, 
      glowColor: 0x4488ff,
      position: [-1.2, 1.4, -0.3], 
      section: 'projects',
      scale: [1.0, 1.3, 1.4]
    },
    { 
      name: 'Parietal Bone (Right)', 
      color: 0x7a7a7a, 
      glowColor: 0x4488ff,
      position: [1.2, 1.4, -0.3], 
      section: 'projects',
      scale: [1.0, 1.3, 1.4]
    },
    { 
      name: 'Temporal Bone (Left)', 
      color: 0x6a6a6a, 
      glowColor: 0xffaa44,
      position: [-1.6, 0.2, 0.2], 
      section: 'skills',
      scale: [0.8, 1.0, 1.2]
    },
    { 
      name: 'Temporal Bone (Right)', 
      color: 0x6a6a6a, 
      glowColor: 0xffaa44,
      position: [1.6, 0.2, 0.2], 
      section: 'skills',
      scale: [0.8, 1.0, 1.2]
    },
    { 
      name: 'Occipital Bone', 
      color: 0x5a5a5a, 
      glowColor: 0xaa44ff,
      position: [0, 0.8, -1.8], 
      section: 'resume',
      scale: [1.3, 1.1, 1.0]
    },
    { 
      name: 'Maxilla', 
      color: 0x9a9a9a, 
      glowColor: 0x44ffaa,
      position: [0, -0.3, 1.4], 
      section: 'resume',
      scale: [1.8, 0.6, 0.8]
    },
    { 
      name: 'Mandible', 
      color: 0x8a8a8a, 
      glowColor: 0xff6644,
      position: [0, -1.2, 0.8], 
      section: 'contact',
      scale: [2.0, 0.7, 1.0]
    },
    { 
      name: 'Eye Socket (Left)', 
      color: 0x2a2a2a, 
      glowColor: 0xff2222,
      position: [-0.6, 0.4, 1.0], 
      section: 'projects',
      scale: [0.8, 1.0, 0.6]
    },
    { 
      name: 'Eye Socket (Right)', 
      color: 0x2a2a2a, 
      glowColor: 0xff2222,
      position: [0.6, 0.4, 1.0], 
      section: 'skills',
      scale: [0.8, 1.0, 0.6]
    },
    { 
      name: 'Nasal Cavity', 
      color: 0x1a1a1a, 
      glowColor: 0xff8844,
      position: [0, -0.1, 1.2], 
      section: 'contact',
      scale: [0.4, 0.8, 0.3]
    }
  ];

  const navigateToSection = useCallback((section: string) => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    // Enhanced camera animation with dramatic zoom
    if (cameraRef.current) {
      gsap.to(cameraRef.current.position, {
        z: 15,
        duration: 0.6,
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
              z: 10,
              duration: 1.2,
              ease: 'elastic.out(1, 0.5)',
              delay: 0.4,
              onComplete: () => {
                setIsNavigating(false);
              }
            });
          }
        }
      });
    }

    // Enhanced screen flash effect with skull colors
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(circle, rgba(255, 68, 68, 0.4) 0%, rgba(255, 136, 68, 0.2) 50%, transparent 100%);
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
    `;
    document.body.appendChild(flash);
    
    gsap.to(flash, {
      opacity: 1,
      duration: 0.15,
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
          x: clickedMesh.scale.x * 1.4,
          y: clickedMesh.scale.y * 1.4,
          z: clickedMesh.scale.z * 1.4,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          ease: 'power3.out',
        });

        // Enhanced glow effect
        const material = clickedMesh.material as THREE.MeshPhysicalMaterial;
        const originalEmissive = material.emissive.getHex();
        material.emissive.setHex(skullPart.glowColor);
        
        gsap.to(material, {
          emissiveIntensity: 1.5,
          duration: 0.4,
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
            x: originalPosition.x + (Math.random() - 0.5) * 0.3,
            y: originalPosition.y + (Math.random() - 0.5) * 0.3,
            duration: 0.1,
            repeat: 5,
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
        }, 600);
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
      // Scene setup with dark theme
      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x000000, 5, 25);
      
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

      // Enhanced renderer setup for dramatic effects
      const container = mountRef.current;
      const { clientWidth, clientHeight } = container;
      
      renderer.setSize(clientWidth, clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 1);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.8;
      
      container.appendChild(renderer.domElement);

      // Camera setup
      camera.aspect = clientWidth / clientHeight;
      camera.position.set(0, 0, 10);
      camera.updateProjectionMatrix();

      // Dramatic lighting setup
      const ambientLight = new THREE.AmbientLight(0x111111, 0.2);
      scene.add(ambientLight);

      // Main dramatic light
      const mainLight = new THREE.DirectionalLight(0x444444, 1.5);
      mainLight.position.set(5, 10, 5);
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = 4096;
      mainLight.shadow.mapSize.height = 4096;
      mainLight.shadow.camera.near = 0.1;
      mainLight.shadow.camera.far = 50;
      mainLight.shadow.camera.left = -15;
      mainLight.shadow.camera.right = 15;
      mainLight.shadow.camera.top = 15;
      mainLight.shadow.camera.bottom = -15;
      scene.add(mainLight);

      // Colored accent lights for glow effects
      const redLight = new THREE.PointLight(0xff2222, 2, 20);
      redLight.position.set(-3, 2, 8);
      scene.add(redLight);

      const orangeLight = new THREE.PointLight(0xff6644, 1.5, 15);
      orangeLight.position.set(3, -2, 6);
      scene.add(orangeLight);

      const blueLight = new THREE.PointLight(0x4488ff, 1, 12);
      blueLight.position.set(0, 5, -5);
      scene.add(blueLight);

      // Rim lighting for dramatic silhouette
      const rimLight1 = new THREE.DirectionalLight(0x222222, 0.8);
      rimLight1.position.set(-10, 0, -10);
      scene.add(rimLight1);

      const rimLight2 = new THREE.DirectionalLight(0x333333, 0.6);
      rimLight2.position.set(10, -5, -8);
      scene.add(rimLight2);

      // Create realistic skull parts
      const skullParts: SkullPart[] = [];

      anatomicalParts.forEach((part, index) => {
        let geometry: THREE.BufferGeometry;
        
        // Create more realistic skull geometries
        switch (part.name) {
          case 'Frontal Bone':
            geometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI, 0, Math.PI * 0.7);
            break;
          case 'Parietal Bone (Left)':
          case 'Parietal Bone (Right)':
            geometry = new THREE.SphereGeometry(0.9, 24, 24, 0, Math.PI * 0.6, 0, Math.PI * 0.8);
            break;
          case 'Temporal Bone (Left)':
          case 'Temporal Bone (Right)':
            geometry = new THREE.CylinderGeometry(0.6, 0.8, 1.2, 16, 4);
            break;
          case 'Occipital Bone':
            geometry = new THREE.SphereGeometry(1, 32, 32, Math.PI * 0.3, Math.PI * 0.7, 0, Math.PI * 0.8);
            break;
          case 'Mandible':
            geometry = new THREE.BoxGeometry(1, 1, 1, 8, 4, 6);
            // Add curve to mandible
            const positions = geometry.attributes.position.array as Float32Array;
            for (let i = 0; i < positions.length; i += 3) {
              const x = positions[i];
              const y = positions[i + 1];
              if (y < 0) {
                positions[i + 2] += Math.abs(x) * 0.3; // Curve the jaw
              }
            }
            geometry.attributes.position.needsUpdate = true;
            break;
          case 'Maxilla':
            geometry = new THREE.BoxGeometry(1, 1, 1, 6, 3, 4);
            break;
          case 'Eye Socket (Left)':
          case 'Eye Socket (Right)':
            geometry = new THREE.SphereGeometry(0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.6);
            break;
          case 'Nasal Cavity':
            geometry = new THREE.ConeGeometry(0.3, 0.8, 8, 4);
            break;
          default:
            geometry = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);
        }

        // Realistic bone material with weathered look
        const material = new THREE.MeshPhysicalMaterial({
          color: part.color,
          transparent: false,
          opacity: 1,
          roughness: 0.8,
          metalness: 0.1,
          clearcoat: 0.2,
          clearcoatRoughness: 0.8,
          transmission: 0,
          thickness: 0,
          envMapIntensity: 0.3,
        });

        // Add subtle texture variation
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;
        
        // Create bone texture
        ctx.fillStyle = '#666666';
        ctx.fillRect(0, 0, 256, 256);
        
        // Add noise and cracks
        for (let i = 0; i < 1000; i++) {
          ctx.fillStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.3)`;
          ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
        }
        
        // Add crack lines
        ctx.strokeStyle = 'rgba(40, 40, 40, 0.8)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random() * 256, Math.random() * 256);
          ctx.lineTo(Math.random() * 256, Math.random() * 256);
          ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        material.map = texture;

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...part.position as [number, number, number]);
        mesh.scale.set(...part.scale as [number, number, number]);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.userData = { name: part.name, section: part.section };

        // Enhanced floating animation with more realistic movement
        gsap.to(mesh.position, {
          y: mesh.position.y + (Math.random() * 0.15 + 0.05),
          duration: 3 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 3,
        });

        // Subtle breathing-like rotation
        gsap.to(mesh.rotation, {
          x: mesh.rotation.x + (Math.random() * 0.1 - 0.05),
          y: mesh.rotation.y + (Math.random() * 0.1 - 0.05),
          z: mesh.rotation.z + (Math.random() * 0.05 - 0.025),
          duration: 6 + Math.random() * 4,
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

      // Enhanced dark particle system
      const particleGeometry = new THREE.BufferGeometry();
      const particleCount = 200;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

        // Dark, ember-like colors
        const colorChoice = Math.random();
        const color = new THREE.Color();
        if (colorChoice < 0.3) {
          color.setHSL(0.05, 0.8, 0.3); // Orange ember
        } else if (colorChoice < 0.6) {
          color.setHSL(0, 0.9, 0.4); // Red ember
        } else {
          color.setHSL(0.15, 0.7, 0.2); // Dark orange
        }
        
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 3 + 1;
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
            float pulseFactor = 1.0 + sin(time * 2.0 + position.x * 0.02) * 0.5;
            gl_PointSize = size * (400.0 / -mvPosition.z) * pulseFactor;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            float distance = length(gl_PointCoord - vec2(0.5));
            if (distance > 0.5) discard;
            
            float alpha = 1.0 - distance * 2.0;
            float glow = pow(alpha, 2.0);
            gl_FragColor = vec4(vColor * (1.0 + glow), alpha * 0.8);
          }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

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
        
        // Update particle shader time
        if (particleMaterial.uniforms.time) {
          particleMaterial.uniforms.time.value = time;
        }

        // Slow particle drift
        particles.rotation.y += 0.001;
        particles.rotation.x += 0.0005;
        
        // Subtle skull assembly rotation
        if (scene && !isNavigating) {
          scene.rotation.y += 0.002;
          scene.rotation.x = Math.sin(time * 0.3) * 0.03;
        }

        // Dynamic lighting effects
        redLight.intensity = 2 + Math.sin(time * 3) * 0.5;
        orangeLight.intensity = 1.5 + Math.cos(time * 2.5) * 0.3;
        blueLight.intensity = 1 + Math.sin(time * 4) * 0.2;

        // Move lights for dramatic shadows
        redLight.position.x = -3 + Math.sin(time * 0.8) * 2;
        orangeLight.position.z = 6 + Math.cos(time * 0.6) * 3;

        // Enhanced hover effect with glow
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

          // Dramatic highlight for hovered part
          if (intersects.length > 0) {
            const hoveredMesh = intersects[0].object as THREE.Mesh;
            const material = hoveredMesh.material as THREE.MeshPhysicalMaterial;
            const skullPart = skullPartsRef.current.find(part => part.mesh === hoveredMesh);
            
            if (skullPart) {
              material.emissive.setHex(skullPart.glowColor);
              material.emissiveIntensity = 0.3 + Math.sin(time * 8) * 0.1;
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
            if (material.map) material.map.dispose();
            material.dispose();
          }
        });
        
        if (particleGeometry) particleGeometry.dispose();
        if (particleMaterial) particleMaterial.dispose();
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
      
      {/* Enhanced navigation tooltip with skull theme */}
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

      {/* Enhanced navigation guide with skull theme */}
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

      {/* Loading overlay for navigation with skull theme */}
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