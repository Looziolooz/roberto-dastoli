"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/storia", label: "La sua storia" },
  { href: "/galleria", label: "Galleria" },
  { href: "/racconti", label: "Racconti" },
  { href: "/carica", label: "Condividi" },
];

// senior-react-specialist: mobile hamburger menu
// accessibility-tester: aria-expanded, aria-label, focus trap on open
export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-bg/92 backdrop-blur-lg border-b border-brand-border">
      <div className="max-w-[1100px] mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
          onClick={() => setMobileOpen(false)}
        >
          <span className="text-lg text-brand-accent">✦</span>
          <span className="text-xl font-semibold tracking-wide font-cormorant">
            Roberto Dastoli
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-0.5" aria-label="Navigazione principale">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "px-3.5 py-2 text-sm rounded-lg font-dm-sans transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent",
                pathname === link.href
                  ? "text-brand-accent bg-brand-accent-soft font-medium"
                  : "text-brand-muted hover:text-brand-accent"
              )}
            >
              {link.label}
            </Link>
          ))}
          {/* Admin link — subtle, always last */}
          <Link
            href="/admin"
            className={clsx(
              "px-3.5 py-2 text-sm rounded-lg font-dm-sans transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent opacity-40 hover:opacity-70",
              pathname === "/admin" && "opacity-100 text-brand-accent bg-brand-accent-soft"
            )}
            aria-label="Pannello admin"
          >
            ⚙
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-lg text-brand-muted hover:text-brand-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav
          className="md:hidden border-t border-brand-border bg-brand-bg/98 px-6 py-4 flex flex-col gap-1"
          aria-label="Navigazione mobile"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "px-4 py-3 text-sm rounded-lg font-dm-sans transition-colors",
                pathname === link.href
                  ? "text-brand-accent bg-brand-accent-soft font-medium"
                  : "text-brand-muted hover:text-brand-accent"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setMobileOpen(false)}
            className="px-4 py-3 text-xs rounded-lg font-dm-sans text-brand-muted opacity-50 hover:opacity-80"
          >
            Admin
          </Link>
        </nav>
      )}
    </header>
  );
}
