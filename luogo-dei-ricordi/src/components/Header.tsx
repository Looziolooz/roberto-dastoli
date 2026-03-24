"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/storia", label: "La sua storia" },
  { href: "/galleria", label: "Galleria" },
  { href: "/racconti", label: "Racconti" },
  { href: "/carica", label: "Carica" },
  { href: "/admin", label: "Admin" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-[#F5F0EB]/92 backdrop-blur-lg border-b border-[#E5DFD7]">
      <div className="max-w-[1100px] mx-auto px-6 py-3.5 flex items-center justify-between flex-wrap gap-2">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg text-[#8B7355]">✦</span>
          <span className="text-xl font-semibold tracking-wide font-cormorant">
            Luogo dei Ricordi
          </span>
        </Link>

        <nav className="flex gap-0.5 flex-wrap">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "px-3.5 py-2 text-sm rounded-lg font-dm-sans transition-all",
                pathname === link.href
                  ? "text-[#8B7355] bg-[rgba(139,115,85,0.08)] font-medium"
                  : "text-[#8E8E93] hover:text-[#8B7355]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}