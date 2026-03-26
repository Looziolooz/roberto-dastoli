"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Tag, CreateMemoryPayload, CreateStoryPayload, UploadTab } from "@/types";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Upload, FileText, Loader2, CheckCircle, X, Plus } from "lucide-react";

const EMOJI_OPTIONS = [
  "😀","😢","❤️","🤗","🥰","😴","😎","😊","🌟","💫","⭐","🌈","☀️","🌧️","❄️","🌙","🌊","🏔️","🌲","🌸","🍃","🏖️","🎿","🎂","🎓","🎉","🎊","🎈","🎁","🏠","👨‍👩‍👧‍👦","👫","🏃","⚽","🎸","🎤","🎬","🎨","📚","✈️","🚗","🏕️","🌄","🌅","🌇","🌃","🎆","🎇","🕯️","🍕","🍝","🍦","☕","🍷","🍾","🎵","💃","🏋️","🚴","🏊","🎯","🎲","🎮","📸","🖼️","💌","🌹","🌻","🌺","🌼","🏵️","🍀","🦋","🐚","🐬","🐳","🦅","🦉","🐺","🦌","🦄","🐎","🐑","🐓","🐕","🐈","🦔","🦎","🐞","🌷","🌱","🌿","🍃","🌾","🍅","🍊","🍋","🍓","🍒","🍑","🍇","🍏","🍎","🥬","🥦","🥔","🍞","🥐","🧀","🥚","🍔","🌮","🍜","🍝","🍱","🍣","🍦","🍨","🍧","🎂","🍰","🍭","🍬","🍫","🍿","🍩","☕","🍵","🧃","🍶","🍺","🍻","🥂","🍷","🥃","🍹","🍸","🎄","🎃","🎅","🎁","🎀","🎊","🎉","🎈","🏆","🥇","🎖️","🎟️","🎫","🎠","🎡","🎢","🎪","🎭","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸","🪕","🎻","🎲","♟️","🎯","🎳","🕹️","🎰","🏀","⚽","🏈","⚾","🎾","🏐","🏉","🥏","🏓","🏸","🏒","🥅","⛳","🏹","🎣","🥊","🥋","🛹","⛸️","🥌","🎿","⛷️","🏂","🏋️","🤼","🤸","🤾","⛹️","🏌️","🏇","🧘","🏄","🏊","🤽","🚣","🧗","🚵","🚴","🛀"
];

