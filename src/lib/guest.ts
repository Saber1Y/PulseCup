const GUEST_KEY = "pulsecup-guest-id";

export function getGuestProfileId(): string {
  if (typeof window === "undefined") return "guest";
  let id = localStorage.getItem(GUEST_KEY);
  if (!id) {
    id = `guest-${crypto.randomUUID().slice(0, 8)}`;
    localStorage.setItem(GUEST_KEY, id);
  }
  return id;
}
