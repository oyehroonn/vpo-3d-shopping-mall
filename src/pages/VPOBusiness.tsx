import { resolveBrandDemoMode } from '@/components/brands/demoMode';

const VPOBusiness = () => {
  const preview = new URLSearchParams(window.location.search).get("preview");
  const params = new URLSearchParams({ demo: resolveBrandDemoMode() });
  if (preview) params.set('preview', preview);
  return (
    <iframe
      src={`/VPOBusiness.html?${params}`}
      title="VPO for Brands"
      allow="fullscreen"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
    />
  );
};

export default VPOBusiness;
