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
 * Strict Brand Rule: "SIKSA" is ALWAYS Black (#000000) and "TECH" is ALWAYS Electric Blue (#2563EB) everywhere.
 */
export default function SiksaTechLogo({
  className = "",
  size,
  variant,
  siksaColor,
  techColor,
  ...props
}: SiksaTechLogoProps) {
  const style = size ? { fontSize: `${size}px`, ...props.style } : props.style;

  // Strict Brand Rule: SIKSA = Black (#000000), TECH = Electric Blue (#2563EB)
  const finalSiksaColor = siksaColor || "#000000";
  const finalTechColor = techColor || "#2563EB";

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
