import type { Metadata } from "next";
import AppBottomNav from "@/components/AppBottomNav";

export const metadata: Metadata = {
  title: "PulseCup — Live Match Room",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-screen max-w-lg pb-20">
      {children}
      <AppBottomNav />
    </div>
  );
}