export default function CaricaPage() {
  const [activeTab, setActiveTab] = useState<UploadTab>("memory");
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

  // New tag form
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagIcon, setNewTagIcon] = useState("🏷️");
  const [creatingTag, setCreatingTag] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("tags")
        .select("*")
        .order("created_at", { ascending: true });
      setTags(data ?? []);
    };
    fetchTags();
  }, []);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setCreatingTag(true);

    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTagName.trim(), icon: newTagIcon }),
    });

    if (res.ok) {
      const tag = await res.json();
      setTags((prev) => [...prev, tag]);
      setSelectedTags((prev) => [...prev, tag.id]);
      setNewTagName("");
      setNewTagIcon("🏷️");
      setShowNewTagForm(false);
    }
    setCreatingTag(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // client-side validation
    if (file.size > 10 * 1024 * 1024) {
      setError("Il file è troppo grande (max 10MB).");
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      setError("Formato non supportato. Usa JPG, PNG o WebP.");
      return;
    }
    setError("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Errore upload");
    return data.url ?? null;
  };

  const resetMemoryForm = () => {
    setCaption("");
    setAuthorName("");
    setImageFile(null);
    setImagePreview(null);
    setSelectedTags([]);
  };

  const resetStoryForm = () => {
    setTitle("");
    setStoryBody("");
    setStoryAuthorName("");
    setIsAnonymous(false);
  };

  const handleMemorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      let image_url: string | null = null;
      if (imageFile) image_url = await uploadImage(imageFile);

      const payload: CreateMemoryPayload = {
        caption,
        author_name: authorName,
        image_url,
        tag_ids: selectedTags,
      };

      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Errore nel caricamento");
      }

      setSuccess(true);
      resetMemoryForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante il caricamento.");
    } finally {
      setLoading(false);
    }
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload: CreateStoryPayload = {
        title,
        body: storyBody,
        author_name: storyAuthorName,
        is_anonymous: isAnonymous,
        tag_ids: selectedTags,
      };

      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Errore nel caricamento");
      }

      setSuccess(true);
      resetStoryForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante il caricamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pt-8">
      <ScrollReveal>
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold text-brand-text font-cormorant">
            Condividi un ricordo
          </h1>
          <p className="text-brand-muted font-dm-sans max-w-md mx-auto text-sm leading-relaxed">
            Ogni contributo rende questo luogo più ricco. Le foto e i racconti
            saranno visibili dopo l'approvazione.
          </p>
        </div>
      </ScrollReveal>

      {/* Tab switcher */}
      <ScrollReveal delay={0.1}>
        <div className="flex justify-center gap-2">
          <button
            onClick={() => { setActiveTab("memory"); setSuccess(false); setError(""); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-dm-sans text-sm transition-all ${
              activeTab === "memory"
                ? "bg-brand-accent text-white shadow-sm"
                : "bg-white text-brand-muted border border-brand-border hover:border-brand-accent-light"
            }`}
          >
            <Upload className="w-4 h-4" />
            Foto
          </button>
          <button
            onClick={() => { setActiveTab("story"); setSuccess(false); setError(""); }}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-dm-sans text-sm transition-all ${
              activeTab === "story"
                ? "bg-brand-accent text-white shadow-sm"
                : "bg-white text-brand-muted border border-brand-border hover:border-brand-accent-light"
            }`}
          >
            <FileText className="w-4 h-4" />
            Racconto
          </button>
        </div>
      </ScrollReveal>

      {/* Feedback banners */}
      {success && (
        <div className="bg-[rgba(91,140,90,0.1)] border border-[#5B8C5A] text-[#5B8C5A] px-6 py-4 rounded-xl flex items-center gap-3 font-dm-sans max-w-xl mx-auto">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>Grazie! Il tuo contributo è stato inviato e sarà visibile dopo l'approvazione.</span>
        </div>
      )}
      {error && (
        <div className="bg-[rgba(176,80,80,0.1)] border border-[#B05050] text-brand-danger px-6 py-4 rounded-xl flex items-center gap-3 font-dm-sans max-w-xl mx-auto">
          <X className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ── Memory form ── */}
      {activeTab === "memory" && (
        <ScrollReveal delay={0.15}>
          <form
            onSubmit={handleMemorySubmit}
            className="max-w-xl mx-auto space-y-5 bg-white rounded-2xl p-7 shadow-sm border border-brand-border"
          >
            {/* Image drop zone */}
            <div>
              <label className="block text-sm font-dm-sans text-brand-muted mb-2">
                Foto <span className="text-brand-accent-light">(opzionale)</span>
              </label>
              <div className="border-2 border-dashed border-brand-border rounded-xl overflow-hidden hover:border-brand-accent-light transition-colors">
                {imagePreview ? (
                  <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain bg-brand-bg"
                    />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 bg-brand-danger text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-brand-danger/80 transition-colors"
                      aria-label="Rimuovi foto"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center py-10 px-4 gap-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-brand-accent-light" />
                    <span className="text-sm text-brand-muted font-dm-sans text-center">
                      Clicca per caricare
                      <br />
                      <span className="text-xs opacity-60">JPG, PNG, WebP — max 10MB</span>
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-sm font-dm-sans text-brand-muted mb-2">
                Descrizione <span className="text-brand-danger">*</span>
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-accent focus:outline-none font-cormorant text-lg resize-none"
                placeholder="Racconta cosa sta succedendo..."
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-dm-sans text-brand-muted mb-2">
                Il tuo nome <span className="text-brand-danger">*</span>
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-accent focus:outline-none font-dm-sans"
                placeholder="Il tuo nome"
              />
            </div>

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-dm-sans text-brand-muted">
                  Categoria
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewTagForm(!showNewTagForm)}
                  className="text-xs text-brand-accent hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Nuova categoria
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.includes(tag.id)
                          ? prev.filter((id) => id !== tag.id)
                          : [...prev, tag.id]
                      )
                    }
                    aria-pressed={selectedTags.includes(tag.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-dm-sans transition-colors ${
                      selectedTags.includes(tag.id)
                        ? "bg-brand-accent text-white"
                        : "bg-brand-bg text-brand-muted hover:border-brand-accent-light border border-transparent"
                    }`}
                  >
                    {tag.icon} {tag.name}
                  </button>
                ))}
              </div>
              {showNewTagForm && (
                <div className="mt-3 flex gap-2 items-center">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCreateTag(e as unknown as React.FormEvent))}
                    placeholder="Nome categoria"
                    className="flex-1 px-3 py-2 rounded-lg border border-brand-border focus:border-brand-accent focus:outline-none text-sm font-dm-sans"
                    maxLength={20}
                    autoFocus
                  />
                  <select
                    value={newTagIcon}
                    onChange={(e) => setNewTagIcon(e.target.value)}
                    className="px-2 py-2 rounded-lg border border-brand-border focus:border-brand-accent focus:outline-none text-lg"
                  >
                    {["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","😊","😇","🥰","😍","🤩","😘","😗","😚","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖","😺","😸","😹","😻","😼","😽","🙀","😿","😾","🙈","🙉","🙊","💋","💌","💘","💝","💖","💗","💓","💞","💕","💟","❣️","💔","❤️","🧡","💛","💚","💙","💜","🤎","🖤","🤍","💯","💢","💥","💫","💦","💨","🕳️","💣","💬","👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🧠","🫀","🫁","🦷","🦴","👀","👁️","👅","👄","👶","🧒","👦","👧","🧑","👱","👨","🧔","👩","🧓","👴","👵","🙍","🙎","🙅","🙆","💁","🙋","🧏","🙇","🤦","🤷","👮","🕵️","💂","🥷","👷","🤴","👸","👳","👲","🧕","🤵","👰","🤰","🤱","👼","🎒","🎓","👑","📿","💄","💍","💎","🐵","🐒","🦍","🦧","🐶","🐕","🦮","🐩","🐺","🦊","🦝","🐱","🐈","🦁","🐯","🐅","🐆","🐴","🐎","🦄","🦓","🦌","🦬","🐮","🐂","🐃","🐄","🐷","🐖","🐗","🐽","🐏","🐑","🐐","🐪","🐫","🦒","🦘","🦬","🐭","🐹","🐰","🐇","🐿️","🦔","🦇","🐻","🐻‍❄️","🐨","🐼","🦥","🦦","🦨","🦘","🦡","🐾","🦃","🐔","🐓","🐣","🐤","🐥","🐦","🐧","🕊️","🦅","🦆","🦢","🦉","🦤","🪶","🦩","🦚","🦜","🪽","🐦‍⬛","🪿","🦆","🐸","🐊","🐢","🦎","🐍","🐲","🐉","🦕","🦖","🐳","🐋","🐬","🦭","🐟","🐠","🐡","🐙","🦑","🦐","🦞","🦀","🪼","🦂","🕷️","🕸️","🦟","🪰","🪱","🦋","🐌","🐛","🐜","🐝","🪲","🐞","🦗","🪳","🦽","🦼","🩼","🩺","🩻","🏋️","🤼","🤸","⛹️","🤺","🤾","🏌️","🏇","🧘","🏄","🏊","🤽","🚣","🧗","🚵","🚴","🧘","🏋️","🧜","🛀","🛁","🛎️","🚿","🛁","🛀","🧴","🧷","🧹","🧺","🧻","🪮","🧽","🧿","🧹","🧺","🪣","🧼","🫧","🪥","🧴","🧷","🧶","🪡","🧵","🪢","🧶","🧵","🪡","🧺","🧻","🧼","🫧","🪥","🧴","🧷","🧹","🧺","🧻","🧽","🧿","🧻","🧹","🧺","🪣","🧼","🫧","🪥","🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌","🛕","🕍","⛩️","⛲","⛺","🌁","🌄","🌅","🌆","🌇","🌉","♨️","🎠","🛝","🎡","🎢","💈","🎪","🛖","🏘","🏚","🏗","🏭","🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌","🛕","🕍","⛩️","⛲","⛺","🌁","🌄","🌅","🌆","🌇","🌉","♨️","🎠","🛝","🎡","🎢","💈","🎪","🛖","🏘","🏚","🏗","🌋","🗻","🏔","⛰️","⛳","🗾","🗼","🗽","⛩️","⛪","🕌","🛕","🌐","🌎","🌍","🌏","🪨","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌙","🌚","🌛","🌜","🌡️","☀️","🌝","🌞","🪐","⭐","🌟","✨","💫","☁️","⛅","⛈️","🌤","🌥","🌦","🌧","⛈️","🌩","🌨","☁️","❄️","☃️","⛄","🌬","💨","🌪","🌫","🌀","🌈","🌂","☂️","🌧","⛈️","🌩","⚡","🌪","🌫","🌀","🌂","☂️","🌧","⛈️","🌩","⚡","🌁","🌄","🌅","🌆","🌇","🌉","♨️","🎠","🛝","🎡","🎢","💈","🎪","🛖","🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚨","🚔","🚍","🚘","🚖","🚡","🚠","🚟","🚃","🚋","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","✈️","🛫","🛬","🛩️","💺","🛰️","🚀","🛸","🚁","🛶","⛵","🚤","🛥️","🛳️","⛴️","🚢","⚓","🪝","⛽","🚧","🚦","🚥","🚏","🗺️","🗿","🗽","🗼","🏰","🏯","🏟","🎡","🎢","🎠","⛲","⛺","🎪","🎭","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸","🪕","🎻","🎲","♟️","🎯","🎳","🎮","🕹️","🎰","🎱","🪀","🪁","🏏","⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🪀","🏓","🏸","🏒","🏑","🥍","🏏","🥅","⛳","🪁","🏹","🎣","🤿","🥊","🥋","🎽","🛹","🛼","🛷","⛸️","🥌","🎿","⛷️","🏂","🪂","🏋️","🤼","🤸","🤺","🤾","⛹️","🏌️","🏇","🧘","🧗","🏄","🏊","🤽","🚣","🚵","🚴","🏋️","🧜","🛀","🚴","🚵","🏭","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌","🛕","🕍","⛩️","⛲","⛺","🌁","🌄","🌅","🌆","🌇","🌉","♨️","🎠","🛝","🎡","🎢","💈","🎪","🛖","🏘","🏚","🏗","🏭","🚂","🚆","🚇","🚊","🚉","🚝","🚞","🚄","🚅","🚈","🚂","🚃","🚋","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚏","🛣️","🛤️","🛤️","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","🚅","🚄","🚝","🚞","🚂","🚃","🚋","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚏","🛣️","🛤️","🛤️","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","🚅","🚄","🚝","🚞","🚂","🚃","🚋","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚏","🛣️","🛤️","🛤️","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","🚅","🚄","🚝","🚞","🚂","🚃","🚋","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚏","🛣️","🛤️","🛤️","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","🚅","🚄","🚝","🚞","🚂","🚃","🚋","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚏","🛣️","🛤️","🛤️","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","🚅","🚄","🚝","🚞","🚂","🚃","🚋","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚏","🛣️","🛤️","🛤️","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉"].map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={(e) => handleCreateTag(e as unknown as React.FormEvent)}
                    disabled={creatingTag || !newTagName.trim()}
                    className="px-3 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/80 transition-colors disabled:opacity-50 text-sm"
                  >
                    {creatingTag ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aggiungi"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowNewTagForm(false); setNewTagName(""); setNewTagIcon("🏷️"); }}
                    className="p-2 text-brand-muted hover:text-brand-danger"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-accent text-white rounded-xl font-dm-sans font-medium hover:bg-brand-accent/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Invio in corso..." : "Invia foto"}
            </button>
          </form>
        </ScrollReveal>
      )}

      {/* ── Story form ── */}
      {activeTab === "story" && (
        <ScrollReveal delay={0.15}>
          <form
            onSubmit={handleStorySubmit}
            className="max-w-xl mx-auto space-y-5 bg-white rounded-2xl p-7 shadow-sm border border-brand-border"
          >
            <div>
              <label className="block text-sm font-dm-sans text-brand-muted mb-2">
                Titolo <span className="text-brand-danger">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-accent focus:outline-none font-cormorant text-lg"
                placeholder="Dai un titolo al tuo racconto"
              />
            </div>

            <div>
              <label className="block text-sm font-dm-sans text-brand-muted mb-2">
                Racconto <span className="text-brand-danger">*</span>
              </label>
              <textarea
                value={storyBody}
                onChange={(e) => setStoryBody(e.target.value)}
                required
                rows={9}
                className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-accent focus:outline-none font-cormorant text-lg resize-none"
                placeholder="Scrivi il tuo ricordo..."
              />
            </div>

            <div>
              <label className="block text-sm font-dm-sans text-brand-muted mb-2">
                Il tuo nome
              </label>
              <input
                type="text"
                value={storyAuthorName}
                onChange={(e) => setStoryAuthorName(e.target.value)}
                disabled={isAnonymous}
                required={!isAnonymous}
                className="w-full px-4 py-3 rounded-xl border border-brand-border focus:border-brand-accent focus:outline-none font-dm-sans disabled:opacity-40 disabled:cursor-not-allowed"
                placeholder="Il tuo nome"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded accent-[#8B7355]"
              />
              <span className="font-dm-sans text-sm text-brand-muted">
                Pubblica come anonimo
              </span>
            </label>

            {/* Tags */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-dm-sans text-brand-muted">
                  Categoria
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewTagForm(!showNewTagForm)}
                  className="text-xs text-brand-accent hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Nuova categoria
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.includes(tag.id)
                          ? prev.filter((id) => id !== tag.id)
                          : [...prev, tag.id]
                      )
                    }
                    aria-pressed={selectedTags.includes(tag.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-dm-sans transition-colors ${
                      selectedTags.includes(tag.id)
                        ? "bg-brand-accent text-white"
                        : "bg-brand-bg text-brand-muted hover:border-brand-accent-light border border-transparent"
                    }`}
                  >
                    {tag.icon} {tag.name}
                  </button>
                ))}
              </div>
              {showNewTagForm && (
                <div className="mt-3 flex gap-2 items-center">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleCreateTag(e as unknown as React.FormEvent))}
                    placeholder="Nome categoria"
                    className="flex-1 px-3 py-2 rounded-lg border border-brand-border focus:border-brand-accent focus:outline-none text-sm font-dm-sans"
                    maxLength={20}
                    autoFocus
                  />
                  <select
                    value={newTagIcon}
                    onChange={(e) => setNewTagIcon(e.target.value)}
                    className="px-2 py-2 rounded-lg border border-brand-border focus:border-brand-accent focus:outline-none text-lg"
                  >
                    {["😀","😃","😄","😁","😆","😅","🤣","😂","🙂","😊","😇","🥰","😍","🤩","😘","😗","😚","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖","😺","😸","😹","😻","😼","😽","🙀","😿","😾","🙈","🙉","🙊","💋","💌","💘","💝","💖","💗","💓","💞","💕","💟","❣️","💔","❤️","🧡","💛","💚","💙","💜","🤎","🖤","🤍","💯","💢","💥","💫","💦","💨","🕳️","💣","💬","👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🧠","🫀","🫁","🦷","🦴","👀","👁️","👅","👄","👶","🧒","👦","👧","🧑","👱","👨","🧔","👩","🧓","👴","👵","🙍","🙎","🙅","🙆","💁","🙋","🧏","🙇","🤦","🤷","👮","🕵️","💂","🥷","👷","🤴","👸","👳","👲","🧕","🤵","👰","🤰","🤱","👼","🎒","🎓","👑","📿","💄","💍","💎","🐵","🐒","🦍","🦧","🐶","🐕","🦮","🐩","🐺","🦊","🦝","🐱","🐈","🦁","🐯","🐅","🐆","🐴","🐎","🦄","🦓","🦌","🦬","🐮","🐂","🐃","🐄","🐷","🐖","🐗","🐽","🐏","🐑","🐐","🐪","🐫","🦒","🦘","🦬","🐭","🐹","🐰","🐇","🐿️","🦔","🦇","🐻","🐻‍❄️","🐨","🐼","🦥","🦦","🦨","🦘","🦡","🐾","🦃","🐔","🐓","🐣","🐤","🐥","🐦","🐧","🕊️","🦅","🦆","🦢","🦉","🦤","🪶","🦩","🦚","🦜","🪽","🐦‍⬛","🪿","🦆","🐸","🐊","🐢","🦎","🐍","🐲","🐉","🦕","🦖","🐳","🐋","🐬","🦭","🐟","🐠","🐡","🐙","🦑","🦐","🦞","🦀","🪼","🦂","🕷️","🕸️","🦟","🪰","🪱","🦋","🐌","🐛","🐜","🐝","🪲","🐞","🦗","🪳","🦽","🦼","🩼","🩺","🩻","🏋️","🤼","🤸","⛹️","🤺","🤾","🏌️","🏇","🧘","🏄","🏊","🤽","🚣","🧗","🚵","🚴","🧘","🏋️","🧜","🛀","🛁","🛎️","🚿","🛁","🛀","🧴","🧷","🧹","🧺","🧻","🪮","🧽","🧿","🧹","🧺","🪣","🧼","🫧","🪥","🧴","🧷","🧶","🪡","🧵","🪢","🧶","🧵","🪡","🧺","🧻","🧼","🫧","🪥","🧴","🧷","🧹","🧺","🧻","🧽","🧿","🧻","🧹","🧺","🪣","🧼","🫧","🪥","🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌","🛕","🕍","⛩️","⛲","⛺","🌁","🌄","🌅","🌆","🌇","🌉","♨️","🎠","🛝","🎡","🎢","💈","🎪","🛖","🏘","🏚","🏗","🏭","🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌","🛕","🕍","⛩️","⛲","⛺","🌁","🌄","🌅","🌆","🌇","🌉","♨️","🎠","🛝","🎡","🎢","💈","🎪","🛖","🏘","🏚","🏗","🌋","🗻","🏔","⛰️","⛳","🗾","🗼","🗽","⛩️","⛪","🕌","🛕","🌐","🌎","🌍","🌏","🪨","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌙","🌚","🌛","🌜","🌡️","☀️","🌝","🌞","🪐","⭐","🌟","✨","💫","☁️","⛅","⛈️","🌤","🌥","🌦","🌧","⛈️","🌩","🌨","☁️","❄️","☃️","⛄","🌬","💨","🌪","🌫","🌀","🌈","🌂","☂️","🌧","⛈️","🌩","⚡","🌪","🌫","🌀","🌂","☂️","🌧","⛈️","🌩","⚡","🌁","🌄","🌅","🌆","🌇","🌉","♨️","🎠","🛝","🎡","🎢","💈","🎪","🛖","🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚨","🚔","🚍","🚘","🚖","🚡","🚠","🚟","🚃","🚋","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","✈️","🛫","🛬","🛩️","💺","🛰️","🚀","🛸","🚁","🛶","⛵","🚤","🛥️","🛳️","⛴️","🚢","⚓","🪝","⛽","🚧","🚦","🚥","🚏","🗺️","🗿","🗽","🗼","🏰","🏯","🏟","🎡","🎢","🎠","⛲","⛺","🎪","🎭","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸","🪕","🎻","🎲","♟️","🎯","🎳","🎮","🕹️","🎰","🎱","🪀","🪁","🏏","⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🪀","🏓","🏸","🏒","🏑","🥍","🏏","🥅","⛳","🪁","🏹","🎣","🤿","🥊","🥋","🎽","🛹","🛼","🛷","⛸️","🥌","🎿","⛷️","🏂","🪂","🏋️","🤼","🤸","🤺","🤾","⛹️","🏌️","🏇","🧘","🧗","🏄","🏊","🤽","🚣","🚵","🚴","🏋️","🧜","🛀","🚴","🚵","🏭","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","⛪","🕌","🛕","🕍","⛩️","⛲","⛺","🌁","🌄","🌅","🌆","🌇","🌉","♨️","🎠","🛝","🎡","🎢","💈","🎪","🛖","🏘","🏚","🏗","🏭","🚂","🚆","🚇","🚊","🚉","🚝","🚞","🚄","🚅","🚈","🚂","🚃","🚋","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚏","🛣️","🛤️","🛤️","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","🚅","🚄","🚝","🚞","🚂","🚃","🚋","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚏","🛣️","🛤️","🛤️","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","🚅","🚄","🚝","🚞","🚂","🚃","🚋","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚏","🛣️","🛤️","🛤️","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","🚅","🚄","🚝","🚞","🚂","🚃","🚋","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚏","🛣️","🛤️","🛤️","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","🚅","🚄","🚝","🚞","🚂","🚃","🚋","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚏","🛣️","🛤️","🛤️","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉","🚅","🚄","🚝","🚞","🚂","🚃","🚋","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚙","🛻","🚚","🚛","🚜","🏍️","🛵","🚲","🛴","🛺","🚏","🛣️","🛤️","🛤️","🚞","🚝","🚄","🚅","🚈","🚂","🚆","🚇","🚊","🚉"].map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={(e) => handleCreateTag(e as unknown as React.FormEvent)}
                    disabled={creatingTag || !newTagName.trim()}
                    className="px-3 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/80 transition-colors disabled:opacity-50 text-sm"
                  >
                    {creatingTag ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aggiungi"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowNewTagForm(false); setNewTagName(""); setNewTagIcon("🏷️"); }}
                    className="p-2 text-brand-muted hover:text-brand-danger"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-brand-accent text-white rounded-xl font-dm-sans font-medium hover:bg-brand-accent/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Invio in corso..." : "Invia racconto"}
            </button>
          </form>
        </ScrollReveal>
      )}
    </div>
  );
}
