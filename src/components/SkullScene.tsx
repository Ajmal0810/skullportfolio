import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface SkullPart {
  mesh: THREE.Mesh;
  originalPosition: THREE.Vector3;
  name: string;
  isExpanded: boolean;
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

  const anatomicalParts = [
    { name: 'Frontal Bone', color: 0x4ade80, position: [0, 2, 1.5] },
    { name: 'Parietal Bone (Left)', color: 0x3b82f6, position: [-1.5, 1.5, 0] },
    { name: 'Parietal Bone (Right)', color: 0x3b82f6, position: [1.5, 1.5, 0] },
    { name: 'Temporal Bone (Left)', color: 0x8b5cf6, position: [-1.8, 0, 0] },
    { name: 'Temporal Bone (Right)', color: 0x8b5cf6, position: [1.8, 0, 0] },
    { name: 'Occipital Bone', color: 0xf59e0b, position: [0, 1, -2] },
    { name: 'Mandible', color: 0xef4444, position: [0, -1.5, 0.5] },
    { name: 'Maxilla', color: 0x06b6d4, position: [0, -0.5, 1.8] },
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
    
    container.appendChild(renderer.domElement);

    // Camera setup
    camera.aspect = clientWidth / clientHeight;
    camera.position.set(0, 0, 8);
    camera.updateProjectionMatrix();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x3b82f6, 0.5, 50);
    pointLight1.position.set(-5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.5, 50);
    pointLight2.position.set(5, -5, 5);
    scene.add(pointLight2);

    // Create skull parts
    const skullParts: SkullPart[] = [];

    anatomicalParts.forEach((part, index) => {
      let geometry: THREE.BufferGeometry;
      
      // Create different geometries for different skull parts
      switch (part.name) {
        case 'Frontal Bone':
          geometry = new THREE.SphereGeometry(1.2, 16, 16, 0, Math.PI, 0, Math.PI * 0.6);
          break;
        case 'Parietal Bone (Left)':
        case 'Parietal Bone (Right)':
          geometry = new THREE.SphereGeometry(1, 12, 12, 0, Math.PI * 0.5, 0, Math.PI * 0.8);
          break;
        case 'Temporal Bone (Left)':
        case 'Temporal Bone (Right)':
          geometry = new THREE.BoxGeometry(0.8, 1.2, 1.5);
          break;
        case 'Occipital Bone':
          geometry = new THREE.SphereGeometry(1.1, 16, 16, Math.PI, Math.PI, 0, Math.PI * 0.7);
          break;
        case 'Mandible':
          geometry = new THREE.BoxGeometry(2.5, 0.8, 1.2);
          break;
        case 'Maxilla':
          geometry = new THREE.BoxGeometry(2, 0.6, 1);
          break;
        default:
          geometry = new THREE.BoxGeometry(1, 1, 1);
      }

      const material = new THREE.MeshPhongMaterial({
        color: part.color,
        transparent: true,
        opacity: 0.8,
        shininess: 100,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...part.position);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = { name: part.name };

      const skullPart: SkullPart = {
        mesh,
        originalPosition: mesh.position.clone(),
        name: part.name,
        isExpanded: false,
      };

      skullParts.push(skullPart);
      scene.add(mesh);
    });

    skullPartsRef.current = skullParts;

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      mouseRef.current!.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current!.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleClick = (event: MouseEvent) => {
      if (!raycasterRef.current || !cameraRef.current || !mouseRef.current) return;

      handleMouseMove(event);
      
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      
      const meshes = skullPartsRef.current.map(part => part.mesh);
      const intersects = raycasterRef.current.intersectObjects(meshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const skullPart = skullPartsRef.current.find(part => part.mesh === clickedMesh);
        
        if (skullPart) {
          toggleSkullPart(skullPart);
        }
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();
        
        mouseRef.current!.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        mouseRef.current!.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Trigger click logic for touch
        if (!raycasterRef.current || !cameraRef.current) return;
        
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        
        const meshes = skullPartsRef.current.map(part => part.mesh);
        const intersects = raycasterRef.current.intersectObjects(meshes);

        if (intersects.length > 0) {
          const clickedMesh = intersects[0].object as THREE.Mesh;
          const skullPart = skullPartsRef.current.find(part => part.mesh === clickedMesh);
          
          if (skullPart) {
            toggleSkullPart(skullPart);
          }
        }
      }
    };

    // Add event listeners
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);
    container.addEventListener('touchstart', handleTouchStart);

    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      // Rotate skull slowly
      if (sceneRef.current) {
        sceneRef.current.rotation.y += 0.005;
      }

      // Hover effect
      if (raycasterRef.current && cameraRef.current && mouseRef.current) {
        raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
        
        const meshes = skullPartsRef.current.map(part => part.mesh);
        const intersects = raycasterRef.current.intersectObjects(meshes);

        // Reset all materials
        skullPartsRef.current.forEach(part => {
          const material = part.mesh.material as THREE.MeshPhongMaterial;
          if (!part.isExpanded) {
            material.opacity = 0.8;
            material.emissive.setHex(0x000000);
          }
        });

        // Highlight hovered part
        if (intersects.length > 0) {
          const hoveredMesh = intersects[0].object as THREE.Mesh;
          const material = hoveredMesh.material as THREE.MeshPhongMaterial;
          const skullPart = skullPartsRef.current.find(part => part.mesh === hoveredMesh);
          
          if (skullPart && !skullPart.isExpanded) {
            material.opacity = 1;
            material.emissive.setHex(0x222222);
            container.style.cursor = 'pointer';
          }
        } else {
          container.style.cursor = 'default';
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
      
      renderer.dispose();
    };
  }, []);

  const toggleSkullPart = (skullPart: SkullPart) => {
    const { mesh, originalPosition, name, isExpanded } = skullPart;
    
    if (isExpanded) {
      // Return to original position
      gsap.to(mesh.position, {
        x: originalPosition.x,
        y: originalPosition.y,
        z: originalPosition.z,
        duration: 0.8,
        ease: 'power2.inOut',
      });
      
      gsap.to(mesh.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      });

      const material = mesh.material as THREE.MeshPhongMaterial;
      gsap.to(material, {
        opacity: 0.8,
        duration: 0.4,
      });
      
      skullPart.isExpanded = false;
      setSelectedPart(null);
    } else {
      // Move outward from center
      const direction = originalPosition.clone().normalize();
      const targetPosition = originalPosition.clone().add(direction.multiplyScalar(2));
      
      gsap.to(mesh.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 0.8,
        ease: 'power2.inOut',
      });
      
      gsap.to(mesh.rotation, {
        x: Math.random() * 0.5 - 0.25,
        y: Math.random() * 0.5 - 0.25,
        z: Math.random() * 0.5 - 0.25,
        duration: 0.8,
        ease: 'power2.inOut',
      });

      const material = mesh.material as THREE.MeshPhongMaterial;
      gsap.to(material, {
        opacity: 1,
        duration: 0.4,
      });
      
      skullPart.isExpanded = true;
      setSelectedPart(name);
      
      // Return other expanded parts
      skullPartsRef.current.forEach(otherPart => {
        if (otherPart !== skullPart && otherPart.isExpanded) {
          toggleSkullPart(otherPart);
        }
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Bone label tooltip */}
      {selectedPart && (
        <div className="absolute top-4 left-4 bg-space-800/90 backdrop-blur-sm border border-space-600 rounded-lg p-3 text-white">
          <h3 className="font-semibold text-blue-400">{selectedPart}</h3>
          <p className="text-sm text-space-300 mt-1">Click again to return to position</p>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 bg-space-800/90 backdrop-blur-sm border border-space-600 rounded-lg p-3 text-white">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-space-300">Interactive Anatomy</span>
        </div>
      </div>
    </div>
  );
};

export default SkullScene;