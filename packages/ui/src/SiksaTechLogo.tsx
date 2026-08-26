import React from "react";

export interface SiksaTechLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
  variant?: "default" | "light" | "dark" | "monochrome" | "accent";
}

/**
 * SiksaTech Futuristic Rostex-style Vector Text Logo
 * Renders the custom geometric high-tech SIKSATECH wordmark with connected rooflines and rounded cyber-aesthetic glyphs.
 */
export default function SiksaTechLogo({
  className = "",
  size,
  variant = "default",
  ...props
}: SiksaTechLogoProps) {
  // Height and width handling if size is passed
  const style = size ? { fontSize: `${size}px`, ...props.style } : props.style;

  return (
    <span
      className={`select-none inline-block ${className}`}
      style={{ fontFamily: "'Rostex', sans-serif", ...style }}
      aria-label="SiksaTech Logo"
      role="img"
      {...props as any}
    >
      SIKSA<span style={{ color: "var(--color-electric-blue, #2563EB)" }}>TECH</span>
    </span>
  );
}
