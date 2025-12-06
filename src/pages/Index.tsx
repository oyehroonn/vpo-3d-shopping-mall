import FrameSequence from "@/components/FrameSequence";
import TopTicker from "@/components/vpo/TopTicker";
import Navigation from "@/components/vpo/Navigation";
import ManifestoSection from "@/components/vpo/ManifestoSection";
import SpacesSection from "@/components/vpo/SpacesSection";
import CurrentSelectionSection from "@/components/vpo/CurrentSelectionSection";
import QuoteSection from "@/components/vpo/QuoteSection";
import Footer from "@/components/vpo/Footer";

const Index = () => {
  return (
    <main className="bg-background">
      <TopTicker />
      <Navigation />
      <FrameSequence />
      <ManifestoSection />
      <SpacesSection />
      <CurrentSelectionSection />
      <QuoteSection />
      <Footer />
    </main>
  );
};

export default Index;
