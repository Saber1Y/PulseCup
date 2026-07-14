const COUNTRY_FLAGS: Record<string, string> = {
  Argentina: "🇦🇷",
  Australia: "🇦🇺",
  Belgium: "🇧🇪",
  Brazil: "🇧🇷",
  Cameroon: "🇨🇲",
  Canada: "🇨🇦",
  Colombia: "🇨🇴",
  CostaRica: "🇨🇷",
  Croatia: "🇭🇷",
  Denmark: "🇩🇰",
  Ecuador: "🇪🇨",
  England: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  France: "🇫🇷",
  Germany: "🇩🇪",
  Ghana: "🇬🇭",
  Iran: "🇮🇷",
  Japan: "🇯🇵",
  Mexico: "🇲🇽",
  Morocco: "🇲🇦",
  Netherlands: "🇳🇱",
  Poland: "🇵🇱",
  Portugal: "🇵🇹",
  Qatar: "🇶🇦",
  SaudiArabia: "🇸🇦",
  Senegal: "🇸🇳",
  Serbia: "🇷🇸",
  SouthKorea: "🇰🇷",
  Spain: "🇪🇸",
  Switzerland: "🇨🇭",
  Tunisia: "🇹🇳",
  Uruguay: "🇺🇾",
  USA: "🇺🇸",
  Wales: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
};

export function teamFlag(name: string): string {
  return COUNTRY_FLAGS[name] ?? "";
}

export function TeamWithFlag({ name, className }: { name: string; className?: string }) {
  const flag = teamFlag(name);
  return (
    <span className={className}>
      {flag && <span className="mr-1">{flag}</span>}
      {name}
    </span>
  );
}
