import { cn } from "@/lib/utils";

interface CookingNoticeProps {
  className?: string;
}

const CookingNotice = ({ className }: CookingNoticeProps) => (
  <h2 className={cn("cooking-notice", className)} aria-label="Something’s cooking">
    <span className="cooking-notice__base" aria-hidden="true">
      <span className="cooking-notice__line">something’s</span>
      <span className="cooking-notice__line cooking-notice__line--large">cooking</span>
    </span>
    <span className="cooking-notice__fill" aria-hidden="true">
      <span className="cooking-notice__line">something’s</span>
      <span className="cooking-notice__line cooking-notice__line--large">cooking</span>
    </span>
  </h2>
);

export default CookingNotice;
