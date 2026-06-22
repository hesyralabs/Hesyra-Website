import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Center, Environment, ContactShadows } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import * as THREE from 'three'

const DynamicMaterialMesh = ({ geometry, step }) => {
    const meshRef = useRef()

    // Materials definition
    // Step 0: Scan (Wireframe)
    const scanMaterial = new THREE.MeshStandardMaterial({
        color: '#00f0ff',
        emissive: '#0055ff',
        emissiveIntensity: 0.5,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    })

    // Step 1: Print (Translucent Resin)
    const printMaterial = new THREE.MeshPhysicalMaterial({
        color: '#10b981',
        emissive: '#000000',
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.7,
        transmission: 0.5, // glass-like
        thickness: 2.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    })

    // Step 2: Delivered (Ceramic/Zirconia)
    const deliverMaterial = new THREE.MeshStandardMaterial({
        color: '#ffffff',
        emissive: '#000000',
        roughness: 0.15,
        metalness: 0.05,
    })

    // Assign material based on step
    let activeMaterial = scanMaterial
    if (step === 1) activeMaterial = printMaterial
    if (step === 2) activeMaterial = deliverMaterial

    // Rotate slowly for cinematic effect
    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005
        }
    })

    return (
        <mesh 
            ref={meshRef}
            geometry={geometry} 
            material={activeMaterial} 
            rotation={[-Math.PI / 2, 0, 0]} 
            castShadow
            receiveShadow
        />
    )
}

const Model = ({ url, step }) => {
    const geometry = useLoader(STLLoader, url)
    return <DynamicMaterialMesh geometry={geometry} step={step} />
}

const Loader = () => (
    <mesh>
        <boxGeometry args={[40, 40, 40]} />
        <meshStandardMaterial wireframe color="var(--accent)" />
    </mesh>
)

export default function Workflow3DViewer({ url, step }) {
    return (
        <div style={{ width: '100%', height: '100%', cursor: 'grab' }} className="workflow-3d-wrapper">
            <Canvas camera={{ position: [0, 60, 140], fov: 45 }} shadows>
                <ambientLight intensity={0.5} />
                
                {/* Dynamic Lighting based on Step */}
                {step === 0 && (
                    <directionalLight position={[0, 100, 50]} intensity={1} color="#00f0ff" />
                )}
                {step === 1 && (
                    <>
                        <directionalLight position={[50, 100, 50]} intensity={1.5} color="#10b981" />
                        <spotLight position={[0, -50, 0]} intensity={2} color="#00ff88" angle={0.8} penumbra={1} />
                    </>
                )}
                {step === 2 && (
                    <>
                        <directionalLight position={[50, 100, 50]} intensity={1.5} color="#ffffff" castShadow />
                        <directionalLight position={[-50, -50, -50]} intensity={0.5} color="#90b5ae" />
                    </>
                )}

                <Suspense fallback={<Loader />}>
                    <Center scale={1.2}>
                        <Model url={url} step={step} />
                    </Center>
                    
                    {/* Shadow plane for realism in step 2 */}
                    {step === 2 && (
                        <ContactShadows position={[0, -35, 0]} opacity={0.5} scale={100} blur={2} far={50} />
                    )}
                </Suspense>

                <OrbitControls 
                    enableZoom={false} 
                    enablePan={false}
                    autoRotate={false}
                    maxPolarAngle={Math.PI / 1.5}
                    minPolarAngle={Math.PI / 3}
                />
            </Canvas>
        </div>
    )
}
