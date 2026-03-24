"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Tag, MemoryWithTags } from "@/types";
import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function GalleriaPage() {
  const [memories, setMemories] = useState<MemoryWithTags[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<MemoryWithTags | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const [memRes, tagRes] = await Promise.all([
        supabase.from("memories").select("*, memory_tags ( tag_id, tags ( id, name, icon ) )").eq("is_approved", true).order("created_at", { ascending: false }),
        supabase.from("tags").select("*").order("created_at", { ascending: true }),
      ]);
      setMemories(memRes.data || []);
      setTags(tagRes.data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredMemories = selectedTag
    ? memories.filter(m => m.memory_tags?.some((mt: { tag_id: string }) => mt.tag_id === selectedTag))
    : memories;

  const allTags = Array.from(new Set(memories.flatMap(m => m.memory_tags?.map((mt: { tags: Tag }) => mt.tags).flat() || [])));

  return (
    <div className="space-y-8 pt-8">
      <ScrollReveal>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold text-[#2C2C2E] font-cormorant">Galleria</h1>
          <p className="text-[#8E8E93] font-dm-sans">
            Ogni immagine racconta una storia
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-dm-sans transition-colors ${
              selectedTag === null
                ? "bg-[#8B7355] text-white"
                : "bg-white text-[#8E8E93] border border-[#E5DFD7] hover:border-[#8B7355]"
            }`}
          >
            Tutte
          </button>
          {allTags.map(tag => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id === selectedTag ? null : tag.id)}
              className={`px-4 py-2 rounded-full text-sm font-dm-sans transition-colors ${
                selectedTag === tag.id
                  ? "bg-[#8B7355] text-white"
                  : "bg-white text-[#8E8E93] border border-[#E5DFD7] hover:border-[#8B7355]"
              }`}
            >
              {tag.icon} {tag.name}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {loading ? (
        <div className="text-center py-12 text-[#8E8E93]">Caricamento...</div>
      ) : filteredMemories.length === 0 ? (
        <div className="text-center py-12 text-[#8E8E93]">
          Nessuna foto {selectedTag ? "in questa categoria" : "ancora"}
        </div>
      ) : (
        <div className="masonry">
          {filteredMemories.map((memory, index) => (
            <ScrollReveal key={memory.id} delay={index * 0.05}>
              <div
                className="mb-4 break-inside-avoid cursor-pointer group"
                onClick={() => setSelectedImage(memory)}
              >
                <div className="relative rounded-xl overflow-hidden bg-white shadow-sm border border-[#E5DFD7]">
                  {memory.image_url ? (
                    <Image
                      src={memory.image_url}
                      alt={memory.caption}
                      width={400}
                      height={300}
                      className="w-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-[#F5F0EB] flex items-center justify-center">
                      <span className="text-4xl text-[#8B7355]">✦</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-cormorant text-sm line-clamp-2">{memory.caption}</p>
                    <div className="flex gap-1 mt-2">
                      {memory.memory_tags?.map((mt: { tag_id: string; tags: Tag }) => (
                        <span key={mt.tag_id} className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">
                          {mt.tags.icon}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white rounded-xl max-w-2xl w-full p-6" onClick={e => e.stopPropagation()}>
            {selectedImage.image_url && (
              <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={selectedImage.image_url}
                  alt={selectedImage.caption}
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <h3 className="text-xl font-semibold font-cormorant mb-2">{selectedImage.caption}</h3>
            <p className="text-sm text-[#8E8E93] font-dm-sans mb-4">
              di {selectedImage.author_name}
            </p>
            {selectedImage.memory_tags && selectedImage.memory_tags.length > 0 && (
              <div className="flex gap-2">
                {selectedImage.memory_tags.map((mt: { tag_id: string; tags: Tag }) => (
                  <span key={mt.tag_id} className="bg-[rgba(139,115,85,0.08)] px-3 py-1 rounded-full text-sm">
                    {mt.tags.icon} {mt.tags.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}