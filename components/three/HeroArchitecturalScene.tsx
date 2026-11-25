"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useAdaptiveRendering } from "@/lib/motion/useAdaptiveRendering";

export interface HeroArchitecturalSceneProps {
  isVisible?: boolean;
}

export function HeroArchitecturalScene({ isVisible = true }: HeroArchitecturalSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isFull } = useAdaptiveRendering();
  const isVisibleRef = useRef(isVisible);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !isFull || typeof window === "undefined") return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.4;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Directional and ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // 1. Outer Polyhedron: Dual-frequency wireframe icosahedron (Sky-Blue #0284c7)
    const outerGeo = new THREE.IcosahedronGeometry(1.65, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    // 2. Primary Core: Internal Octahedron (Warm Orange #ea580c)
    const coreGeo = new THREE.OctahedronGeometry(0.72, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // 3. Secondary Nested Core: Counter-rotating concentric octahedron (#ea580c)
    const coreSubGeo = new THREE.OctahedronGeometry(0.42, 0);
    const coreSubMat = new THREE.MeshBasicMaterial({
      color: 0xea580c,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const coreSubMesh = new THREE.Mesh(coreSubGeo, coreSubMat);
    scene.add(coreSubMesh);

    // 4. Primary Gimbal Orbital Ring (Slate #64748b)
    const ringGeo1 = new THREE.RingGeometry(2.1, 2.13, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x64748b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 2.4;
    scene.add(ringMesh1);

    // 5. Secondary Inclined Gimbal Ring (Sky-Blue #0284c7)
    const ringGeo2 = new THREE.RingGeometry(2.35, 2.37, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.x = -Math.PI / 3.2;
    ringMesh2.rotation.y = Math.PI / 4;
    scene.add(ringMesh2);

    // 6. Floating Vertex Marker Particles (Sky-Blue points orbiting on vertices)
    const particleCount = 18;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = (i / particleCount) * Math.PI * 2;
      particlePositions[i * 3] = Math.cos(theta) * 2.1;
      particlePositions[i * 3 + 1] = Math.sin(theta) * 0.4;
      particlePositions[i * 3 + 2] = Math.sin(theta) * 2.1;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    scene.add(particleCloud);

    // Pointer-responsive Damped Parallax on Desktop
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    function handlePointerMove(e: MouseEvent) {
      const rect = mount?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.9;
      targetY = y * 0.9;
    }

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    let animId: number;
    let clock = 0;

    function animate() {
      animId = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;
      clock += 0.015;

      // Smooth damping interpolation
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Outer structure rotation & breathing pulsation
      outerMesh.rotation.y += 0.0025;
      outerMesh.rotation.x += 0.0012;
      const scaleBreathing = 1 + Math.sin(clock * 1.2) * 0.02;
      outerMesh.scale.set(scaleBreathing, scaleBreathing, scaleBreathing);

      // Core counter-rotations
      coreMesh.rotation.y -= 0.006;
      coreMesh.rotation.x -= 0.003;
      coreSubMesh.rotation.y += 0.008;
      coreSubMesh.rotation.z -= 0.005;

      // Gimbal ring motions
      ringMesh1.rotation.z += 0.001;
      ringMesh2.rotation.z -= 0.0015;
      particleCloud.rotation.y += 0.004;

      // Cursor parallax applied to camera angle
      outerMesh.rotation.y += mouseX * 0.04;
      outerMesh.rotation.x += mouseY * 0.04;

      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("resize", handleResize);

      outerGeo.dispose();
      outerMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      coreSubGeo.dispose();
      coreSubMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      renderer.dispose();
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [isFull]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[320px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      aria-label="Interactive 3D Architectural Blueprint Model"
      role="img"
    />
  );
}
