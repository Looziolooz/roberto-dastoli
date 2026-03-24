"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Tag } from "@/types";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function CaricaPage() {
  const [activeTab, setActiveTab] = useState<"memory" | "story">("memory");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Memory form
  const [caption, setCaption] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Story form
  const [title, setTitle] = useState("");
  const [storyBody, setStoryBody] = useState("");
  const [storyAuthorName, setStoryAuthorName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("tags").select("*").order("created_at", { ascending: true });
      setTags(data || []);
    };
    fetchTags();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    return data.url || null;
  };

  const handleMemorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption, author_name: authorName, image_url: imageUrl, tag_ids: selectedTags }),
      });

      if (!res.ok) throw new Error("Errore nel caricamento");

      setSuccess(true);
      setCaption("");
      setAuthorName("");
      setImageFile(null);
      setImagePreview(null);
      setSelectedTags([]);
    } catch {
      setError("Errore durante il caricamento. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body: storyBody, author_name: storyAuthorName, is_anonymous: isAnonymous }),
      });

      if (!res.ok) throw new Error("Errore nel caricamento");

      setSuccess(true);
      setTitle("");
      setStoryBody("");
      setStoryAuthorName("");
      setIsAnonymous(false);
    } catch {
      setError("Errore durante il caricamento. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pt-8">
      <ScrollReveal>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold text-[#2C2C2E] font-cormorant">Condividi un ricordo</h1>
          <p className="text-[#8E8E93] font-dm-sans">
            Ogni contributo rende questo luogo più ricco
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setActiveTab("memory")}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-dm-sans transition-colors ${
              activeTab === "memory"
                ? "bg-[#8B7355] text-white"
                : "bg-white text-[#8E8E93] border border-[#E5DFD7]"
            }`}
          >
            <Upload className="w-4 h-4" />
            Carica una foto
          </button>
          <button
            onClick={() => setActiveTab("story")}
            className={`flex items-center gap-2 px-5 py-3 rounded-lg font-dm-sans transition-colors ${
              activeTab === "story"
                ? "bg-[#8B7355] text-white"
                : "bg-white text-[#8E8E93] border border-[#E5DFD7]"
            }`}
          >
            <FileText className="w-4 h-4" />
            Scrivi un racconto
          </button>
        </div>
      </ScrollReveal>

      {success && (
        <div className="bg-[rgba(91,140,90,0.1)] border border-[#5B8C5A] text-[#5B8C5A] px-6 py-4 rounded-lg text-center font-dm-sans">
          Grazie! Il tuo contributo è stato inviato e sarà visibile dopo l'approvazione.
        </div>
      )}

      {error && (
        <div className="bg-[rgba(176,80,80,0.1)] border border-[#B05050] text-[#B05050] px-6 py-4 rounded-lg text-center font-dm-sans">
          {error}
        </div>
      )}

      {activeTab === "memory" ? (
        <ScrollReveal delay={0.3}>
          <form onSubmit={handleMemorySubmit} className="max-w-xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-dm-sans text-[#8E8E93] mb-2">Foto (opzionale)</label>
              <div className="border-2 border-dashed border-[#E5DFD7] rounded-xl p-8 text-center hover:border-[#8B7355] transition-colors">
                {imagePreview ? (
                  <div className="relative w-full h-48">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 bg-[#B05050] text-white rounded-full p-1"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <Upload className="w-10 h-10 mx-auto text-[#8E8E93] mb-2" />
                    <p className="text-sm text-[#8E8E93] font-dm-sans">Clicca per caricare una foto</p>
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-dm-sans text-[#8E8E93] mb-2">Descrizione</label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-[#E5DFD7] focus:border-[#8B7355] focus:outline-none font-cormorant text-lg"
                placeholder="Racconta cosa sta succedendo in questa foto..."
              />
            </div>

            <div>
              <label className="block text-sm font-dm-sans text-[#8E8E93] mb-2">Il tuo nome</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#E5DFD7] focus:border-[#8B7355] focus:outline-none font-dm-sans"
                placeholder="Il tuo nome"
              />
            </div>

            <div>
              <label className="block text-sm font-dm-sans text-[#8E8E93] mb-2">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => setSelectedTags(prev => prev.includes(tag.id) ? prev.filter(id => id !== tag.id) : [...prev, tag.id])}
                    className={`px-3 py-1.5 rounded-full text-sm font-dm-sans transition-colors ${
                      selectedTags.includes(tag.id)
                        ? "bg-[#8B7355] text-white"
                        : "bg-white text-[#8E8E93] border border-[#E5DFD7]"
                    }`}
                  >
                    {tag.icon} {tag.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8B7355] text-white rounded-lg font-dm-sans font-medium hover:bg-[#7A6455] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Invia ricordo
            </button>
          </form>
        </ScrollReveal>
      ) : (
        <ScrollReveal delay={0.3}>
          <form onSubmit={handleStorySubmit} className="max-w-xl mx-auto space-y-6">
            <div>
              <label className="block text-sm font-dm-sans text-[#8E8E93] mb-2">Titolo</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#E5DFD7] focus:border-[#8B7355] focus:outline-none font-cormorant text-lg"
                placeholder="Dai un titolo al tuo racconto"
              />
            </div>

            <div>
              <label className="block text-sm font-dm-sans text-[#8E8E93] mb-2">Racconto</label>
              <textarea
                value={storyBody}
                onChange={(e) => setStoryBody(e.target.value)}
                required
                rows={8}
                className="w-full px-4 py-3 rounded-lg border border-[#E5DFD7] focus:border-[#8B7355] focus:outline-none font-cormorant text-lg"
                placeholder="Scrivi il tuo ricordo..."
              />
            </div>

            <div>
              <label className="block text-sm font-dm-sans text-[#8E8E93] mb-2">Il tuo nome</label>
              <input
                type="text"
                value={storyAuthorName}
                onChange={(e) => setStoryAuthorName(e.target.value)}
                disabled={isAnonymous}
                className="w-full px-4 py-3 rounded-lg border border-[#E5DFD7] focus:border-[#8B7355] focus:outline-none font-dm-sans disabled:opacity-50"
                placeholder="Il tuo nome"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 rounded border-[#E5DFD7] text-[#8B7355] focus:ring-[#8B7355]"
              />
              <span className="font-dm-sans text-[#8E8E93]">Pubblica come anonimo</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8B7355] text-white rounded-lg font-dm-sans font-medium hover:bg-[#7A6455] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Invia racconto
            </button>
          </form>
        </ScrollReveal>
      )}
    </div>
  );
}