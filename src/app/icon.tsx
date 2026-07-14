import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="#090711" stroke="#FF4D6D" strokeWidth="2" />
        <path d="M16 6 C12 6 8 9 8 16 C8 23 12 26 16 26 C20 26 24 23 24 16 C24 9 20 6 16 6Z" fill="none" stroke="#FF4D6D" strokeWidth="1.5" />
        <path d="M10 16 L14 12 L18 18 L22 14" stroke="#FFD166" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10.5" cy="10.5" r="1.5" fill="#8B5CF6" />
        <circle cx="21.5" cy="21.5" r="1.5" fill="#38F2A8" />
      </svg>
    ),
    { ...size },
  );
}
