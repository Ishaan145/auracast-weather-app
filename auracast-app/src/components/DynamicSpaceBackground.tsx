export const DynamicSpaceBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden" style={{ backgroundColor: '#0a0e1a' }}>
      {/* Deep space gradient base - very subtle */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a] via-[#0d1117] to-[#0a0e1a]" />
      
      {/* CSS-based starfield layers - more subtle - static on mobile */}
      <div className="stars-layer-1 absolute inset-0 opacity-40 md:animate-twinkle" />
      <div className="stars-layer-2 absolute inset-0 opacity-30 md:animate-twinkle" />
      <div className="stars-layer-3 absolute inset-0 opacity-50 md:animate-twinkle" />
      
      {/* Animated data particles - disabled on mobile for performance */}
      <div className="particles-layer absolute inset-0 opacity-30 hidden md:block" />
      
      {/* Very subtle accent glows - static on mobile */}
      <div className="absolute top-[-30%] left-[-15%] w-[40%] h-[40%] bg-[radial-gradient(circle,_rgba(100,120,255,0.03),_transparent_70%)] blur-[100px] md:animate-nebula-float-1" />
      <div className="absolute bottom-[-30%] right-[-15%] w-[40%] h-[40%] bg-[radial-gradient(circle,_rgba(100,200,255,0.02),_transparent_70%)] blur-[100px] md:animate-nebula-float-2" />
      
      {/* Minimal grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.005]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100,100,120,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,100,120,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
};
