"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Story, Tag, MemoryTagJoin } from "@/types";
import { ScrollReveal } from "@/components/ScrollReveal";
import { X } from "lucide-react";

interface StoryWithTags extends Story {
  story_tags: { tag_id: string; tags: Tag }[];
}

export default function RaccontiPage() {
  const [stories, setStories] = useState<StoryWithTags[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedStory, setSelectedStory] = useState<StoryWithTags | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const [storiesRes, tagsRes] = await Promise.all([
        supabase
          .from("stories")
          .select("*, story_tags ( tag_id, tags ( id, name, icon ) )")
          .eq("is_approved", true)
          .order("created_at", { ascending: false }),
        supabase.from("tags").select("*").order("created_at", { ascending: true }),
      ]);
      setStories(storiesRes.data ?? []);
      setAllTags(tagsRes.data ?? []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredStories = selectedTag
    ? stories.filter((s) =>
        s.story_tags?.some((st) => st.tag_id === selectedTag)
      )
    : stories;

  const closeModal = useCallback(() => setSelectedStory(null), []);

  // accessibility-tester: Escape + scroll lock (mirrors galleria)
  useEffect(() => {
    if (!selectedStory) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedStory, closeModal]);

  return (
    <div className="space-y-8 pt-8">
      <ScrollReveal>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold text-brand-text font-cormorant">
            Racconti
          </h1>
          <p className="text-brand-muted font-dm-sans max-w-lg mx-auto">
            Le parole che portano il suo ricordo alive
          </p>
        </div>
      </ScrollReveal>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <ScrollReveal delay={0.1}>
          <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label="Filtra per categoria">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-dm-sans transition-colors ${
                selectedTag === null
                  ? "bg-brand-accent text-white"
                  : "bg-white text-brand-muted border border-brand-border hover:border-[#8B7355]"
              }`}
            >
              Tutti
            </button>
            {allTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setSelectedTag(tag.id === selectedTag ? null : tag.id)}
                className={`px-4 py-2 rounded-full text-sm font-dm-sans transition-colors ${
                  selectedTag === tag.id
                    ? "bg-brand-accent text-white"
                    : "bg-white text-brand-muted border border-brand-border hover:border-[#8B7355]"
                }`}
              >
                {tag.icon} {tag.name}
              </button>
            ))}
          </div>
        </ScrollReveal>
      )}

      {loading ? (
        <div className="text-center py-12 text-brand-muted">Caricamento...</div>
      ) : filteredStories.length === 0 ? (
        <div className="text-center py-12 text-brand-muted">
          {selectedTag ? "Nessun racconto in questa categoria." : "Nessun racconto ancora."}{" "}
          <a href="/carica" className="text-brand-accent hover:underline">
            Scrivi il primo
          </a>
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl mx-auto">
          {filteredStories.map((story, index) => (
            <ScrollReveal key={story.id} delay={index * 0.1}>
              <button
                className="w-full text-left bg-white rounded-xl p-6 shadow-sm border border-brand-border hover:border-[#8B7355] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2"
                onClick={() => setSelectedStory(story)}
                aria-label={`Leggi racconto: ${story.title}`}
              >
                <h3 className="text-xl font-semibold text-brand-text font-cormorant mb-2">
                  {story.title}
                </h3>
                <p className="text-brand-text font-cormorant line-clamp-3 mb-4">
                  {story.body}
                </p>
                <div className="flex items-center justify-between text-sm text-brand-muted font-dm-sans">
                  <span>
                    {story.is_anonymous ? "Anonimo" : story.author_name}
                  </span>
                  <span>
                    {new Date(story.created_at).toLocaleDateString("it-IT")}
                  </span>
                </div>
                {story.story_tags && story.story_tags.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {story.story_tags.map((st) => (
                      <span
                        key={st.tag_id}
                        className="text-xs bg-brand-accent-soft px-2 py-0.5 rounded-full"
                      >
                        {st.tags.icon} {st.tags.name}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            </ScrollReveal>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedStory && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="story-modal-title"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              autoFocus
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 rounded-full text-brand-muted hover:bg-brand-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent transition-colors"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>

            <h2
              id="story-modal-title"
              className="text-2xl font-semibold font-cormorant mb-4 pr-10"
            >
              {selectedStory.title}
            </h2>
            <div className="prose prose-lg font-cormorant text-brand-text whitespace-pre-wrap leading-relaxed">
              {selectedStory.body}
            </div>
            <div className="mt-6 pt-4 border-t border-brand-border space-y-3">
              {selectedStory.story_tags && selectedStory.story_tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {selectedStory.story_tags.map((st) => (
                    <span
                      key={st.tag_id}
                      className="bg-brand-accent-soft px-3 py-1 rounded-full text-sm"
                    >
                      {st.tags.icon} {st.tags.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-brand-muted font-dm-sans">
                  di{" "}
                  {selectedStory.is_anonymous
                    ? "Anonimo"
                    : selectedStory.author_name}
                </span>
                <span className="text-brand-muted font-dm-sans">
                  {new Date(selectedStory.created_at).toLocaleDateString("it-IT")}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
