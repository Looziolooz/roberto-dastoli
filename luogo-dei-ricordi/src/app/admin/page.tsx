"use client";

import { useState, useEffect } from "react";
import { Tag, MemoryWithTags, MemoryTagJoin, Story } from "@/types";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Check, X, Plus, Trash2, Loader2, Lock, ChevronDown, ChevronUp, Archive, RotateCcw, Image as ImageIcon, FileText, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ContentFilter = "all" | "pending" | "approved";
type ContentTab = "memories" | "stories" | "archive";

interface ArchivedItem {
  id: string;
  type: "memory" | "story";
  data: MemoryWithTags | Story;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [error, setError] = useState("");
  const [contentTab, setContentTab] = useState<ContentTab>("memories");
  const [contentFilter, setContentFilter] = useState<ContentFilter>("all");
  const [memories, setMemories] = useState<MemoryWithTags[]>([]);
  const [stories, setStories] = useState<(Story & { story_tags?: { tag_id: string; tags: Tag }[] })[]>([]);
  const [archivedItems, setArchivedItems] = useState<ArchivedItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagIcon, setNewTagIcon] = useState("🏷️");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [rateLimited, setRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);
  const [tagsExpanded, setTagsExpanded] = useState(false);

  const checkAuth = async () => {
    setAuthChecking(true);
    const res = await fetch("/api/admin/memories");
    if (res.ok) {
      setIsAuthenticated(true);
      await fetchAllData();
    }
    setAuthChecking(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const fetchAllData = async () => {
    const supabase = createClient();
    const [memRes, storiesRes, tagsRes] = await Promise.all([
      fetch("/api/admin/memories"),
      fetch("/api/admin/stories"),
      supabase.from("tags").select("*").order("created_at", { ascending: true }),
    ]);
    const memData = await memRes.json();
    const storiesData = await storiesRes.json();
    setMemories(Array.isArray(memData) ? memData : []);
    setStories(Array.isArray(storiesData) ? storiesData : []);
    setTags(tagsRes.data ?? []);
  };

  const fetchArchivedData = async () => {
    const [memRes, storiesRes] = await Promise.all([
      fetch("/api/admin/archive?type=memories"),
      fetch("/api/admin/archive?type=stories"),
    ]);
    const memData = await memRes.json();
    const storiesData = await storiesRes.json();

    const items: ArchivedItem[] = [];
    if (Array.isArray(memData)) {
      memData.forEach((m: MemoryWithTags) => items.push({ id: m.id, type: "memory", data: m }));
    }
    if (Array.isArray(storiesData)) {
      storiesData.forEach((s: Story) => items.push({ id: s.id, type: "story", data: s }));
    }
    setArchivedItems(items);
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (contentTab === "archive") {
        fetchArchivedData();
      } else {
        fetchAllData();
      }
    }
  }, [isAuthenticated, contentTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rateLimited) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (res.status === 429) {
      const data = await res.json();
      const wait = Math.ceil((data.retryAfterMs ?? 60000) / 1000);
      setRateLimited(true);
      setRetryAfter(wait);
      setError(`Troppi tentativi. Riprova tra ${wait} secondi.`);
      let remaining = wait;
      const interval = setInterval(() => {
        remaining -= 1;
        setRetryAfter(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          setRateLimited(false);
          setError("");
        }
      }, 1000);
    } else if (res.ok) {
      setIsAuthenticated(true);
      await fetchAllData();
    } else {
      setError("PIN errato");
    }
    setLoading(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleApproveMemory = async (id: string) => {
    setActionLoading(id);
    await fetch("/api/admin/memories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMemories((prev) => prev.filter((m) => m.id !== id));
    setActionLoading(null);
  };

  const handleArchiveMemory = async (id: string) => {
    if (!confirm("Archiviare questo elemento?")) return;
    setActionLoading(id);
    await fetch("/api/admin/memories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setMemories((prev) => prev.filter((m) => m.id !== id));
    setActionLoading(null);
  };

  const handleApproveStory = async (id: string) => {
    setActionLoading(id);
    await fetch("/api/admin/stories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setStories((prev) => prev.filter((s) => s.id !== id));
    setActionLoading(null);
  };

  const handleArchiveStory = async (id: string) => {
    if (!confirm("Archiviare questo elemento?")) return;
    setActionLoading(id);
    await fetch("/api/admin/stories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setStories((prev) => prev.filter((s) => s.id !== id));
    setActionLoading(null);
  };

  const handleRestoreItem = async (id: string) => {
    setActionLoading(id);
    await fetch("/api/admin/archive", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "restore" }),
    });
    setArchivedItems((prev) => prev.filter((item) => item.id !== id));
    setActionLoading(null);
  };

  const handlePermanentDelete = async (id: string, image_url?: string | null) => {
    if (!confirm("Eliminare definitivamente questo elemento?")) return;
    setActionLoading(id);
    await fetch("/api/admin/archive", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "delete" }),
    });
    setArchivedItems((prev) => prev.filter((item) => item.id !== id));
    setActionLoading(null);
  };

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTagName, icon: newTagIcon }),
    });

    if (res.ok) {
      const tag = await res.json();
      setTags((prev) => [...prev, tag]);
      setNewTagName("");
      setNewTagIcon("🏷️");
    }
  };

  const handleDeleteTag = async (id: string) => {
    await fetch("/api/tags", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  if (authChecking) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-[#8B7355]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="space-y-8 pt-8">
        <ScrollReveal>
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-semibold text-[#2C2C2E] font-cormorant">
              Admin
            </h1>
            <p className="text-[#8E8E93] font-dm-sans text-sm">
              Inserisci il PIN per accedere
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <form
            onSubmit={handleLogin}
            className="max-w-xs mx-auto space-y-4 bg-white rounded-2xl p-7 shadow-sm border border-[#E5DFD7]"
          >
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8E8E93]" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#E5DFD7] focus:border-[#8B7355] focus:outline-none font-dm-sans text-center tracking-widest text-xl"
                placeholder="••••"
                maxLength={6}
                disabled={rateLimited}
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-[#B05050] text-xs text-center font-dm-sans">
                {error}
                {rateLimited && retryAfter > 0 && ` (${retryAfter}s)`}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || rateLimited}
              className="w-full py-3 bg-[#8B7355] text-white rounded-xl font-dm-sans font-medium hover:bg-[#7A6455] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Accedi"
              )}
            </button>
          </form>
        </ScrollReveal>
      </div>
    );
  }

  const filteredMemories = memories.filter(m => {
    if (contentFilter === "pending") return !m.is_approved;
    if (contentFilter === "approved") return m.is_approved;
    return true;
  });

  const filteredStories = stories.filter(s => {
    if (contentFilter === "pending") return !s.is_approved;
    if (contentFilter === "approved") return s.is_approved;
    return true;
  });

  return (
    <div className="space-y-8 pt-8">
      <ScrollReveal>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold text-[#2C2C2E] font-cormorant">
            Pannello Admin
          </h1>
          <div className="flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => setContentTab("memories")}
              className={`px-4 py-2 rounded-lg font-dm-sans text-sm transition-colors flex items-center gap-2 ${
                contentTab === "memories"
                  ? "bg-[#8B7355] text-white"
                  : "bg-white text-[#8E8E93] border border-[#E5DFD7] hover:border-[#C4A882]"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Foto
            </button>
            <button
              onClick={() => setContentTab("stories")}
              className={`px-4 py-2 rounded-lg font-dm-sans text-sm transition-colors flex items-center gap-2 ${
                contentTab === "stories"
                  ? "bg-[#8B7355] text-white"
                  : "bg-white text-[#8E8E93] border border-[#E5DFD7] hover:border-[#C4A882]"
              }`}
            >
              <FileText className="w-4 h-4" />
              Racconti
            </button>
            <button
              onClick={() => setContentTab("archive")}
              className={`px-4 py-2 rounded-lg font-dm-sans text-sm transition-colors flex items-center gap-2 ${
                contentTab === "archive"
                  ? "bg-[#8B7355] text-white"
                  : "bg-white text-[#8E8E93] border border-[#E5DFD7] hover:border-[#C4A882]"
              }`}
            >
              <Archive className="w-4 h-4" />
              Archvio
            </button>
          </div>
        </div>
      </ScrollReveal>

      {contentTab !== "archive" && (
        <div className="flex justify-center">
          <div className="inline-flex bg-white rounded-lg border border-[#E5DFD7] p-1 gap-1">
            <button
              onClick={() => setContentFilter("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-dm-sans transition-colors ${
                contentFilter === "all" ? "bg-[#8B7355] text-white" : "text-[#8E8E93] hover:text-[#2C2C2E]"
              }`}
            >
              Tutti ({contentTab === "memories" ? memories.length : stories.length})
            </button>
            <button
              onClick={() => setContentFilter("pending")}
              className={`px-3 py-1.5 rounded-md text-xs font-dm-sans transition-colors ${
                contentFilter === "pending" ? "bg-[#8B7355] text-white" : "text-[#8E8E93] hover:text-[#2C2C2E]"
              }`}
            >
              In attesa ({contentTab === "memories" ? memories.filter(m => !m.is_approved).length : stories.filter(s => !s.is_approved).length})
            </button>
            <button
              onClick={() => setContentFilter("approved")}
              className={`px-3 py-1.5 rounded-md text-xs font-dm-sans transition-colors ${
                contentFilter === "approved" ? "bg-[#8B7355] text-white" : "text-[#8E8E93] hover:text-[#2C2C2E]"
              }`}
            >
              Approvati ({contentTab === "memories" ? memories.filter(m => m.is_approved).length : stories.filter(s => s.is_approved).length})
            </button>
          </div>
        </div>
      )}

      {contentTab === "memories" && (
        <>
          {filteredMemories.length === 0 ? (
            <p className="text-center text-[#8E8E93] py-12 font-dm-sans">
              Nessuna foto {contentFilter === "pending" ? "in attesa" : contentFilter === "approved" ? "approvata" : ""} ✓
            </p>
          ) : (
            <div className="space-y-3 max-w-3xl mx-auto">
              {filteredMemories.map((memory) => {
                const isExpanded = expandedCards.has(memory.id);
                return (
                  <div
                    key={memory.id}
                    className="bg-white rounded-xl shadow-sm border border-[#E5DFD7] overflow-hidden"
                  >
                    <div className="flex">
                      {memory.image_url && (
                        <div className="w-24 h-24 flex-shrink-0 bg-gray-100">
                          <img src={memory.image_url} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${memory.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {memory.is_approved ? "Approvato" : "In attesa"}
                              </span>
                            </div>
                            <p className={`font-dm-sans text-sm text-[#2C2C2E] ${isExpanded ? "" : "line-clamp-2"}`}>
                              {memory.caption || <span className="text-[#8E8E93] italic">Nessuna didascalia</span>}
                            </p>
                            <p className="text-xs text-[#8E8E93] mt-1">
                              di <strong>{memory.author_name}</strong>
                              {memory.created_at && ` · ${new Date(memory.created_at).toLocaleDateString("it-IT")}`}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => toggleExpand(memory.id)} className="p-1.5 text-[#8E8E93] hover:bg-gray-100 rounded-lg">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {!memory.is_approved && (
                              <button onClick={() => handleApproveMemory(memory.id)} disabled={actionLoading === memory.id} className="p-1.5 bg-[#5B8C5A] text-white rounded-lg hover:bg-[#4A7A4A] disabled:opacity-50" title="Approva">
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() => handleArchiveMemory(memory.id)} disabled={actionLoading === memory.id} className="p-1.5 bg-[#B05050] text-white rounded-lg hover:bg-[#9A4040] disabled:opacity-50" title="Archivia">
                              <Archive className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {isExpanded && memory.caption && (
                      <div className="px-3 pb-3 border-t border-[#E5DFD7] pt-2">
                        <p className="text-xs text-[#8E8E93] mb-1">Testo completo:</p>
                        <p className="font-dm-sans text-sm text-[#2C2C2E] whitespace-pre-wrap">{memory.caption}</p>
                        {memory.memory_tags && memory.memory_tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {memory.memory_tags.map((mt: MemoryTagJoin) => (
                              <span key={mt.tag_id} className="text-xs bg-[rgba(139,115,85,0.08)] px-2 py-0.5 rounded-full">
                                {mt.tags.icon} {mt.tags.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {contentTab === "stories" && (
        <>
          {filteredStories.length === 0 ? (
            <p className="text-center text-[#8E8E93] py-12 font-dm-sans">
              Nessun racconto {contentFilter === "pending" ? "in attesa" : contentFilter === "approved" ? "approvato" : ""} ✓
            </p>
          ) : (
            <div className="space-y-3 max-w-3xl mx-auto">
              {filteredStories.map((story) => {
                const isExpanded = expandedCards.has(story.id);
                return (
                  <div key={story.id} className="bg-white rounded-xl shadow-sm border border-[#E5DFD7] overflow-hidden">
                    <div className="p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${story.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                              {story.is_approved ? "Approvato" : "In attesa"}
                            </span>
                          </div>
                          <h3 className="font-cormorant text-lg text-[#2C2C2E] mb-1">{story.title}</h3>
                          <p className={`font-dm-sans text-sm text-[#666] ${isExpanded ? "" : "line-clamp-2"}`}>{story.body}</p>
                          <p className="text-xs text-[#8E8E93] mt-1">
                            di <strong>{story.is_anonymous ? "Anonimo" : story.author_name}</strong>
                            {story.created_at && ` · ${new Date(story.created_at).toLocaleDateString("it-IT")}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => toggleExpand(story.id)} className="p-1.5 text-[#8E8E93] hover:bg-gray-100 rounded-lg">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          {!story.is_approved && (
                            <button onClick={() => handleApproveStory(story.id)} disabled={actionLoading === story.id} className="p-1.5 bg-[#5B8C5A] text-white rounded-lg hover:bg-[#4A7A4A] disabled:opacity-50" title="Approva">
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => handleArchiveStory(story.id)} disabled={actionLoading === story.id} className="p-1.5 bg-[#B05050] text-white rounded-lg hover:bg-[#9A4040] disabled:opacity-50" title="Archivia">
                            <Archive className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="px-3 pb-3 border-t border-[#E5DFD7] pt-2">
                        <p className="text-xs text-[#8E8E93] mb-1">Testo completo:</p>
                        <p className="font-dm-sans text-sm text-[#2C2C2E] whitespace-pre-wrap">{story.body}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {contentTab === "archive" && (
        <>
          {archivedItems.length === 0 ? (
            <p className="text-center text-[#8E8E93] py-12 font-dm-sans">
              Archvio vuoto ✓
            </p>
          ) : (
            <div className="space-y-3 max-w-3xl mx-auto">
              {archivedItems.map((item) => {
                const isExpanded = expandedCards.has(item.id);
                const isMemory = item.type === "memory";
                const data = item.data as MemoryWithTags | Story;
                return (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-[#E5DFD7] overflow-hidden">
                    <div className="flex">
                      {isMemory && (data as MemoryWithTags).image_url && (
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 grayscale opacity-60">
                          <img src={(data as MemoryWithTags).image_url!} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${isMemory ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                            {isMemory ? "Foto" : "Racconto"}
                          </span>
                        </div>
                        <p className={`font-dm-sans text-sm text-[#2C2C2E] line-clamp-2`}>
                          {isMemory ? (data as MemoryWithTags).caption || "Nessuna didascalia" : (data as Story).title}
                        </p>
                        <p className="text-xs text-[#8E8E93] mt-1">
                          di <strong>{isMemory ? (data as MemoryWithTags).author_name : (data as Story).author_name}</strong>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 p-2">
                        <button onClick={() => toggleExpand(item.id)} className="p-1.5 text-[#8E8E93] hover:bg-gray-100 rounded-lg">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button onClick={() => handleRestoreItem(item.id)} disabled={actionLoading === item.id} className="p-1.5 bg-[#5B8C5A] text-white rounded-lg hover:bg-[#4A7A4A] disabled:opacity-50" title="Ripristina">
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button onClick={() => handlePermanentDelete(item.id)} disabled={actionLoading === item.id} className="p-1.5 bg-[#B05050] text-white rounded-lg hover:bg-[#9A4040] disabled:opacity-50" title="Elimina">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <div className="max-w-md mx-auto">
        <button
          onClick={() => setTagsExpanded(!tagsExpanded)}
          className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-[#E5DFD7] font-dm-sans text-sm text-[#2C2C2E] flex items-center justify-between hover:border-[#C4A882] transition-colors"
        >
          <span>Categorie ({tags.length})</span>
          {tagsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {tagsExpanded && (
          <div className="mt-3 space-y-3">
            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Nome categoria"
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#E5DFD7] focus:border-[#8B7355] focus:outline-none font-dm-sans text-sm"
              />
              <select
                value={newTagIcon}
                onChange={(e) => setNewTagIcon(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-[#E5DFD7] focus:border-[#8B7355] focus:outline-none font-dm-sans text-sm"
              >
                {["🏷️","🌊","📚","⚽","👨‍👩‍👧‍👦","✈️","🎵","🤝","🎉","🏡","❤️","🎂"].map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#8B7355] text-white rounded-xl hover:bg-[#7A6455] transition-colors"
                aria-label="Aggiungi categoria"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-2">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  className="bg-white rounded-xl p-3 shadow-sm border border-[#E5DFD7] flex items-center justify-between"
                >
                  <span className="font-dm-sans text-sm">
                    {tag.icon} {tag.name}
                  </span>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="p-1.5 text-[#B05050] hover:bg-[rgba(176,80,80,0.08)] rounded-lg transition-colors"
                    aria-label={`Elimina ${tag.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
