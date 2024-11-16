import { Canvas, useFrame } from "@react-three/fiber";
import Experience from "./three/Experience";
import { Suspense, useEffect } from "react";
import { OrbitControls, useProgress } from "@react-three/drei";
import { Leva } from "leva";
import LoadingScreen from "./ui/LoadingScreen";
import ScreenTransition from "./three/components/ScreenTransition";
import { useStore } from "./store/useStore";

function App() {
  const { transition, setTransition } = useStore();

  const { progress } = useProgress();

  useEffect(() => {
    if (progress === 100) {
      setTransition(false);
    }
  }, [progress]);

  return (
    <>
      {/* <Leva /> */}
      <div className="absolute top-5 left-0 flex justify-center w-full z-10">
        <img src="/image2.svg" alt="Logo" />
      </div>
      <LoadingScreen />
      <Canvas
        camera={{ position: [0, 1, 18], fov: 35 }}
        className="top-0 left-0"
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
        }}
      >
        <color attach="background" args={["#0a090b"]} />
        <ScreenTransition transition={transition} color="#101010" />
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
