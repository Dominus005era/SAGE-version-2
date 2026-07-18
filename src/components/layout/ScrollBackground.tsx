import React, { useEffect, useState } from 'react';

interface ScrollBackgroundProps {
  images: string[];
}

export function ScrollBackground({ images }: ScrollBackgroundProps) {
  const [scrollYProgress, setScrollYProgress] = useState(0);
  const [isLightMode, setIsLightMode] = useState(() => document.documentElement.classList.contains('light-mode'));

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      setScrollYProgress(progress);
    };

    const observer = new MutationObserver(() => {
      setIsLightMode(document.documentElement.classList.contains('light-mode'));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none transition-colors duration-500 ${isLightMode ? 'bg-[#f1f5f9]' : 'bg-[#04040a]'}`}>
      {images.map((src, i) => {
        const segmentLength = 1 / Math.max(1, images.length);
        const center = (i * segmentLength) + (segmentLength / 2);
        const distance = Math.abs(scrollYProgress - center);

        let opacity = 1 - (distance / segmentLength);
        opacity = Math.max(0, Math.min(1, opacity));

        if (i === 0 && scrollYProgress < center) opacity = 1;
        if (i === images.length - 1 && scrollYProgress > center) opacity = 1;

        // Apply dynamic opacity so background images stand out clearly in both themes
        opacity = opacity * (isLightMode ? 0.35 : 0.6);

        return (
          <img
            key={src}
            src={src}
            style={{ opacity, transition: 'opacity 0.1s linear' }}
            className={`absolute inset-0 w-full h-full object-cover ${isLightMode ? 'mix-blend-multiply' : 'mix-blend-screen'}`}
            alt=""
          />
        );
      })}
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
        isLightMode 
          ? 'bg-gradient-to-b from-[#f1f5f9]/80 via-[#f1f5f9]/40 to-[#f1f5f9]/90' 
          : 'bg-gradient-to-b from-[#04040a]/70 via-[#04040a]/40 to-[#04040a]/80'
      }`} />
    </div>
  );
}
