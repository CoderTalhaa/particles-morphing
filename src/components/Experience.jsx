import React, { useRef, useEffect, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import particlesVertexShader from "./shaders/vertex.glsl";
import particlesFragmentShader from "./shaders/fragment.glsl";
import { useControls } from "leva";

export default function ParticlesExperience() {
  const { size, viewport } = useThree();
  const pointsRef = useRef();

  // Load GLTF model
  const { scene } = useGLTF("/models.glb");

  // Extract positions from GLTF model and set up particles
  const particlesData = useMemo(() => {
    const positions = scene.children.map(
      (child) => child.geometry.attributes.position
    );

    // Find max particle count
    const maxCount = Math.max(...positions.map((pos) => pos.count));

    // Create new particle arrays
    const processedPositions = positions.map((position) => {
      const originalArray = position.array;
      const newArray = new Float32Array(maxCount * 3);

      for (let i = 0; i < maxCount; i++) {
        const i3 = i * 3;
        if (i3 < originalArray.length) {
          newArray[i3] = originalArray[i3];
          newArray[i3 + 1] = originalArray[i3 + 1];
          newArray[i3 + 2] = originalArray[i3 + 2];
        } else {
          const randomIndex = Math.floor(position.count * Math.random()) * 3;
          newArray[i3] = originalArray[randomIndex];
          newArray[i3 + 1] = originalArray[randomIndex + 1];
          newArray[i3 + 2] = originalArray[randomIndex + 2];
        }
      }
      return new THREE.Float32BufferAttribute(newArray, 3);
    });

    return {
      geometry: new THREE.BufferGeometry(),
      positions: processedPositions,
      maxCount,
    };
  }, [scene]);

  // Set up geometry and material uniforms
  useEffect(() => {
    if (particlesData.geometry) {
      particlesData.geometry.setAttribute(
        "position",
        particlesData.positions[1]
      );
      particlesData.geometry.setAttribute(
        "aPositionTarget",
        particlesData.positions[3]
      );
    }
  }, [particlesData]);

  // Define uniforms for shader material
  const uniforms = useMemo(
    () => ({
      uSize: { value: 0.2 },
      uResolution: {
        value: new THREE.Vector2(
          size.width * viewport.dpr,
          size.height * viewport.dpr
        ),
      },
      uProgress: { value: 0 },
    }),
    [size, viewport.dpr]
  );

  const { uProgress } = useControls({
    uProgress: { value: 0, min: 0, max: 1, step: 0.001, label: "uProgress" },
  });

  // Animate the `uProgress` uniform
  useFrame((state) => {
    uniforms.uProgress.value = uProgress;
    if (uniforms.uProgress) {
    }
  });

  return (
    <points ref={pointsRef} geometry={particlesData.geometry}>
      <shaderMaterial
        vertexShader={particlesVertexShader}
        fragmentShader={particlesFragmentShader}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
