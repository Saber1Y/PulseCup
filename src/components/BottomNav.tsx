"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Pulse", icon: "⚡" },
  { href: "/matches", label: "Matches", icon: "⚽" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on pulse room and replay pages
  if (pathname.startsWith("/matches/") || pathname.startsWith("/replay/")) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/5 bg-pitch/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 py-2">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
                isActive ? "text-green-accent" : "text-zinc-600"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
