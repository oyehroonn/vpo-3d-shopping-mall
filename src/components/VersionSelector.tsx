import CookingNotice from "./CookingNotice";

interface VersionSelectorProps {
  onSelect: (version: 'premium' | 'lite') => void;
}

const VersionSelector = ({ onSelect }: VersionSelectorProps) => {
  return (
    <div className="version-selector">
      <div className="version-selector__content">
        <header>
          <h1 className="version-selector__brand font-display text-foreground">
            VIRTUAL PREMIUM OUTLETS
          </h1>
        </header>

        <CookingNotice />

        <div className="version-selector__choices">
          <p id="experience-label" className="version-selector__prompt">
            SELECT YOUR EXPERIENCE
          </p>
          <div className="version-selector__options" role="group" aria-labelledby="experience-label">
            <button
              type="button"
              onClick={() => onSelect('premium')}
              className="version-selector__option"
            >
              <span className="version-selector__option-name">PREMIUM</span>
              <span className="version-selector__connection">REQUIRES FAST INTERNET</span>
            </button>

            <button
              type="button"
              onClick={() => onSelect('lite')}
              className="version-selector__option"
            >
              <span className="version-selector__option-name">LITE</span>
              <span className="version-selector__connection">INSTANT LOADING</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VersionSelector;
