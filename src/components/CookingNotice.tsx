import { cn } from "@/lib/utils";

interface CookingNoticeProps {
  className?: string;
}

const CookingNotice = ({ className }: CookingNoticeProps) => (
  <p className={cn("cooking-notice", className)}>
    <span>something is cooking</span>
    <span className="cooking-notice__fill" aria-hidden="true">
      something is cooking
    </span>
  </p>
);

export default CookingNotice;
