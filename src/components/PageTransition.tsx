import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { gsap } from "gsap";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Skip transition on initial load
    if (!isTransitioning && displayChildren !== children) {
      setIsTransitioning(true);
      
      // Animate out
      const tl = gsap.timeline({
        onComplete: () => {
          setDisplayChildren(children);
          window.scrollTo(0, 0);
          
          // Animate in
          gsap.fromTo(
            ".page-content",
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              onComplete: () => setIsTransitioning(false),
            }
          );
          
          gsap.fromTo(
            ".transition-overlay",
            { scaleY: 1 },
            {
              scaleY: 0,
              duration: 0.6,
              ease: "power4.inOut",
              transformOrigin: "top",
            }
          );
        },
      });

      tl.to(".page-content", {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in",
      });

      tl.to(
        ".transition-overlay",
        {
          scaleY: 1,
          duration: 0.5,
          ease: "power4.inOut",
          transformOrigin: "bottom",
        },
        "-=0.2"
      );
    } else if (!isTransitioning) {
      setDisplayChildren(children);
    }
  }, [children, location.pathname]);

  return (
    <>
      {/* Transition Overlay */}
      <div
        className="transition-overlay fixed inset-0 z-[100] bg-background pointer-events-none"
        style={{ transform: "scaleY(0)", transformOrigin: "bottom" }}
      />
      
      {/* Page Content */}
      <div className="page-content">
        {displayChildren}
      </div>
    </>
  );
};

export default PageTransition;
