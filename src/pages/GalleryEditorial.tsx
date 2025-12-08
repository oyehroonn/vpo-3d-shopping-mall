import { Link } from "react-router-dom";
import ExperienceContainer from "@/components/gallery/ExperienceContainer";
import EditorialSection from "@/components/gallery/EditorialSection";

const GalleryEditorial = () => {
  return (
    <div className="min-h-screen bg-light">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-light/90 backdrop-blur-sm border-b border-border/10">
        <div className="flex items-center justify-between px-6 md:px-12 py-4">
          <Link to="/" className="font-serif text-xl italic text-light tracking-wide">
            VPO.
          </Link>
          
          <div className="hidden md:flex items-center gap-12">
            <a href="#" className="font-sans text-xs tracking-[0.2em] text-light/70 uppercase hover:text-light transition-colors">
              Collections
            </a>
            <a href="#" className="font-sans text-xs tracking-[0.2em] text-light/70 uppercase hover:text-light transition-colors">
              Ateliers
            </a>
            <a href="#" className="font-sans text-xs tracking-[0.2em] text-light/70 uppercase hover:text-light transition-colors">
              Journal
            </a>
          </div>

          <button className="font-sans text-xs tracking-[0.15em] text-light uppercase px-5 py-2.5 border border-light/20 hover:bg-light/5 transition-colors">
            Connect Wallet
          </button>
        </div>
      </nav>

      {/* Section 1: Experience Left, Text Right */}
      <section className="min-h-screen pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-5rem)]">
          <ExperienceContainer 
            className="h-[50vh] lg:h-auto"
            labelText="Store Interior"
          />
          <div className="bg-light">
            <EditorialSection
              sectionNumber="01"
              sectionLabel="THE GALLERY"
              headline="Architectural"
              headlineItalic="Serenity"
              description="Spaces designed not just to house products, but to evoke emotion. Navigate through limestone corridors and floating displays in a render so precise, you can feel the texture of the walls."
              linkText="View Documentation"
              linkHref="#"
            />
          </div>
        </div>
      </section>

      {/* Section 2: Text Left, Experience Right */}
      <section className="min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          <div className="bg-light order-2 lg:order-1">
            <EditorialSection
              sectionNumber="02"
              sectionLabel="THE COLLECTION"
              headline="Maison"
              headlineItalic="Digitale"
              description="Couture without constraints. Our digital atelier allows for fabric physics that defy gravity. Inspect the weave of a garment from microscopic distances in our proprietary viewing engine."
              linkText="Open Catalogue"
              linkHref="#"
              features={[
                "High-fidelity texture scanning",
                "Volumetric garment capture"
              ]}
            />
          </div>
          <ExperienceContainer 
            className="h-[50vh] lg:h-auto order-1 lg:order-2"
            labelText="Atelier View"
          />
        </div>
      </section>

      {/* Section 3: Experience Left, Text Right */}
      <section className="min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          <ExperienceContainer 
            className="h-[50vh] lg:h-auto"
            labelText="Private Showroom"
          />
          <div className="bg-light">
            <EditorialSection
              sectionNumber="03"
              sectionLabel="MEMBERSHIP"
              headline="Private"
              headlineItalic="Access"
              description="Members receive priority entry to limited drops and private viewing rooms. A seamless integration of ownership and experience."
              linkText="Inquire for Membership"
              linkHref="#"
            />
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-light border-t border-border/10 py-16 px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-serif text-lg italic text-light/60">VPO.</span>
          <p className="font-sans text-xs tracking-widest text-light/40 uppercase">
            © 2024 Virtual Premium Outlets
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GalleryEditorial;
