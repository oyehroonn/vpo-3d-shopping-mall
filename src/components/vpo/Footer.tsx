const Footer = () => {
  return (
    <footer className="bg-background grain-overlay pt-24 pb-16 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
          {/* Newsletter */}
          <div className="md:col-span-1">
            <h3 className="text-3xl font-serif font-light text-foreground mb-10">Stay Connected</h3>
            <div className="flex items-center border-b border-border/40 pb-3">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 bg-transparent text-lg text-foreground placeholder:text-muted-foreground focus:outline-none font-serif"
              />
              <button className="text-sm font-sans tracking-[0.15em] text-foreground hover:text-muted-foreground transition-colors">
                SUBSCRIBE
              </button>
            </div>
          </div>

          {/* Sitemap */}
          <div>
            <h4 className="text-xs tracking-[0.25em] text-muted-foreground font-sans mb-8">SITEMAP</h4>
            <nav className="space-y-5">
              {["Experience", "Brands", "Journal", "Careers"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-xl font-serif text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs tracking-[0.25em] text-muted-foreground font-sans mb-8">SOCIAL</h4>
            <nav className="space-y-5">
              {["Instagram", "Twitter", "LinkedIn"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-xl font-serif text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/30 pt-16 flex flex-col md:flex-row items-end justify-between gap-8">
          {/* Large VPO logo */}
          <div className="text-[8rem] md:text-[12rem] font-serif font-light leading-none text-foreground/10 select-none">
            VPO.
          </div>

          {/* Legal links */}
          <div className="flex items-center gap-12 text-xs tracking-[0.15em] text-muted-foreground font-sans">
            <a href="#" className="hover:text-foreground transition-colors">PRIVACY POLICY</a>
            <a href="#" className="hover:text-foreground transition-colors">TERMS OF USE</a>
            <span>© 2024</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
