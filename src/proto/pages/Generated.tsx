import type { MouseEvent, ReactNode } from "react";
import Tracking from "../../screens/Tracking";
import TrackingCustoms from "../../screens/TrackingCustoms";
import { useProto } from "../store";

/**
 * Content-heavy screens (tracking, customs) are rendered from the design canvas as they are,
 * and their links, tabs and menu are wired up here by label.
 */
function Wired({ children, extra = {} }: { children: ReactNode; extra?: Record<string, () => void> }) {
  const { go, setUi, toast } = useProto();
  const actions: Record<string, () => void> = {
    "Back to bookings": () => go("bookings"),
    "Back to My bookings": () => go("bookings"),
    "My bookings": () => go("bookings"),
    "New booking": () => go("step1", { fresh: true }),
    "Search AWB or booking": () => {
      go("bookings");
      setUi({ searchOpen: true });
    },
    ...extra,
  };
  const onClick = (e: MouseEvent) => {
    const el = e.target as HTMLElement;
    if (el.closest("a")) e.preventDefault();
    // Walk up a few levels to find an element whose label is a known action
    let node: HTMLElement | null = el;
    for (let i = 0; node && i < 4; i++, node = node.parentElement) {
      const label = node.textContent?.trim() ?? "";
      const hit = Object.keys(actions).find((k) => label === k || (label.startsWith(k) && label.length < k.length + 3));
      if (hit) {
        actions[hit]();
        return;
      }
    }
    const btn = el.closest("button, a");
    if (btn) toast(`“${btn.textContent?.trim()}” isn't part of this prototype.`);
  };
  return (
    <div className="p-wired" onClick={onClick}>
      {children}
    </div>
  );
}

export function TrackingPage() {
  const { ui, setUi } = useProto();
  return (
    <Wired extra={{ Details: () => setUi({ trackingTab: "details" }), Map: () => setUi({ trackingTab: "map" }) }}>
      <Tracking tab={ui.trackingTab} scenario={ui.scenario} />
    </Wired>
  );
}

export function CustomsPage() {
  const { toast } = useProto();
  return (
    <Wired extra={{ "Upload certificate": () => toast("Certificate uploaded. Customs usually reviews it within 4 hours.") }}>
      <TrackingCustoms />
    </Wired>
  );
}
