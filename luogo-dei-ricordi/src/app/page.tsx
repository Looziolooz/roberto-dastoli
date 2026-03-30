import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HeroSection } from "@/components/HeroSection";
import { AnimatedCard } from "@/components/AnimatedCard";
import { motion } from "framer-motion";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// frontend-design: memorial homepage — warm, intimate, Italian aesthetic
// Hero: large photo with warm overlay, golden accent text
// Stats section: memories count
// Latest story preview

export default async function Home() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: memoriesCount },
    { count: storiesCount },
    { data: latestStory },
  ] = await Promise.all([
    supabase
      .from("memories")
      .select("*", { count: "exact", head: true })
      .eq("is_approved", true),
    supabase
      .from("stories")
      .select("*", { count: "exact", head: true })
      .eq("is_approved", true),
    supabase
      .from("stories")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return (
    <div className="space-y-0">
      {/* ── Hero ── */}
      <HeroSection />

      <div className="space-y-16 pt-16">
        {/* ── Stats ── */}
        <ScrollReveal delay={0.1}>
          <section className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { value: memoriesCount ?? 0, label: "Foto", icon: "📷" },
              { value: storiesCount ?? 0, label: "Racconti", icon: "📖" },
              { value: "∞", label: "Ricordi", icon: "✦" },
            ].map(({ value, label, icon }) => (
              <div
                key={label}
                className="text-center p-5 bg-white rounded-2xl shadow-sm border border-brand-border group hover:border-brand-accent-light transition-colors"
              >
                <div className="text-xl mb-1 opacity-60">{icon}</div>
                <div className="text-3xl font-semibold text-brand-accent font-cormorant">
                  {value}
                </div>
                <div className="text-xs text-brand-muted font-dm-sans mt-1 uppercase tracking-wide">
                  {label}
                </div>
              </div>
            ))}
          </section>
        </ScrollReveal>

        {/* ── Divider ── */}
        <div className="flex items-center gap-4 max-w-md mx-auto">
          <div className="flex-1 h-px bg-brand-border" />
          <span className="text-brand-accent-light text-lg">✦</span>
          <div className="flex-1 h-px bg-brand-border" />
        </div>

        {/* ── Navigation cards ── */}
        <ScrollReveal delay={0.2}>
          <motion.section
            className="grid md:grid-cols-3 gap-4"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {[
              {
                href: "/storia",
                icon: "📜",
                title: "La sua storia",
                desc: "Un viaggio nei capitoli della sua vita, attraverso le foto che ci ha lasciato.",
              },
              {
                href: "/galleria",
                icon: "🖼️",
                title: "Galleria",
                desc: "Tutte le foto condivise dalla famiglia e dagli amici, per ricordarlo sempre.",
              },
              {
                href: "/racconti",
                icon: "✍️",
                title: "Racconti",
                desc: "Le parole di chi lo ha voluto bene — storie, aneddoti, pensieri.",
              },
            ].map(({ href, icon, title, desc }) => (
              <motion.div
                key={href}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
                }}
              >
                <AnimatedCard>
                  <Link
                    href={href}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border hover:border-brand-accent-light hover:shadow-md transition-all group block"
                  >
                    <div className="text-2xl mb-3 opacity-70 group-hover:opacity-100 transition-opacity">
                      {icon}
                    </div>
                    <h3 className="text-lg font-semibold text-brand-text font-cormorant mb-2 group-hover:text-brand-accent transition-colors">
                      {title}
                    </h3>
                    <p className="text-sm text-brand-muted font-dm-sans leading-relaxed">
                      {desc}
                    </p>
                  </Link>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.section>
        </ScrollReveal>

        {/* ── Latest story ── */}
        {latestStory && (
          <ScrollReveal delay={0.3}>
            <section className="bg-white rounded-2xl p-8 shadow-sm border border-brand-border max-w-2xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-brand-accent opacity-50 text-lg">✦</span>
                <span className="text-xs text-brand-muted font-dm-sans uppercase tracking-widest">
                  L'ultimo racconto
                </span>
              </div>
              <h3 className="text-2xl text-brand-accent font-cormorant mb-3 font-semibold">
                {latestStory.title}
              </h3>
              <p className="text-brand-text font-cormorant leading-relaxed line-clamp-4 text-lg">
                {latestStory.body}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-brand-muted font-dm-sans">
                  di {latestStory.is_anonymous ? "Anonimo" : latestStory.author_name}
                </span>
                <Link
                  href="/racconti"
                  className="text-sm text-brand-accent font-dm-sans hover:underline"
                >
                  Leggi tutti i racconti →
                </Link>
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* ── CTA ── */}
        <ScrollReveal delay={0.4}>
          <section className="text-center space-y-4 py-8 border-t border-brand-border">
            <h2 className="text-2xl font-semibold text-brand-text font-cormorant">
              Hai un ricordo da condividere?
            </h2>
            <p className="text-brand-muted max-w-md mx-auto font-dm-sans text-sm leading-relaxed">
              Ogni foto e ogni parola contribuisce a costruire un mosaico di
              memorie che non svanirà mai.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/carica"
                className="px-5 py-2.5 bg-brand-accent text-white rounded-lg font-dm-sans text-sm hover:bg-brand-accent/80 transition-colors"
              >
                Carica una foto
              </Link>
              <Link
                href="/carica"
                className="px-5 py-2.5 border border-brand-border text-brand-accent rounded-lg font-dm-sans text-sm hover:bg-brand-accent-soft transition-colors"
              >
                Scrivi un racconto
              </Link>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
