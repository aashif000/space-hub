import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';

/**
 * Enhanced Canvas component with WebGL context loss recovery
 * This component wraps the regular Canvas with improved error handling
 * to address issues with WebGL context loss
 */
interface FixedCanvasProps {
  children: React.ReactNode;
  camera?: any;
  shadows?: boolean;
  dpr?: number;
  gl?: any;
  frameloop?: 'always' | 'demand';
  style?: React.CSSProperties;
  className?: string;
}

export const FixedCanvas: React.FC<FixedCanvasProps> = ({
  children,
  camera,
  shadows,
  dpr,
  gl,
  frameloop,
  style,
  className
}) => {
  return (
    <Canvas
      camera={camera}
      shadows={shadows}
      dpr={dpr}
      gl={{
        antialias: gl?.antialias || true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
        alpha: true,
        stencil: true,
        ...gl
      }}
      onCreated={({ gl, scene }) => {
        // Enhanced error handling and context loss management
        const canvas = gl.domElement;
        
        // Add event listeners for context loss and restoration
        canvas.addEventListener('webglcontextlost', (event) => {
          event.preventDefault();
          console.log('WebGL context lost. Trying to restore...');
          
          // Display a notification to the user
          if (typeof window !== 'undefined') {
            const notification = document.createElement('div');
            notification.style.position = 'absolute';
            notification.style.top = '10px';
            notification.style.left = '50%';
            notification.style.transform = 'translateX(-50%)';
            notification.style.backgroundColor = 'rgba(0,0,0,0.8)';
            notification.style.color = 'white';
            notification.style.padding = '10px 20px';
            notification.style.borderRadius = '4px';
            notification.style.zIndex = '1000';
            notification.innerText = 'Graphics context lost. Attempting to recover...';
            document.body.appendChild(notification);
            
            // Remove the notification after context is restored or after 5 seconds
            setTimeout(() => {
              if (document.body.contains(notification)) {
                document.body.removeChild(notification);
              }
            }, 5000);
          }
        });
          canvas.addEventListener('webglcontextrestored', () => {
          console.log('WebGL context restored.');
          // Force a re-render of the scene
          scene.traverse((obj) => {
            // Type cast to access mesh properties safely
            if (obj.type === 'Mesh') {
              const mesh = obj as THREE.Mesh;
              if (mesh.material) {
                // Handle both single material and material array
                if (Array.isArray(mesh.material)) {
                  mesh.material.forEach(mat => {
                    mat.needsUpdate = true;
                  });
                } else {
                  mesh.material.needsUpdate = true;
                }
              }
            }
          });
        });
        
        // Set renderer parameters for better stability
        gl.setClearColor(0x000000, 0);
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
      frameloop={frameloop}
      style={style}
      className={className}
    >
      {children}
    </Canvas>
  );
};
