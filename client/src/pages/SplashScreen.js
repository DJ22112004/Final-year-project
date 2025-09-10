import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// A simple rotating box component as a placeholder for your 3D model
const Box = (props) => {
  const meshRef = useRef();

  // Rotate the box on every frame
  useFrame((state, delta) => {
    if (meshRef.current) {
        meshRef.current.rotation.x += delta * 0.2;
        meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh {...props} ref={meshRef}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={'#5E81AC'} />
    </mesh>
  );
};

const SplashScreen = ({ onEnter }) => {
  return (
    <div className="relative w-screen h-screen bg-gray-900 text-white overflow-hidden">
      {/* 3D Canvas */}
      <Canvas>
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={null}>
          <Box position={[0, 0, 0]} />
          <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={0.5} />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center pointer-events-none text-center p-4">
        <h1 className="text-4xl md:text-7xl font-bold mb-4 text-shadow-lg animate-fade-in-down">Smart Medicine Dispenser</h1>
        <p className="text-lg md:text-2xl mb-8 text-gray-300 animate-fade-in-up">Your Health, Automated and Assured.</p>
        <button 
          onClick={onEnter} 
          className="pointer-events-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 transform hover:scale-105 shadow-lg animate-fade-in-up"
        >
          Open Dispenser
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;

