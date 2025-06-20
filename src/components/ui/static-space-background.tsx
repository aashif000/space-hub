import React from 'react';

// Simple Static Space Background - NO ANIMATIONS
export default function StaticSpaceBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Static gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950" />
      
      {/* Static star field */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full opacity-80"
          style={{
            backgroundImage: `
              radial-gradient(1px 1px at 20px 30px, white, transparent),
              radial-gradient(1px 1px at 40px 70px, white, transparent),
              radial-gradient(1px 1px at 90px 40px, white, transparent),
              radial-gradient(1px 1px at 130px 80px, white, transparent),
              radial-gradient(1px 1px at 160px 30px, white, transparent),
              radial-gradient(2px 2px at 200px 50px, #60a5fa, transparent),
              radial-gradient(1px 1px at 230px 90px, white, transparent),
              radial-gradient(1px 1px at 270px 20px, white, transparent),
              radial-gradient(2px 2px at 300px 70px, #8b5cf6, transparent),
              radial-gradient(1px 1px at 320px 40px, white, transparent)
            `,
            backgroundSize: '350px 100px',
            backgroundRepeat: 'repeat'
          }}
        />
      </div>
      
      {/* Static nebula effects */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"
          style={{ opacity: 0.1 }}
        />
        <div 
          className="absolute bottom-32 right-32 w-80 h-80 bg-cyan-500 rounded-full blur-3xl"
          style={{ opacity: 0.1 }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          style={{ opacity: 0.08 }}
        />
      </div>
    </div>
  );
}
