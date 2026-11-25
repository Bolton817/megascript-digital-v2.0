"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useMotionPreference } from "@/lib/motion/useMotionPreference";

export interface WowFactorsSceneProps {
  isVisible?: boolean;
}

export function WowFactorsScene({ isVisible = true }: WowFactorsSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const shouldAnimate = useMotionPreference();
  const isVisibleRef = useRef(isVisible);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !shouldAnimate || typeof window === "undefined") return;

    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const nodeCount = 38;
    const positions = new Float32Array(nodeCount * 3);
    const velocities = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      const x = (Math.random() - 0.5) * 5;
      const y = (Math.random() - 0.5) * 3;
      const z = (Math.random() - 0.5) * 2;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      velocities[i * 3] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const pointsMat = new THREE.PointsMaterial({
      color: 0x0284c7,
      size: 0.1,
      transparent: true,
      opacity: 0.9,
    });

    const pointCloud = new THREE.Points(pointsGeo, pointsMat);
    scene.add(pointCloud);

    const linesMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.25,
    });
    const linesGeo = new THREE.BufferGeometry();
    const lineSegments = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(lineSegments);

    let animId: number;
    function animate() {
      animId = requestAnimationFrame(animate);
      if (!isVisibleRef.current) return;

      const pos = pointsGeo.attributes.position.array as Float32Array;
      const linePositions: number[] = [];

      for (let i = 0; i < nodeCount; i++) {
        pos[i * 3] += velocities[i * 3];
        pos[i * 3 + 1] += velocities[i * 3 + 1];
        pos[i * 3 + 2] += velocities[i * 3 + 2];

        if (Math.abs(pos[i * 3]) > 2.8) velocities[i * 3] *= -1;
        if (Math.abs(pos[i * 3 + 1]) > 1.8) velocities[i * 3 + 1] *= -1;
        if (Math.abs(pos[i * 3 + 2]) > 1.5) velocities[i * 3 + 2] *= -1;

        for (let j = i + 1; j < nodeCount; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 1.4) {
            linePositions.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
            linePositions.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
          }
        }
      }

      pointsGeo.attributes.position.needsUpdate = true;
      linesGeo.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));

      pointCloud.rotation.y += 0.001;
      lineSegments.rotation.y += 0.001;

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
      window.removeEventListener("resize", handleResize);

      pointsGeo.dispose();
      pointsMat.dispose();
      linesGeo.dispose();
      linesMat.dispose();

      renderer.dispose();
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [shouldAnimate]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[260px] flex items-center justify-center cursor-crosshair select-none"
      aria-label="Interactive 3D Constellation of Engineering Prototypes"
      role="img"
    />
  );
}
