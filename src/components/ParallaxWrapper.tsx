import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxWrapperProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  direction?: "up" | "down";
}

const ParallaxWrapper = ({ 
  children, 
  speed = 0.15, 
  className = "",
  direction = "up" 
}: ParallaxWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const multiplier = direction === "up" ? -1 : 1;
    const distance = speed * 100;

    const animation = gsap.fromTo(
      element,
      { y: multiplier * -distance },
      {
        y: multiplier * distance,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      }
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [speed, direction]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
};

export default ParallaxWrapper;
