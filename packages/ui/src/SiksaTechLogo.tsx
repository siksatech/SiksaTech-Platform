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
  const style = size ? { height: `${size}px`, width: "auto", ...props.style } : props.style;

  return (
    <svg
      viewBox="0 0 780 110"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      style={style}
      aria-label="SiksaTech Logo"
      role="img"
      {...props}
    >
      {/* 
        SIKSATECH Rostex Typography
        S I K S A T E C H
      */}
      
      {/* --- S (Letter 1) --- */}
      <path
        d="M 28,15 
           L 70,15 
           C 78,15 82,19 82,27 
           L 82,41 
           C 82,49 78,53 70,53 
           L 36,53 
           C 32,53 30,55 30,59 
           L 30,81 
           C 30,85 32,87 36,87 
           L 80,87 
           C 82,87 84,89 84,91 
           L 84,99 
           C 84,101 82,103 80,103 
           L 26,103 
           C 18,103 14,99 14,91 
           L 14,75 
           C 14,67 18,63 26,63 
           L 60,63 
           C 64,63 66,61 66,57 
           L 66,37 
           C 66,33 64,31 60,31 
           L 18,31 
           C 16,31 14,29 14,27 
           L 14,19 
           C 14,17 16,15 18,15 
           Z"
      />

      {/* --- I (Letter 2) --- */}
      <rect x="96" y="15" width="16" height="88" rx="4" />

      {/* --- K (Letter 3) --- */}
      {/* Left Stem */}
      <rect x="124" y="15" width="16" height="88" rx="4" />
      {/* Top Diagonal */}
      <path
        d="M 140,55 
           L 182,18 
           C 185,15 188,15 194,15 
           L 199,15 
           C 202,15 203,17 201,20 
           L 158,58 
           Z"
      />
      {/* Bottom Diagonal */}
      <path
        d="M 152,52 
           L 196,98 
           C 198,100 197,103 194,103 
           L 183,103 
           C 178,103 174,101 170,97 
           L 138,62 
           Z"
      />

      {/* --- S (Letter 4) --- */}
      <path
        d="M 226,15 
           L 268,15 
           C 276,15 280,19 280,27 
           L 280,41 
           C 280,49 276,53 268,53 
           L 234,53 
           C 230,53 228,55 228,59 
           L 228,81 
           C 228,85 230,87 234,87 
           L 278,87 
           C 280,87 282,89 282,91 
           L 282,99 
           C 282,101 280,103 278,103 
           L 224,103 
           C 216,103 212,99 212,91 
           L 212,75 
           C 212,67 216,63 224,63 
           L 258,63 
           C 262,63 264,61 264,57 
           L 264,37 
           C 264,33 262,31 258,31 
           L 216,31 
           C 214,31 212,29 212,27 
           L 212,19 
           C 212,17 214,15 216,15 
           Z"
      />

      {/* --- A + T + E + C + H Continuous Top Bridge & Body Elements --- */}
      {/*
        Top Horizontal continuous beam connecting A, T, E, C, H
      */}
      <path
        d="M 314,15 
           L 758,15 
           C 766,15 770,19 770,27 
           L 770,42 
           C 770,45 767,47 764,47 
           L 752,47 
           C 749,47 748,45 748,42 
           L 748,31 
           L 316,31 
           C 310,31 306,27 306,23 
           L 306,19 
           C 306,16 309,15 314,15 
           Z"
      />

      {/* --- A (Body) --- */}
      {/* Left leg of A */}
      <path
        d="M 314,15 
           L 296,96 
           C 295,100 291,103 286,103 
           L 278,103 
           C 275,103 273,100 274,97 
           L 298,15 
           Z"
      />
      {/* Right leg of A */}
      <path
        d="M 326,27 
           C 334,27 338,32 342,39 
           L 364,96 
           C 366,100 363,103 358,103 
           L 348,103 
           C 344,103 340,100 338,96 
           L 332,80 
           L 304,80 
           L 300,96 
           C 299,99 296,103 292,103 
           Z
           M 307,66 
           L 327,66 
           L 320,44 
           Z"
      />

      {/* --- T (Vertical Stem) --- */}
      <rect x="414" y="27" width="16" height="76" rx="4" />

      {/* --- E (Body) --- */}
      {/* Left Stem */}
      <rect x="468" y="27" width="16" height="76" rx="4" />
      {/* Middle Bar */}
      <rect x="484" y="55" width="40" height="15" rx="3" />
      {/* Bottom Bar */}
      <path
        d="M 468,88 
           L 522,88 
           C 528,88 532,92 532,97 
           L 532,98 
           C 532,101 529,103 525,103 
           L 468,103 
           Z"
      />

      {/* --- C (Body) --- */}
      {/* Left wall and bottom curve */}
      <path
        d="M 560,27 
           L 560,91 
           C 560,99 565,103 574,103 
           L 620,103 
           C 625,103 628,99 628,94 
           L 628,83 
           C 628,80 625,78 622,78 
           L 610,78 
           C 607,78 606,80 606,83 
           L 606,88 
           L 582,88 
           C 578,88 576,86 576,82 
           L 576,31 
           L 560,31 
           Z"
      />

      {/* --- H (Body) --- */}
      {/* Left Stem */}
      <rect x="654" y="27" width="16" height="76" rx="4" />
      {/* Crossbar */}
      <rect x="670" y="55" width="46" height="15" rx="2" />
      {/* Right Stem */}
      <rect x="716" y="27" width="16" height="76" rx="4" />
    </svg>
  );
}
