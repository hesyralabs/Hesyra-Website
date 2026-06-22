import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { useLoader } from '@react-three/fiber'

// The core geometry parsing wrapper
const MeshModel = ({ url, isAligner }) => {
    // native parsing of array buffer returning three.js BufferGeometry
    const geometry = useLoader(STLLoader, url)
    
    return (
        <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Morph materials dynamically based on the clinical case loaded */}
            <meshStandardMaterial 
                color={isAligner ? "#10b981" : "#e5e3e0"} 
                transparent={isAligner}
                opacity={isAligner ? 0.45 : 1}
                roughness={0.2}
                metalness={isAligner ? 0.3 : 0.05}
            />
        </mesh>
    )
}

// Low-poly loading mesh injected into the WebGL canvas
const Loader = () => {
    return (
        <mesh>
            <boxGeometry args={[40, 40, 40]} />
            <meshStandardMaterial wireframe color="var(--accent)" />
        </mesh>
    )
}

export default function InteractiveStlViewer({ url, isAligner }) {
    return (
        <div style={{ width: '100%', height: '100%', cursor: 'grab' }} className="stl-gl-wrapper">
            <Canvas camera={{ position: [0, 80, 150], fov: 45 }}>
                {/* Clinical lighting approximation */}
                <ambientLight intensity={0.6} />
                <directionalLight position={[50, 100, 50]} intensity={1.5} color="#ffffff" />
                <directionalLight position={[-50, -50, -50]} intensity={0.5} color="#90b5ae" />
                <spotLight position={[0, -50, 0]} intensity={0.8} color="#10b981" angle={0.5} penumbra={1} />
                
                {/* Fallback bounds parsing while heavy geometry drops */}
                <Suspense fallback={<Loader />}>
                    <Center scale={1.2}>
                        <MeshModel url={url} isAligner={isAligner} />
                    </Center>
                </Suspense>
                
                <OrbitControls 
                    enableZoom={true} 
                    enablePan={false}
                    autoRotate={true}
                    autoRotateSpeed={3.0}
                    maxPolarAngle={Math.PI / 1.5}
                />
            </Canvas>
        </div>
    )
}
