import { useState } from "react";

const WaitlistFooter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Email submitted:", email);
    setEmail("");
  };

  return (
    <footer className="relative z-10 bg-[#050505] border-t border-white/5">
      {/* Waitlist CTA */}
      <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white italic mb-6">
            Join the Vanguard.
          </h2>
          <p className="text-base text-white/40 font-sans leading-relaxed mb-10">
            Access is currently limited to waitlist members and partner invites. Secure your place in the queue.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder:text-white/30 font-sans text-sm focus:outline-none focus:border-white transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-white text-black text-sm tracking-[0.15em] uppercase font-sans hover:bg-white/90 transition-colors whitespace-nowrap"
            >
              Request Access
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30 font-sans">
              © 2024 VPO Labs.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-xs text-white/30 font-sans hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-xs text-white/30 font-sans hover:text-white transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-xs text-white/30 font-sans hover:text-white transition-colors"
              >
                Discord
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default WaitlistFooter;
