import { Link } from "react-router-dom";

const Navigation = () => {
  const navItems = [
    { label: "Runway", href: "#runway", isRoute: false },
    { label: "Spaces", href: "#spaces", isRoute: false },
    { label: "Editorial", href: "/gallery", isRoute: true },
    { label: "Journal", href: "#journal", isRoute: false },
    { label: "Access", href: "#account", isRoute: false },
    { label: "VPO for Brands", href: "/vpo-business", isRoute: true },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 text-white transition-all duration-500 group border-b border-white/5 bg-transparent hover:backdrop-blur-md">
      <div className="md:px-12 flex h-24 max-w-[1920px] mx-auto px-6 items-center justify-between">
        {/* Brand */}
        <div className="flex-1">
          <Link to="/" className="text-2xl md:text-3xl font-serif italic tracking-tighter hover:opacity-70 transition-opacity">
            VPO.
          </Link>
        </div>

        {/* Central Menu */}
        <div className="hidden md:flex flex-1 justify-center gap-8 lg:gap-12">
          {navItems.map((item) => (
            item.isRoute ? (
              <Link
                key={item.label}
                to={item.href}
                className="text-[10px] uppercase tracking-[0.2em] font-medium hover:text-stone-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleSmoothScroll(e, item.href)}
                className="text-[10px] uppercase tracking-[0.2em] font-medium hover:text-stone-400 transition-colors"
              >
                {item.label}
              </a>
            )
          ))}
        </div>

        {/* Actions */}
        <div className="flex-1 flex justify-end items-center gap-6">
          <Link to="/vpo-business" className="md:hidden text-[9px] uppercase tracking-widest whitespace-nowrap">VPO for Brands</Link>
          <span className="hidden lg:block text-[10px] text-stone-400 uppercase tracking-widest">
            v.0.9 Beta
          </span>
          <button className="px-4 py-1.5 border border-white/20 text-[9px] uppercase tracking-widest hover:bg-white hover:text-black hover:border-white transition-all duration-300">
            Connect Wallet
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
