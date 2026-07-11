"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/app/matches", label: "Matches", icon: "⚽" },
  { href: "/app/matches?tab=live", label: "Live", icon: "●" },
  { href: "/app/replay/1", label: "Replay", icon: "↺" },
  { href: "/app/profile", label: "Profile", icon: "◉" },
];

export default function AppBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-2">
        {tabs.map((t) => {
          const active = pathname.startsWith(t.href.split("?")[0]);
          return (
            <Link
              key={t.label}
              href={t.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                active ? "text-coral" : "text-text-secondary/50"
              }`}
            >
              <span className="text-lg">{t.icon}</span>
              <span className="text-[10px] font-medium">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
