import Image from "next/image";

export default function SiksaTechLogo({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="SiksaTech"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      priority
    />
  );
}
