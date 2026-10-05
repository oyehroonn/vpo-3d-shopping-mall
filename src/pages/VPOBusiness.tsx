const VPOBusiness = () => {
  const preview = new URLSearchParams(window.location.search).get("preview");
  return (
    <iframe
      src={`/VPOBusiness.html${preview ? `?preview=${encodeURIComponent(preview)}` : ""}`}
      title="VPO for Brands"
      allow="fullscreen"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: "none" }}
    />
  );
};

export default VPOBusiness;
