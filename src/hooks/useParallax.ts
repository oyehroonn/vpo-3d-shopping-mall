import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxOptions {
  speed?: number; // Positive = slower, Negative = faster (parallax direction)
  direction?: "vertical" | "horizontal";
  scrub?: number | boolean;
}

export const useParallax = <T extends HTMLElement>(options: ParallaxOptions = {}) => {
  const ref = useRef<T>(null);
  const { speed = 0.3, direction = "vertical", scrub = true } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const yPercent = direction === "vertical" ? speed * 100 : 0;
    const xPercent = direction === "horizontal" ? speed * 100 : 0;

    const animation = gsap.fromTo(
      element,
      {
        yPercent: direction === "vertical" ? -yPercent / 2 : 0,
        xPercent: direction === "horizontal" ? -xPercent / 2 : 0,
      },
      {
        yPercent: direction === "vertical" ? yPercent / 2 : 0,
        xPercent: direction === "horizontal" ? xPercent / 2 : 0,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: scrub,
        },
      }
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [speed, direction, scrub]);

  return ref;
};

// Hook for parallax background images
export const useParallaxBackground = <T extends HTMLElement>(speed: number = 0.2) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const animation = gsap.fromTo(
      element,
      { backgroundPositionY: "0%" },
      {
        backgroundPositionY: `${speed * 100}%`,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      }
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [speed]);

  return ref;
};

export default useParallax;
