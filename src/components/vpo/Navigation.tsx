const Navigation = () => {
  return (
    <nav className="fixed top-10 left-0 right-0 z-40 px-8 py-6 flex items-start justify-between">
      {/* Logo */}
      <div className="flex flex-col">
        <span className="text-2xl font-serif font-medium tracking-tight text-foreground">VPO.</span>
        <span className="text-xs tracking-[0.2em] text-muted-foreground mt-1">EST. 2024</span>
      </div>

      {/* Right Nav */}
      <div className="flex flex-col items-end gap-3">
        <div className="flex items-center gap-10">
          {["Editorial", "Runway", "Spaces", "Account"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-sans text-foreground/90 hover:text-foreground transition-colors tracking-wide"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Secure Connection</span>
          <span className="w-2 h-2 rounded-full bg-vpo-secure animate-pulse" />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
