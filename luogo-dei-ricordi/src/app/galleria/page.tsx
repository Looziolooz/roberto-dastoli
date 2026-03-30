"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Tag, MemoryWithTags, MemoryTagJoin } from "@/types";
import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";
import { InlineLightbox } from "@/components/InlineLightbox";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function GalleriaPage() {
  const [memories, setMemories] = useState<MemoryWithTags[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const [memRes, tagsRes] = await Promise.all([
        supabase
          .from("memories")
          .select("*, memory_tags ( tag_id, tags ( id, name, icon ) )")
          .eq("is_approved", true)
          .order("created_at", { ascending: false }),
        supabase.from("tags").select("*").order("created_at", { ascending: true }),
      ]);
      setMemories(memRes.data ?? []);
      setAllTags(tagsRes.data ?? []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredMemories = selectedTag
    ? memories.filter((m) =>
        m.memory_tags?.some((mt: MemoryTagJoin) => mt.tag_id === selectedTag)
      )
    : memories;

  const openLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const closeLightbox = useCallback(() => setSelectedIndex(null), []);

  const navigateLightbox = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft" && selectedIndex > 0) navigateLightbox(selectedIndex - 1);
      if (e.key === "ArrowRight" && selectedIndex < filteredMemories.length - 1) navigateLightbox(selectedIndex + 1);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex, closeLightbox, navigateLightbox, filteredMemories.length]);

  return (
    <div className="space-y-8 pt-8 pb-16">
      <ScrollReveal>
        <div className="text-center space-y-4 px-4">
          <h1 className="text-4xl font-semibold text-brand-text font-cormorant">
            Galleria
          </h1>
          <p className="text-brand-muted font-dm-sans">
            Ogni immagine racconta una storia
          </p>
        </div>
      </ScrollReveal>

      {/* Tag filters */}
      <ScrollReveal delay={0.1}>
        <div className="flex flex-wrap gap-2 justify-center px-4">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-dm-sans transition-all ${
              selectedTag === null
                ? "bg-brand-accent text-white shadow-md"
                : "bg-white text-brand-muted border border-brand-border hover:border-brand-accent hover:shadow-sm"
            }`}
          >
            Tutte
          </button>
          {allTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id === selectedTag ? null : tag.id)}
              className={`px-4 py-2 rounded-full text-sm font-dm-sans transition-all ${
                selectedTag === tag.id
                  ? "bg-brand-accent text-white shadow-md"
                  : "bg-white text-brand-muted border border-brand-border hover:border-brand-accent hover:shadow-sm"
              }`}
            >
              {tag.icon} {tag.name}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Pinterest-style Masonry Grid */}
      {loading ? (
        <div className="text-center py-12 text-brand-muted">Caricamento...</div>
      ) : filteredMemories.length === 0 ? (
        <div className="text-center py-12 text-brand-muted">
          Nessuna foto {selectedTag ? "in questa categoria" : "ancora"}
        </div>
      ) : (
        <div className="px-4">
          <div className="max-w-7xl mx-auto">
            {/* Pinterest Grid */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {filteredMemories.map((memory, index) => (
                <motion.div
                  key={memory.id}
                  className="break-inside-avoid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: Math.min(index * 0.03, 0.5),
                    ease: "easeOut" 
                  }}
                >
                  <motion.button
                    className="w-full text-left group relative block overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-xl transition-shadow duration-300"
                    onClick={() => openLightbox(index)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Image */}
                    {memory.image_url ? (
                      <Image
                        src={memory.image_url}
                        alt={memory.caption || "Foto"}
                        width={400}
                        height={500}
                        className="w-full object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        priority={index < 4}
                        loading={index < 4 ? "eager" : "lazy"}
                      />
                    ) : (
                      <div className="w-full aspect-[4/5] bg-brand-bg flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-brand-accent" />
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Caption on Hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      {memory.caption && (
                        <p className="text-white font-cormorant text-sm line-clamp-2 mb-2">
                          {memory.caption}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        {memory.author_name && (
                          <span className="text-white/80 text-xs">
                            {memory.author_name}
                          </span>
                        )}
                        {memory.memory_tags && memory.memory_tags.length > 0 && (
                          <div className="flex gap-1 ml-auto">
                            {memory.memory_tags.slice(0, 3).map((mt: MemoryTagJoin) => (
                              <span 
                                key={mt.tag_id} 
                                className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-[10px]"
                              >
                                {mt.tags.icon}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pin Button Effect */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 text-brand-accent" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                        </svg>
                      </div>
                    </div>
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inline Lightbox */}
      {selectedIndex !== null && (
        <InlineLightbox
          memories={filteredMemories}
          selectedIndex={selectedIndex}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}
    </div>
  );
}
