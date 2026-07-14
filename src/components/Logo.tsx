import { IoFootball } from "react-icons/io5";

interface Props {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const sizes = {
  sm: { icon: "text-sm", text: "text-xs" },
  md: { icon: "text-lg", text: "text-base" },
  lg: { icon: "text-3xl", text: "text-2xl" },
};

export function Logo({ size = "md", showText = true }: Props) {
  const s = sizes[size];
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`${s.icon} relative`}>
        <IoFootball className="text-coral" />
        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-gold" />
      </span>
      {showText && (
        <span className={`${s.text} font-bold tracking-tight text-text-primary`}>
          Pulse<span className="text-coral">Cup</span>
        </span>
      )}
    </span>
  );
}
