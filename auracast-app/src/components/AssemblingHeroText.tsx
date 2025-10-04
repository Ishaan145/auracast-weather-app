import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AssemblingHeroTextProps {
  title: string;
  subtitle: string;
}

export const AssemblingHeroText = ({ title, subtitle }: AssemblingHeroTextProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const titleChars = title.split('');
  const subtitleWords = subtitle.split(' ');

  return (
    <div className="relative">
      {/* Assembling title */}
      <motion.h1
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
        style={{ perspective: '1000px' }}
      >
        {titleChars.map((char, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={{
              opacity: 0,
              y: -100,
              rotateX: -90,
              scale: 0,
            }}
            animate={isVisible ? {
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
            } : {}}
            transition={{
              duration: 0.8,
              delay: i * 0.05,
              type: "spring",
              stiffness: 100,
            }}
            style={{
              background: 'linear-gradient(135deg, hsl(217 91% 60%), hsl(250 80% 62%))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.h1>

      {/* Assembling subtitle */}
      <motion.div
        className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto"
        style={{ perspective: '1000px' }}
      >
        {subtitleWords.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-2"
            initial={{
              opacity: 0,
              x: -50,
              rotateY: -90,
            }}
            animate={isVisible ? {
              opacity: 1,
              x: 0,
              rotateY: 0,
            } : {}}
            transition={{
              duration: 0.6,
              delay: titleChars.length * 0.05 + i * 0.1,
              type: "spring",
            }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>

      {/* Glowing orb behind text */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[500px] h-[500px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, hsl(217 91% 60% / 0.6), transparent 70%)',
          filter: 'blur(100px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
