import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "Editorial", href: "/gallery", isRoute: true },
    { label: "Runway", href: "#runway", isRoute: false },
    { label: "Spaces", href: "#spaces", isRoute: false },
    { label: "Journal", href: "#journal", isRoute: false },
    { label: "Access", href: "#account", isRoute: false },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 group border-b border-white/5 ${
        isScrolled
          ? "bg-black/80 backdrop-blur-md"
          : "bg-transparent hover:bg-black/80 hover:backdrop-blur-md"
      }`}
    >
      <div className="px-6 md:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex flex-col">
          <span className="text-xl md:text-2xl font-serif font-semibold tracking-tight text-white">
            VPO.
          </span>
          <span className="text-[10px] tracking-[0.25em] text-white/50 mt-0.5 font-sans">
            EST. 2024
          </span>
        </div>

        {/* Center Nav */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navItems.map((item) =>
            item.isRoute ? (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm font-sans text-white/70 hover:text-white transition-colors tracking-wide"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="text-sm font-sans text-white/70 hover:text-white transition-colors tracking-wide"
              >
                {item.label}
              </a>
            )
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <span className="hidden lg:inline text-[11px] tracking-[0.15em] text-white/40 font-sans">
            v.0.9 Beta
          </span>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] tracking-wide text-white/50 font-sans hidden sm:inline">
              Secure
            </span>
          </div>
          <button className="ml-2 px-4 py-2 border border-white/20 text-[11px] tracking-[0.15em] uppercase text-white/70 hover:bg-white hover:text-black transition-colors font-sans">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
