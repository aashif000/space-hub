import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SpaceCard } from './ui/space-card';
import { SpaceLoader } from './ui/space-loader';
import { Button } from './ui/button';
import { Rocket, Stars, Construction, Clock, Zap, ArrowRight } from 'lucide-react';

// 3D Rotating Rocket for Coming Soon
function ComingSoonRocket() {
  const rocketRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (rocketRef.current) {
      rocketRef.current.rotation.y += 0.01;
      rocketRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5;
    }
  });

  return (
    <group ref={rocketRef}>
      {/* Rocket body */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.15, 2, 8]} />
        <meshPhongMaterial color="#e5e7eb" />
      </mesh>
      
      {/* Rocket cone */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.3, 0.8, 8]} />
        <meshPhongMaterial color="#dc2626" />
      </mesh>
      
      {/* Rocket fins */}
      {[0, 90, 180, 270].map((rotation, index) => (
        <mesh 
          key={index} 
          position={[
            Math.sin((rotation * Math.PI) / 180) * 0.4,
            -0.8,
            Math.cos((rotation * Math.PI) / 180) * 0.4
          ]}
          rotation={[0, (rotation * Math.PI) / 180, 0]}
        >
          <boxGeometry args={[0.1, 0.5, 0.3]} />
          <meshPhongMaterial color="#1f2937" />
        </mesh>
      ))}
      
      {/* Exhaust particles */}
      <mesh position={[0, -1.5, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshPhongMaterial 
          color="#f97316" 
          transparent 
          opacity={0.7}
          emissive="#f97316"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: React.ComponentType<any>;
  features?: string[];
  estimatedCompletion?: string;
  progress?: number;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ 
  title, 
  description, 
  icon: Icon = Rocket,
  features = [],
  estimatedCompletion = "Coming Soon",
  progress = 60
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* 3D Background Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={0.6} />
          <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4f46e5" />
          
          <ComingSoonRocket />
          
          {/* Background particles */}
          <mesh>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                array={new Float32Array([...Array(300)].flatMap(() => [
                  (Math.random() - 0.5) * 20,
                  (Math.random() - 0.5) * 20,
                  (Math.random() - 0.5) * 20
                ]))}
                count={300}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#60a5fa" transparent opacity={0.6} />
          </mesh>
        </Canvas>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full text-center relative z-10"
      >
        <SpaceCard variant="cosmic" glow={true} className="p-8 backdrop-blur-xl bg-opacity-20">
          {/* Header Section */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="p-4 rounded-full bg-primary/20 backdrop-blur-sm"
              >
                <Icon className="h-12 w-12 text-primary" />
              </motion.div>
              
              <div className="flex items-center gap-2">
                <SpaceLoader variant="orbit" size="md" />
                <Construction className="h-8 w-8 text-orange-400 animate-bounce" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </motion.div>

          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Development Progress</span>
              <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
              />
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated completion: {estimatedCompletion}</span>
            </div>
          </motion.div>

          {/* Features List */}
          {features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8"
            >
              <h3 className="text-xl font-semibold mb-4 text-center">What's Coming</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 backdrop-blur-sm"
                  >
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-4"
          >
            <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
              <Stars className="mr-2 h-4 w-4" />
              Stay Updated
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              <span>Explore Other Features</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>

          {/* Fun Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                ⚡
              </motion.div>
              <span className="text-sm">Building something amazing...</span>
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                🚀
              </motion.div>
            </div>
          </motion.div>
        </SpaceCard>
      </motion.div>
    </div>
  );
};

export default ComingSoon;
