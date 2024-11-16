import React, { useRef, useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import particlesVertexShader from "./shaders/vertex.glsl";
import particlesFragmentShader from "./shaders/fragment.glsl";
import { useStore } from "../store/useStore";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ParticlesExperience() {
  const { screen, index, isMobile } = useStore();
  const { size, viewport } = useThree();
  const pointsRef = useRef();
  const modelRef = useRef();

  const colorPairs = [
    { colorA: "#1b1818", colorB: "#575757" },
    { colorA: "#760505", colorB: "#123cba" },
    { colorA: "#de7717", colorB: "#ba1212" },
    { colorA: "#17deb6", colorB: "#ba1212" },
  ];

  // Load GLTF model
  const { scene } = useGLTF("/models2.glb");

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

    const sizesArray = new Float32Array(maxCount).map(() => Math.random());

    return {
      geometry: new THREE.BufferGeometry(),
      positions: processedPositions,
      sizesArray,
      maxCount,
      index: 0,
    };
  }, [scene]);

  const colorA = "#1b1818";
  const colorB = "#575757";

  // Set up geometry and material uniforms
  useEffect(() => {
    if (particlesData.geometry) {
      particlesData.geometry.setAttribute(
        "position",
        particlesData.positions[particlesData.index]
      );
      particlesData.geometry.setAttribute(
        "aPositionTarget",
        particlesData.positions[3]
      );
      particlesData.geometry.setAttribute(
        "aSize",
        new THREE.BufferAttribute(particlesData.sizesArray, 1)
      );
    }
  }, [particlesData]);

  // morphy function below
  const morph = (index) => {
    particlesData.geometry.setAttribute(
      "position",
      particlesData.positions[particlesData.index]
    );
    particlesData.geometry.setAttribute(
      "aPositionTarget",
      particlesData.positions[index]
    );

    gsap.fromTo(
      uniforms.uProgress,
      { value: 0 },
      { value: 1, duration: 2, ease: "linear" }
    );

    const { colorA, colorB } = colorPairs[index];

    gsap.to(uniforms.uColorA.value, {
      r: new THREE.Color(colorA).r,
      g: new THREE.Color(colorA).g,
      b: new THREE.Color(colorA).b,
      duration: 2, // Duration of the animation
      ease: "power2.inOut",
    });

    gsap.to(uniforms.uColorB.value, {
      r: new THREE.Color(colorB).r,
      g: new THREE.Color(colorB).g,
      b: new THREE.Color(colorB).b,
      duration: 2, // Duration of the animation
      ease: "power2.inOut",
    });

    particlesData.index = index;
  };

  useEffect(() => {
    morph(index);
  }, [index]);

  // Define uniforms for shader material
  const uniforms = useMemo(
    () => ({
      uSize: { value: 0.4 },
      uResolution: {
        value: new THREE.Vector2(
          size.width * viewport.dpr,
          size.height * viewport.dpr
        ),
      },
      uProgress: { value: 0 },
      uColorA: { value: new THREE.Color(colorA) },
      uColorB: { value: new THREE.Color(colorB) },
    }),
    [size, viewport.dpr]
  );

  // camera animation
  const cameraTarget = new THREE.Vector3(0, -0.5, 0);
  const tl = gsap.timeline();

  const camera = useThree((state) => state.camera);

  useGSAP(
    () => {
      if (screen === "menu") {
        tl.fromTo(
          camera.position,
          { x: 0, y: 0, z: 25 },
          { x: 0, y: 1, z: 18, duration: 2, ease: "power2.inOut" }
        )
          .to(
            cameraTarget,
            {
              x: isMobile ? 0 : -1,
              y: 0,
              z: 0,
              duration: 2,
              ease: "power4.inOut",
            },
            "<"
          )
          .to(
            modelRef.current.position,
            { x: isMobile ? 0 : 3, duration: 2, ease: "power4.inOut" },
            "<"
          );
      }
    },
    { dependencies: [screen] }
  );

  useFrame(() => {
    camera.lookAt(cameraTarget);
  });

  return (
    <>
      <OrbitControls
        minPolarAngle={Math.PI / 4} // Limit up rotation (45 degrees)
        maxPolarAngle={Math.PI / 1.5} // Limit down rotation (120 degrees)
        minAzimuthAngle={-Math.PI / 4} // Limit left rotation (-45 degrees)
        maxAzimuthAngle={Math.PI / 4}
        minDistance={15} // Minimum zoom (closest)
        maxDistance={25} // Maximum zoom (farthest)
        enablePan={false} // Disable panning (optional)
      />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      <group ref={modelRef}>
        <points
          ref={pointsRef}
          geometry={particlesData.geometry}
          frustumCulled={false}
        >
          <shaderMaterial
            vertexShader={particlesVertexShader}
            fragmentShader={particlesFragmentShader}
            uniforms={uniforms}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>
    </>
  );
}
