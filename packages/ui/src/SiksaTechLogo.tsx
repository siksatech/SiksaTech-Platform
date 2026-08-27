import React from "react";

export interface SiksaTechLogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  className?: string;
  size?: number;
  variant?: "default" | "light" | "dark" | "monochrome" | "accent";
  siksaColor?: string;
  techColor?: string;
}

/**
 * SiksaTech Futuristic Rostex-style Vector Text Logo
 * Standard brand representation: "SIKSA" in Black (#000000) and "TECH" in Electric Blue (#2563EB).
 */
export default function SiksaTechLogo({
  className = "",
  size,
  variant = "default",
  siksaColor,
  techColor,
  ...props
}: SiksaTechLogoProps) {
  const style = size ? { fontSize: `${size}px`, ...props.style } : props.style;

  // Standard brand colors: SIKSA = Black (#000000), TECH = Blue (#2563EB)
  // When explicitly variant="light" (on dark backdrops/footers), SIKSA = White (#FFFFFF), TECH = Sky/Electric Blue (#38BDF8)
  const defaultSiksa = variant === "light" ? "#FFFFFF" : "#000000";
  const defaultTech = variant === "light" ? "#38BDF8" : "#2563EB";

  const finalSiksaColor = siksaColor || defaultSiksa;
  const finalTechColor = techColor || defaultTech;

  return (
    <span
      className={`select-none inline-flex items-center leading-none font-extrabold tracking-tight ${className}`}
      style={{ fontFamily: "'Rostex', sans-serif", ...style }}
      aria-label="SiksaTech Logo"
      role="img"
      {...props}
    >
      <span style={{ color: finalSiksaColor }}>SIKSA</span>
      <span style={{ color: finalTechColor }}>TECH</span>
    </span>
  );
}
