import { Canvas, useFrame } from "@react-three/fiber";
import Experience from "./components/Experience";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

function App() {
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 30 }}
        className="top-0 left-0"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      >
        <color attach="background" args={["#131313"]} />
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
