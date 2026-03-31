"use client";

import Link from "next/link";
import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";
import { HeroSection } from "@/components/HeroSection";
import { AnimatedCard } from "@/components/AnimatedCard";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Camera, BookOpen, Sparkles, Scroll, Image as ImageIcon, PenLine, ArrowRight } from "lucide-react";

export default function Home() {
  const [stats, setStats] = useState({ memoriesCount: 0, storiesCount: 0, latestStory: null as any });

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient();
      
      const [{ count: memoriesCount }, { count: storiesCount }, { data: latestStory }] = await Promise.all([
        supabase.from("memories").select("*", { count: "exact", head: true }).eq("is_approved", true),
        supabase.from("stories").select("*", { count: "exact", head: true }).eq("is_approved", true),
        supabase.from("stories").select("*").eq("is_approved", true).order("created_at", { ascending: false }).limit(1).maybeSingle(),
      ]);

      setStats({ 
        memoriesCount: memoriesCount ?? 0, 
        storiesCount: storiesCount ?? 0, 
        latestStory 
      });
    };
    fetchStats();
  }, []);

  const { memoriesCount, storiesCount, latestStory } = stats;

  return (
    <div className="space-y-0">
      {/* ── Hero ── */}
      <HeroSection />

      <div className="space-y-16 pt-16">
        {/* ── Stats ── */}
        <ScrollReveal delay={0.1}>
          <section className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { value: memoriesCount, label: "Foto", icon: Camera },
              { value: storiesCount, label: "Racconti", icon: BookOpen },
              { value: "∞", label: "Ricordi", icon: Sparkles },
            ].map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="text-center p-5 bg-white rounded-2xl shadow-sm border border-brand-border group hover:border-brand-accent-light transition-colors"
              >
                <Icon className="w-6 h-6 mx-auto mb-1 text-brand-accent opacity-60" />
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
          <Sparkles className="w-4 h-4 text-brand-accent-light" />
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
                icon: Scroll,
                title: "La sua storia",
                desc: "Un viaggio nei capitoli della sua vita, attraverso le foto che ci ha lasciato.",
              },
              {
                href: "/galleria",
                icon: ImageIcon,
                title: "Galleria",
                desc: "Tutte le foto condivise dalla famiglia e dagli amici, per ricordarlo sempre.",
              },
              {
                href: "/carica",
                icon: PenLine,
                title: "Condividi",
                desc: "Aggiungi un tuo ricordo, una foto o un pensiero per Roberto.",
              },
            ].map((item) => (
              <motion.div
                key={item.href}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
                }}
              >
                <AnimatedCard>
                  <Link
                    href={item.href}
                    className="block p-6 bg-white rounded-2xl shadow-sm border border-brand-border hover:border-brand-accent-light transition-colors h-full"
                  >
                    <item.icon className="w-8 h-8 mb-3 text-brand-accent" />
                    <h3 className="text-lg font-semibold text-brand-text font-cormorant mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-brand-muted font-dm-sans leading-relaxed">
                      {item.desc}
                    </p>
                  </Link>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.section>
        </ScrollReveal>

        {/* ── Latest story preview ── */}
        {latestStory && (
          <ScrollReveal delay={0.3}>
            <section className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-brand-text font-cormorant text-center mb-8">
                Ultimo racconto
              </h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-brand-border">
                <h3 className="text-xl font-semibold text-brand-text font-cormorant mb-4">
                  {latestStory.title}
                </h3>
                <p className="text-brand-muted font-cormorant text-lg leading-relaxed line-clamp-4">
                  {latestStory.body}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-brand-accent font-dm-sans">
                    {latestStory.is_anonymous ? "Anonimo" : latestStory.author_name}
                  </span>
                  <Link
                    href="/racconti"
                    className="text-sm text-brand-accent hover:underline font-dm-sans flex items-center gap-1"
                  >
                    Leggi tutto <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </section>
          </ScrollReveal>
        )}

        {/* ── Quote ── */}
        <ScrollReveal delay={0.4}>
          <section className="max-w-xl mx-auto text-center py-8">
            <blockquote className="text-2xl font-cormorant text-brand-text italic leading-relaxed">
              "Non piangere per la sua partenza, sii grato per il tempo che hai avuto."
            </blockquote>
          </section>
        </ScrollReveal>
      </div>
    </div>
  );
}
