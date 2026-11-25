"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useMotionPreference } from "@/lib/motion/useMotionPreference";

export interface HeroArchitecturalSceneProps {
  isVisible?: boolean;
}

export function HeroArchitecturalScene({ isVisible = true }: HeroArchitecturalSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const shouldAnimate = useMotionPreference();
  const isVisibleRef = useRef(isVisible);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !shouldAnimate || typeof window === "undefined") return;

    const width = mount.clientWidth || 400;
    const height = mount.clientHeight || 340;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const outerGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerMesh);

    const coreGeo = new THREE.OctahedronGeometry(0.7, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    const ringGeo = new THREE.RingGeometry(2.1, 2.12, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x64748b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.5;
    scene.add(ringMesh);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    function handlePointerMove(e: MouseEvent) {
      const rect = mount?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 0.8;
      targetY = y * 0.8;
    }

    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    let animId: number;
    function animate() {
      animId = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      outerMesh.rotation.y += 0.003;
      outerMesh.rotation.x += 0.0015;
      coreMesh.rotation.y -= 0.006;
      coreMesh.rotation.x -= 0.003;
      ringMesh.rotation.z += 0.001;

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
      ringGeo.dispose();
      ringMat.dispose();

      renderer.dispose();
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [shouldAnimate]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[320px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      aria-label="Interactive 3D Architectural Blueprint Model"
      role="img"
    />
  );
}
