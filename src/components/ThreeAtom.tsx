import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ElementData } from '../data/elements';

const Nucleus = ({ atomicNumber }: { atomicNumber: number }) => {
  const particles = useMemo(() => {
    const pts = [];
    // OPTIMIZATION: Hard limit nucleus particles to max 16 to save CPU/GPU, 
    // even for heavy elements, we just scale them slightly on visual size.
    const count = Math.min(atomicNumber, 16); 
    const maxRadius = Math.pow(count, 1/3) * 0.15 + (atomicNumber > 16 ? 0.2 : 0);
    
    for (let i = 0; i < count; i++) {
       const theta = Math.random() * Math.PI * 2;
       const phi = Math.acos(Math.random() * 2 - 1);
       const r = Math.pow(Math.random(), 0.33) * maxRadius;
       
       const x = r * Math.sin(phi) * Math.cos(theta);
       const y = r * Math.sin(phi) * Math.sin(theta);
       const z = r * Math.cos(phi);
       
       pts.push({
         pos: new THREE.Vector3(x, y, z),
         isProton: i % 2 === 0
       });
    }
    return { pts, maxRadius };
  }, [atomicNumber]);

  return (
    <group>
      {particles.pts.map((p, i) => (
        <mesh key={i} position={p.pos}>
           {/* OPTIMIZATION: Lower segments (8x8 instead of 16x16) */}
           <sphereGeometry args={[0.1, 8, 8]} />
           <meshStandardMaterial 
             color={p.isProton ? "#f472b6" : "#22d3ee"} 
             emissive={p.isProton ? "#f472b6" : "#22d3ee"} 
             emissiveIntensity={1} 
             roughness={0.5} 
           />
        </mesh>
      ))}
      <pointLight distance={10} intensity={2} color="#22d3ee" />
      <mesh>
         {/* OPTIMIZATION: Much lower poly background glow */}
         <sphereGeometry args={[particles.maxRadius * 1.5, 12, 12]} />
         <meshBasicMaterial color="#22d3ee" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

const ElectronRing = ({ radius, count, speed, angleOffset }: { radius: number, count: number, speed: number, angleOffset: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * speed;
      groupRef.current.rotation.x = Math.sin(angleOffset) * 0.5;
      groupRef.current.rotation.z = Math.cos(angleOffset) * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Orbit path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        {/* OPTIMIZATION: Lower ring segments from 64 to 32 */}
        <ringGeometry args={[radius - 0.015, radius + 0.015, 32]} />
        <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} transparent opacity={0.1} />
      </mesh>

      {/* Electrons */}
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
            {/* OPTIMIZATION: Very low poly electron (6x6) */}
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color="#4ade80" emissive="#4ade80" emissiveIntensity={2} toneMapped={false} />
          </mesh>
        );
      })}
    </group>
  );
};

export default function ThreeAtom({ element }: { element: ElementData }) {
  const electronsArray = element.electrons && element.electrons.length > 0 
    ? element.electrons 
    : [element.number]; // Fallback

  return (
    // OPTIMIZATION: Set dpr to avoid huge resolutions on retina screens crushing GPU
    <Canvas camera={{ position: [0, 5, 12], fov: 45 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#05060a']} />
      <ambientLight intensity={0.5} />
      {/* OPTIMIZATION: Reduce stars heavily from 2000 to 400 */}
      <Stars radius={50} depth={50} count={400} factor={4} saturation={0} fade speed={1} />
      
      <Nucleus atomicNumber={element.number} />

      {electronsArray.map((count, index) => {
        const radius = Math.pow(element.number, 1/3) * 0.5 + 1.5 + (index * 1.2);
        const speed = (2 - index * 0.15) * 0.4; // Slower, less jarring
        const angleOffset = index * (Math.PI / 3);
        
        return (
          <ElectronRing 
            key={index} 
            radius={radius} 
            count={count} 
            speed={Math.max(0.05, speed)} 
            angleOffset={angleOffset}
          />
        );
      })}

      <OrbitControls 
        enablePan={false} 
        minDistance={3} 
        maxDistance={30} 
        autoRotate 
        autoRotateSpeed={0.5} 
      />
    </Canvas>
  );
}
