import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Check, Plus, X } from "lucide-react";
import "./premium-waitlist.css";

interface PremiumWaitlistProps {
  isLoading: boolean;
}

const PremiumWaitlist = ({ isLoading }: PremiumWaitlistProps) => {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");
  const [arriving, setArriving] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasLoading = useRef(isLoading);
  const wasExpanded = useRef(expanded);
  const submittingRef = useRef(false);

  // The portal remains mounted while the loading screen becomes the canvas.
  useEffect(() => {
    const justLoaded = wasLoading.current && !isLoading;
    const justOpened = expanded && !wasExpanded.current;
    wasLoading.current = isLoading;
    wasExpanded.current = expanded;
    if (!expanded || dismissed || status === "success") return;
    if (justLoaded) setArriving(true);
    if (justOpened || !panelRef.current?.contains(document.activeElement)) {
      const nextInput = nameRef.current?.value.trim() ? emailRef.current : nameRef.current;
      nextInput?.focus({ preventScroll: true });
    }
  }, [expanded, isLoading, dismissed, status]);

  useEffect(() => {
    if (status === "success" && !dismissed) closeRef.current?.focus({ preventScroll: true });
  }, [status, dismissed]);

  useEffect(() => {
    if (dismissed) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Tab") setKeyboardFocus(true);
    };
    const handlePointer = (event: PointerEvent) => {
      setKeyboardFocus(false);
      // Release the arrival fog as soon as the pointer moves outside the panel,
      // even if it was already outside when loading finished.
      const rect = panelRef.current?.getBoundingClientRect();
      if (rect && (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom)) {
        setArriving(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    document.addEventListener("pointermove", handlePointer, { passive: true });
    document.addEventListener("pointerdown", handlePointer, { passive: true });
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.removeEventListener("pointermove", handlePointer);
      document.removeEventListener("pointerdown", handlePointer);
    };
  }, [dismissed]);

  const dismiss = () => {
    if (panelRef.current?.contains(document.activeElement)) {
      document.getElementById("premium-experience")?.focus({ preventScroll: true });
    }
    setDismissed(true);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submittingRef.current) return;
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      nameRef.current?.focus();
      return;
    }
    submittingRef.current = true;
    setStatus("submitting");
    setError("");
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: fullName.trim(), email: email.trim() }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) throw new Error("Signup was not saved");
      setStatus("success");
      setFullName("");
      setEmail("");
    } catch {
      setStatus("idle");
      setError("We couldn’t save your place. Please try again.");
    } finally {
      window.clearTimeout(timeout);
      submittingRef.current = false;
    }
  };

  if (dismissed) return null;

  return createPortal(
    <aside
      ref={panelRef}
      className="premium-waitlist"
      aria-label="Upcoming stores waitlist"
      data-arriving={arriving}
      data-keyboard-focus={keyboardFocus}
      onPointerLeave={() => setArriving(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          dismiss();
        }
      }}
    >
      <div className="premium-waitlist__header">
        {status === "success" ? (
          <p className="premium-waitlist__title"><Check size={14} aria-hidden="true" /> You’re on the list</p>
        ) : (
          <button
            type="button"
            className="premium-waitlist__toggle"
            aria-expanded={expanded}
            aria-controls="premium-waitlist-form"
            onClick={() => setExpanded((open) => !open)}
          >
            Join our waitlist
            <Plus size={13} className={expanded ? "is-expanded" : ""} aria-hidden="true" />
          </button>
        )}
        <button ref={closeRef} type="button" className="premium-waitlist__close" onClick={dismiss} aria-label="Close waitlist">
          <X size={15} aria-hidden="true" />
        </button>
      </div>

      {status === "success" ? (
        <p className="premium-waitlist__confirmation" role="status">
          You’re on the waitlist for the upcoming stores.
        </p>
      ) : (
        <div className="premium-waitlist__reveal" data-expanded={expanded} aria-hidden={!expanded} {...(!expanded ? { inert: "" } : {})}>
          <div>
            <form id="premium-waitlist-form" onSubmit={handleSubmit} aria-busy={status === "submitting"}>
              <label className="premium-waitlist__field">
                <span>Full name</span>
                <input ref={nameRef} name="fullName" autoComplete="name" required maxLength={120}
                  value={fullName} onChange={(event) => setFullName(event.target.value)}
                  readOnly={status === "submitting"} aria-describedby={error ? "premium-waitlist-error" : undefined} />
              </label>
              <label className="premium-waitlist__field">
                <span>Email address</span>
                <input ref={emailRef} name="email" type="email" autoComplete="email" required maxLength={254}
                  autoCapitalize="none" spellCheck={false} value={email}
                  onChange={(event) => setEmail(event.target.value)} readOnly={status === "submitting"}
                  aria-describedby={error ? "premium-waitlist-error" : undefined} />
              </label>
              {error && <p className="premium-waitlist__error" id="premium-waitlist-error" role="alert">{error}</p>}
              <button className="premium-waitlist__join" type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? "Joining…" : "Join"}<ArrowRight size={14} aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>
      )}
    </aside>,
    document.body,
  );
};

export default PremiumWaitlist;
