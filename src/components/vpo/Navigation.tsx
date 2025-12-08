import { Link } from "react-router-dom";

const Navigation = () => {
  const navItems = [
    { label: "Editorial", href: "/gallery" },
    { label: "Runway", href: "#" },
    { label: "Spaces", href: "#" },
    { label: "Account", href: "#" },
  ];

  return (
    <nav className="fixed top-8 left-0 right-0 z-40 px-6 md:px-10 py-4 flex items-start justify-between">
      {/* Logo */}
      <div className="flex flex-col">
        <span className="text-xl md:text-2xl font-serif font-semibold tracking-tight text-foreground">VPO.</span>
        <span className="text-[10px] tracking-[0.25em] text-foreground/50 mt-0.5 font-sans">EST. 2024</span>
      </div>

      {/* Right Nav */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-6 md:gap-10">
          {navItems.map((item) => (
            item.href.startsWith("/") ? (
              <Link
                key={item.label}
                to={item.href}
                className="text-sm font-sans text-foreground/80 hover:text-foreground transition-colors tracking-wide"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-sans text-foreground/80 hover:text-foreground transition-colors tracking-wide"
              >
                {item.label}
              </a>
            )
          ))}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-foreground/50">
          <span className="tracking-wide">Secure Connection</span>
          <span className="w-1.5 h-1.5 rounded-full bg-vpo-secure" />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
