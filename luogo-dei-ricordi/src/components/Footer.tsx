import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-border py-10 mt-8">
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Quote */}
        <p className="text-brand-accent font-cormorant text-xl italic text-center mb-6">
          "I ricordi più belli non svaniscono, cambiano solo casa."
        </p>

        {/* Nav links */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-6" aria-label="Footer navigation">
          {[
            { href: "/storia", label: "La sua storia" },
            { href: "/galleria", label: "Galleria" },
            { href: "/racconti", label: "Racconti" },
            { href: "/carica", label: "Condividi un ricordo" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-brand-muted font-dm-sans hover:text-brand-accent transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="flex items-center justify-center gap-3 text-xs text-brand-muted font-dm-sans">
          <span>✦</span>
          <span>Un luogo dedicato a chi non dimentichiamo mai</span>
          <span>✦</span>
        </div>
        <div className="flex items-center justify-center gap-1 text-xs text-brand-muted font-dm-sans mt-3">
          <span>Fatto con</span>
          <span>❤️</span>
          <span>da</span>
          <a
            href="https://www.facebook.com/looziolooz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-accent hover:underline"
          >
            Lorenzo
          </a>
        </div>
      </div>
    </footer>
  );
}
