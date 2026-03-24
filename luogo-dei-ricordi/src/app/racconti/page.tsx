"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Story } from "@/types";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function RaccontiPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("stories").select("*").eq("is_approved", true).order("created_at", { ascending: false });
      setStories(data || []);
      setLoading(false);
    };
    fetchStories();
  }, []);

  return (
    <div className="space-y-8 pt-8">
      <ScrollReveal>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold text-[#2C2C2E] font-cormorant">Racconti</h1>
          <p className="text-[#8E8E93] font-dm-sans max-w-lg mx-auto">
            Le parole che portano il suo ricordo alive
          </p>
        </div>
      </ScrollReveal>

      {loading ? (
        <div className="text-center py-12 text-[#8E8E93]">Caricamento...</div>
      ) : stories.length === 0 ? (
        <div className="text-center py-12 text-[#8E8E93]">
          Nessun racconto ancora. <a href="/carica" className="text-[#8B7355] hover:underline">Scrivi il primo</a>
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl mx-auto">
          {stories.map((story, index) => (
            <ScrollReveal key={story.id} delay={index * 0.1}>
              <div 
                className="bg-white rounded-xl p-6 shadow-sm border border-[#E5DFD7] cursor-pointer hover:border-[#8B7355] transition-colors"
                onClick={() => setSelectedStory(story)}
              >
                <h3 className="text-xl font-semibold text-[#2C2C2E] font-cormorant mb-2">{story.title}</h3>
                <p className="text-[#2C2C2E] font-cormorant line-clamp-3 mb-4">{story.body}</p>
                <div className="flex items-center justify-between text-sm text-[#8E8E93] font-dm-sans">
                  <span>{story.is_anonymous ? "Anonimo" : story.author_name}</span>
                  <span>{new Date(story.created_at).toLocaleDateString("it-IT")}</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

      {selectedStory && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedStory(null)}
        >
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl font-semibold font-cormorant mb-4">{selectedStory.title}</h2>
            <div className="prose prose-lg font-cormorant text-[#2C2C2E] whitespace-pre-wrap leading-relaxed">
              {selectedStory.body}
            </div>
            <div className="mt-6 pt-4 border-t border-[#E5DFD7] flex items-center justify-between">
              <span className="text-[#8E8E93] font-dm-sans">
                di {selectedStory.is_anonymous ? "Anonimo" : selectedStory.author_name}
              </span>
              <span className="text-[#8E8E93] font-dm-sans">
                {new Date(selectedStory.created_at).toLocaleDateString("it-IT")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}