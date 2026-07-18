"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoFootball, IoRadioOutline, IoReloadOutline, IoPersonOutline, IoDocumentTextOutline } from "react-icons/io5";

const tabs = [
  { href: "/app/matches", label: "Matches", icon: IoFootball },
  { href: "/app/matches?tab=live", label: "Live", icon: IoRadioOutline },
  { href: "/app/replay/1", label: "Replay", icon: IoReloadOutline },
  { href: "/app/profile", label: "Profile", icon: IoPersonOutline },
  { href: "/docs", label: "Docs", icon: IoDocumentTextOutline },
];

export default function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = pathname.startsWith(t.href.split("?")[0]);
          return (
            <Link
              key={t.label}
              href={t.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                active ? "text-coral" : "text-text-secondary/50"
              }`}
            >
              <Icon className="text-lg" />
              <span className="text-[10px] font-medium">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
