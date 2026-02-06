import { useEffect, useRef, RefObject, MutableRefObject, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AnimationType = "fade-up" | "fade-left" | "fade-right" | "scale" | "wipe-up";

interface ScrollRevealOptions {
  type?: AnimationType;
  delay?: number;
  duration?: number;
}

export function useScrollReveal<T extends HTMLElement>(
  options: ScrollRevealOptions = {}
): RefObject<T> {
  const { type = "fade-up", delay = 0, duration = 1 } = options;
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Get initial transform values based on animation type
    const getInitialState = () => {
      switch (type) {
        case "fade-up":
          return { opacity: 0, y: 80 };
        case "fade-left":
          return { opacity: 0, x: -80 };
        case "fade-right":
          return { opacity: 0, x: 80 };
        case "scale":
          return { opacity: 0, scale: 0.9 };
        case "wipe-up":
          return { opacity: 0, y: 100, clipPath: "inset(100% 0 0 0)" };
        default:
          return { opacity: 0, y: 80 };
      }
    };

    const getFinalState = () => {
      switch (type) {
        case "fade-up":
          return { opacity: 1, y: 0 };
        case "fade-left":
          return { opacity: 1, x: 0 };
        case "fade-right":
          return { opacity: 1, x: 0 };
        case "scale":
          return { opacity: 1, scale: 1 };
        case "wipe-up":
          return { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" };
        default:
          return { opacity: 1, y: 0 };
      }
    };

    // Set initial state
    gsap.set(element, getInitialState());

    // Create animation
    const animation = gsap.to(element, {
      ...getFinalState(),
      duration,
      delay,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        end: "top 50%",
        toggleActions: "play none none none",
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [type, delay, duration]);

  return ref;
}

// Simple hook to get a ref setter for arrays
export function useScrollRevealRefs<T extends HTMLElement>(
  count: number,
  options: ScrollRevealOptions = {}
) {
  const { type = "fade-up", delay = 0, duration = 0.8 } = options;
  const refs = useRef<(T | null)[]>([]);
  const hasAnimated = useRef(false);

  const setRef = useCallback((index: number) => (el: T | null) => {
    refs.current[index] = el;
  }, []);

  useEffect(() => {
    if (hasAnimated.current) return;
    
    const elements = refs.current.filter(Boolean) as T[];
    if (elements.length === 0) return;

    const getInitialState = () => {
      switch (type) {
        case "fade-up":
          return { opacity: 0, y: 60 };
        case "fade-left":
          return { opacity: 0, x: -60 };
        case "fade-right":
          return { opacity: 0, x: 60 };
        case "scale":
          return { opacity: 0, scale: 0.9 };
        default:
          return { opacity: 0, y: 60 };
      }
    };

    const getFinalState = () => {
      switch (type) {
        case "fade-up":
          return { opacity: 1, y: 0 };
        case "fade-left":
          return { opacity: 1, x: 0 };
        case "fade-right":
          return { opacity: 1, x: 0 };
        case "scale":
          return { opacity: 1, scale: 1 };
        default:
          return { opacity: 1, y: 0 };
      }
    };

    // Set initial state for all elements
    elements.forEach((el) => {
      gsap.set(el, getInitialState());
    });

    // Create staggered animation
    const animation = gsap.to(elements, {
      ...getFinalState(),
      duration,
      delay,
      stagger: 0.15,
      ease: "power3.out",
      scrollTrigger: {
        trigger: elements[0],
        start: "top 85%",
        toggleActions: "play none none none",
        onEnter: () => {
          hasAnimated.current = true;
        }
      },
    });

    return () => {
      animation.kill();
    };
  }, [count, type, delay, duration]);

  return { setRef, refs };
}
