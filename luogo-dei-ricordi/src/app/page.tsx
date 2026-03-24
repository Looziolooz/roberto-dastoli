import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createServerSupabaseClient();

  const [{ count: memoriesCount }, { count: storiesCount }, { data: latestStory }] = await Promise.all([
    supabase.from("memories").select("*", { count: "exact", head: true }).eq("is_approved", true),
    supabase.from("stories").select("*", { count: "exact", head: true }).eq("is_approved", true),
    supabase.from("stories").select("*").eq("is_approved", true).order("created_at", { ascending: false }).limit(1).single(),
  ]);

  return (
    <div className="space-y-20 pt-8">
      <ScrollReveal>
        <section className="text-center space-y-6 py-12">
          <div className="flex justify-center">
            <span className="text-5xl">✦</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-semibold text-[#2C2C2E] font-cormorant leading-tight">
            Luogo dei Ricordi
          </h1>
          <p className="text-xl text-[#8B7355] max-w-xl mx-auto font-cormorant italic">
            Uno spazio dove i ricordi diventano immortali
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link
              href="/galleria"
              className="px-6 py-3 bg-[#8B7355] text-white rounded-lg font-dm-sans font-medium hover:bg-[#7A6455] transition-colors"
            >
              Galleria
            </Link>
            <Link
              href="/carica"
              className="px-6 py-3 border border-[#8B7355] text-[#8B7355] rounded-lg font-dm-sans font-medium hover:bg-[rgba(139,115,85,0.08)] transition-colors"
            >
              Condividi un ricordo
            </Link>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <section className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-[#E5DFD7]">
            <div className="text-3xl font-semibold text-[#8B7355] font-cormorant">{memoriesCount ?? 0}</div>
            <div className="text-sm text-[#8E8E93] font-dm-sans">Foto</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-[#E5DFD7]">
            <div className="text-3xl font-semibold text-[#8B7355] font-cormorant">{storiesCount ?? 0}</div>
            <div className="text-sm text-[#8E8E93] font-dm-sans">Racconti</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-[#E5DFD7]">
            <div className="text-3xl font-semibold text-[#8B7355] font-cormorant">✦</div>
            <div className="text-sm text-[#8E8E93] font-dm-sans">Eterni</div>
          </div>
        </section>
      </ScrollReveal>

      {latestStory && (
        <ScrollReveal delay={0.4}>
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-[#E5DFD7]">
            <h2 className="text-2xl font-semibold text-[#2C2C2E] font-cormorant mb-4">L'ultimo racconto</h2>
            <h3 className="text-xl text-[#8B7355] font-cormorant mb-3">{latestStory.title}</h3>
            <p className="text-[#2C2C2E] font-cormorant leading-relaxed line-clamp-3">{latestStory.body}</p>
            <div className="mt-4 text-sm text-[#8E8E93] font-dm-sans">
              di {latestStory.is_anonymous ? "Anonimo" : latestStory.author_name}
            </div>
          </section>
        </ScrollReveal>
      )}

      <ScrollReveal delay={0.6}>
        <section className="text-center space-y-4 py-8">
          <h2 className="text-2xl font-semibold text-[#2C2C2E] font-cormorant">Vuoi lasciare un ricordo?</h2>
          <p className="text-[#8E8E93] max-w-md mx-auto font-dm-sans">
            Ogni foto e ogni parola contribuisce a costruire un mosaico di memorie che non svanirà mai.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/carica"
              className="px-5 py-2.5 bg-[#8B7355] text-white rounded-lg font-dm-sans text-sm hover:bg-[#7A6455] transition-colors"
            >
              Carica una foto
            </Link>
            <Link
              href="/racconti"
              className="px-5 py-2.5 border border-[#E5DFD7] text-[#8B7355] rounded-lg font-dm-sans text-sm hover:bg-[rgba(139,115,85,0.08)] transition-colors"
            >
              Leggi i racconti
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}