const TopTicker = () => {
  const tickerContent = "THE NEW COLLECTION AVAILABLE NOW — VIRTUAL PREMIUM OUTLETS — NEW YORK • PARIS • TOKYO • MILAN — ";

  return (
    <div className="nav-ticker h-10 flex items-center">
      <div className="animate-ticker flex">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="inline-flex items-center gap-8 px-8 text-xs tracking-[0.2em] text-muted-foreground font-sans">
            {tickerContent}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TopTicker;
