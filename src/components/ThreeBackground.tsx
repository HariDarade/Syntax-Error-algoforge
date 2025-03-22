import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio); // Improve rendering quality
    mountRef.current.appendChild(renderer.domElement);

    // Create DNA helix
    const helixGroup = new THREE.Group();
    const radius = 4; // Helix width
    const height = 20;
    const segments = 200;
    const particleCount = 100;

    // Create two helical paths for the DNA strands
    const helixGeometry1 = new THREE.BufferGeometry();
    const helixGeometry2 = new THREE.BufferGeometry();
    const positions1: number[] = [];
    const positions2: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 4;
      const y = (i / segments) * height - height / 2;
      const x1 = radius * Math.cos(t);
      const z1 = radius * Math.sin(t);
      const x2 = radius * Math.cos(t + Math.PI);
      const z2 = radius * Math.sin(t + Math.PI);
      positions1.push(x1, y, z1);
      positions2.push(x2, y, z2);
    }

    helixGeometry1.setAttribute('position', new THREE.Float32BufferAttribute(positions1, 3));
    helixGeometry2.setAttribute('position', new THREE.Float32BufferAttribute(positions2, 3));

    const helixMaterial = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.8,
    });

    const helix1 = new THREE.Line(helixGeometry1, helixMaterial);
    const helix2 = new THREE.Line(helixGeometry2, helixMaterial);
    helixGroup.add(helix1, helix2);

    // Add connecting lines between the helices (DNA rungs)
    const rungGeometry = new THREE.BufferGeometry();
    const rungPositions: number[] = [];
    for (let i = 0; i <= segments; i += 5) {
      const t = (i / segments) * Math.PI * 4;
      const y = (i / segments) * height - height / 2;
      const x1 = radius * Math.cos(t);
      const z1 = radius * Math.sin(t);
      const x2 = radius * Math.cos(t + Math.PI);
      const z2 = radius * Math.sin(t + Math.PI);
      rungPositions.push(x1, y, z1, x2, y, z2);
    }

    rungGeometry.setAttribute('position', new THREE.Float32BufferAttribute(rungPositions, 3));
    const rungMaterial = new THREE.LineBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.5,
    });
    const rungs = new THREE.LineSegments(rungGeometry, rungMaterial);
    helixGroup.add(rungs);

    // Add glowing particles along the helix
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions: number[] = [];
    const particleColors: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const t = Math.random() * Math.PI * 4;
      const y = Math.random() * height - height / 2;
      const side = Math.random() > 0.5 ? 1 : -1;
      const x = (radius + 0.2) * Math.cos(t) * side;
      const z = (radius + 0.2) * Math.sin(t) * side;
      particlePositions.push(x, y, z);
      const color = Math.random() > 0.5 ? 0x00d4ff : 0xff00ff;
      const c = new THREE.Color(color);
      particleColors.push(c.r, c.g, c.b);
    }

    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    helixGroup.add(particles);

    scene.add(helixGroup);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add point light
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    // Camera position
    camera.position.set(0, 0, 20); // Center the camera on X and Y
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate the helix
      helixGroup.rotation.y += 0.005;

      // Animate particles (slight pulsation)
      const positions = particleGeometry.attributes.position.array as number[];
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const t = Date.now() * 0.001 + i;
        positions[idx + 1] += Math.sin(t) * 0.01; // Slight vertical movement
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize and center the helix
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      // Calculate the center of the viewport in Three.js coordinates
      const fov = 75; // Camera's field of view
      const aspect = width / height;
      const zDistance = 20; // Camera's Z position
      const fovRad = (fov * Math.PI) / 180;
      const heightAtZ = 2 * Math.tan(fovRad / 2) * zDistance;
      const widthAtZ = heightAtZ * aspect;

      // Center the helix
      const centerX = 0; // Center of the viewport in Three.js coordinates
      const centerY = 0; // Center vertically

      // Apply the position
      helixGroup.position.set(centerX, centerY, 0);

      // Keep the camera centered on the viewport
      camera.position.set(0, 0, zDistance);
      camera.lookAt(0, 0, 0);
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially to set correct position

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      scene.clear();
      helixGeometry1.dispose();
      helixGeometry2.dispose();
      rungGeometry.dispose();
      particleGeometry.dispose();
      helixMaterial.dispose();
      rungMaterial.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default ThreeBackground;