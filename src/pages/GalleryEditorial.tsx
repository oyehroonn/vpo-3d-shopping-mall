import { Link } from "react-router-dom";
import ExperienceContainer from "@/components/gallery/ExperienceContainer";
import EditorialSection from "@/components/gallery/EditorialSection";

const GalleryEditorial = () => {
  return (
    <div 
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, hsl(40 15% 96%) 0%, hsl(38 12% 94%) 50%, hsl(36 10% 93%) 100%)"
      }}
    >
      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-[hsl(30_8%_80%/0.5)]"
        style={{
          background: "linear-gradient(180deg, hsl(40 15% 96%/0.95) 0%, hsl(38 12% 94%/0.9) 100%)"
        }}
      >
        <div className="flex items-center justify-between px-8 md:px-16 py-5">
          <Link to="/" className="font-serif text-2xl italic text-[hsl(30_10%_18%)] tracking-wide">
            VPO.
          </Link>
          
          <div className="hidden md:flex items-center gap-16">
            <a href="#" className="font-sans text-[11px] tracking-[0.25em] text-[hsl(30_6%_40%)] uppercase hover:text-[hsl(30_8%_20%)] transition-colors duration-300">
              Collections
            </a>
            <a href="#" className="font-sans text-[11px] tracking-[0.25em] text-[hsl(30_6%_40%)] uppercase hover:text-[hsl(30_8%_20%)] transition-colors duration-300">
              Ateliers
            </a>
            <a href="#" className="font-sans text-[11px] tracking-[0.25em] text-[hsl(30_6%_40%)] uppercase hover:text-[hsl(30_8%_20%)] transition-colors duration-300">
              Journal
            </a>
          </div>

          <button className="font-sans text-[11px] tracking-[0.2em] text-[hsl(30_10%_18%)] uppercase px-6 py-3 border border-[hsl(30_8%_70%)] hover:bg-[hsl(30_8%_90%)] hover:border-[hsl(30_8%_50%)] transition-all duration-300">
            Connect Wallet
          </button>
        </div>
      </nav>

      {/* Section 1: Experience Left, Text Right */}
      <section className="min-h-screen pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-6rem)]">
          <ExperienceContainer 
            className="h-[55vh] lg:h-auto"
            labelText="Store Interior"
            isPrimary={true}
          />
          <div 
            style={{
              background: "linear-gradient(135deg, hsl(40 15% 97%) 0%, hsl(38 12% 95%) 100%)"
            }}
          >
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

      {/* Horizontal divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[hsl(30_8%_75%)] to-transparent" />

      {/* Section 2: Text Left, Experience Right */}
      <section className="min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          <div 
            className="order-2 lg:order-1"
            style={{
              background: "linear-gradient(225deg, hsl(40 15% 97%) 0%, hsl(38 12% 95%) 100%)"
            }}
          >
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
            className="h-[55vh] lg:h-auto order-1 lg:order-2"
            labelText="Atelier View"
          />
        </div>
      </section>

      {/* Horizontal divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[hsl(30_8%_75%)] to-transparent" />

      {/* Section 3: Experience Left, Text Right */}
      <section className="min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          <ExperienceContainer 
            className="h-[55vh] lg:h-auto"
            labelText="Private Showroom"
          />
          <div 
            style={{
              background: "linear-gradient(135deg, hsl(40 15% 97%) 0%, hsl(38 12% 95%) 100%)"
            }}
          >
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

      {/* Elegant Footer */}
      <footer 
        className="border-t border-[hsl(30_8%_80%/0.5)] py-20 px-8 md:px-16"
        style={{
          background: "linear-gradient(180deg, hsl(38 12% 94%) 0%, hsl(36 10% 92%) 100%)"
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <span className="font-serif text-2xl italic text-[hsl(30_8%_30%)]">VPO.</span>
          <div className="flex items-center gap-12">
            <a href="#" className="font-sans text-[10px] tracking-[0.25em] text-[hsl(30_6%_50%)] uppercase hover:text-[hsl(30_8%_30%)] transition-colors">
              Privacy
            </a>
            <a href="#" className="font-sans text-[10px] tracking-[0.25em] text-[hsl(30_6%_50%)] uppercase hover:text-[hsl(30_8%_30%)] transition-colors">
              Terms
            </a>
            <a href="#" className="font-sans text-[10px] tracking-[0.25em] text-[hsl(30_6%_50%)] uppercase hover:text-[hsl(30_8%_30%)] transition-colors">
              Contact
            </a>
          </div>
          <p className="font-sans text-[10px] tracking-[0.2em] text-[hsl(30_6%_55%)] uppercase">
            © 2024 Virtual Premium Outlets
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GalleryEditorial;