"use client";

import { useState, useEffect } from "react";
import { Tag, MemoryWithTags, Story } from "@/types";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Check, X, Plus, Trash2, Loader2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"memories" | "stories" | "tags">("memories");
  const [pendingMemories, setPendingMemories] = useState<MemoryWithTags[]>([]);
  const [pendingStories, setPendingStories] = useState<Story[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagIcon, setNewTagIcon] = useState("🏷️");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const checkAuth = async () => {
    const res = await fetch("/api/admin/memories");
    if (res.ok) {
      setIsAuthenticated(true);
      fetchPendingData();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const fetchPendingData = async () => {
    const supabase = createClient();
    const [memRes, storiesRes, tagsRes] = await Promise.all([
      fetch("/api/admin/memories"),
      fetch("/api/admin/stories"),
      supabase.from("tags").select("*").order("created_at", { ascending: true }),
    ]);
    const memData = await memRes.json();
    const storiesData = await storiesRes.json();
    setPendingMemories(Array.isArray(memData) ? memData : []);
    setPendingStories(Array.isArray(storiesData) ? storiesData : []);
    setTags(tagsRes.data || []);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });

    if (res.ok) {
      setIsAuthenticated(true);
      fetchPendingData();
    } else {
      setError("PIN errato");
    }
    setLoading(false);
  };

  const handleApproveMemory = async (id: string) => {
    setActionLoading(id);
    await fetch("/api/admin/memories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPendingMemories(prev => prev.filter(m => m.id !== id));
    setActionLoading(null);
  };

  const handleDeleteMemory = async (id: string, imageUrl: string | null) => {
    setActionLoading(id);
    await fetch("/api/admin/memories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, image_url: imageUrl }),
    });
    setPendingMemories(prev => prev.filter(m => m.id !== id));
    setActionLoading(null);
  };

  const handleApproveStory = async (id: string) => {
    setActionLoading(id);
    await fetch("/api/admin/stories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPendingStories(prev => prev.filter(s => s.id !== id));
    setActionLoading(null);
  };

  const handleDeleteStory = async (id: string) => {
    setActionLoading(id);
    await fetch("/api/admin/stories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPendingStories(prev => prev.filter(s => s.id !== id));
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
      setTags(prev => [...prev, tag]);
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
    setTags(prev => prev.filter(t => t.id !== id));
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-8 pt-8">
        <ScrollReveal>
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-semibold text-[#2C2C2E] font-cormorant">Admin</h1>
            <p className="text-[#8E8E93] font-dm-sans">Inserisci il PIN per accedere</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <form onSubmit={handleLogin} className="max-w-sm mx-auto space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8E8E93]" />
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-12 pr4 py-4 rounded-lg border border-[#E5DFD7] focus:border-[#8B7355] focus:outline-none font-dm-sans text-lg text-center tracking-widest"
                placeholder="••••"
                maxLength={6}
              />
            </div>
            {error && <p className="text-[#B05050] text-sm text-center font-dm-sans">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8B7355] text-white rounded-lg font-dm-sans font-medium hover:bg-[#7A6455] transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : "Accedi"}
            </button>
          </form>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-8">
      <ScrollReveal>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold text-[#2C2C2E] font-cormorant">Pannello Admin</h1>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setActiveTab("memories")}
              className={`px-4 py-2 rounded-lg font-dm-sans text-sm transition-colors ${
                activeTab === "memories" ? "bg-[#8B7355] text-white" : "bg-white text-[#8E8E93] border border-[#E5DFD7]"
              }`}
            >
              Foto ({pendingMemories.length})
            </button>
            <button
              onClick={() => setActiveTab("stories")}
              className={`px-4 py-2 rounded-lg font-dm-sans text-sm transition-colors ${
                activeTab === "stories" ? "bg-[#8B7355] text-white" : "bg-white text-[#8E8E93] border border-[#E5DFD7]"
              }`}
            >
              Racconti ({pendingStories.length})
            </button>
            <button
              onClick={() => setActiveTab("tags")}
              className={`px-4 py-2 rounded-lg font-dm-sans text-sm transition-colors ${
                activeTab === "tags" ? "bg-[#8B7355] text-white" : "bg-white text-[#8E8E93] border border-[#E5DFD7]"
              }`}
            >
              Categorie ({tags.length})
            </button>
          </div>
        </div>
      </ScrollReveal>

      {activeTab === "memories" && (
        <ScrollReveal delay={0.2}>
          {pendingMemories.length === 0 ? (
            <p className="text-center text-[#8E8E93] py-12">Nessuna foto in attesa</p>
          ) : (
            <div className="space-y-4">
              {pendingMemories.map((memory) => (
                <div key={memory.id} className="bg-white rounded-xl p-4 shadow-sm border border-[#E5DFD7] flex gap-4">
                  {memory.image_url && (
                    <img src={memory.image_url} alt="" className="w-24 h-24 object-cover rounded-lg" />
                  )}
                  <div className="flex-1">
                    <p className="font-cormorant text-lg mb-1">{memory.caption}</p>
                    <p className="text-sm text-[#8E8E93] font-dm-sans">di {memory.author_name}</p>
                    {memory.memory_tags && memory.memory_tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {memory.memory_tags.map((mt: { tag_id: string; tags: Tag }) => (
                          <span key={mt.tag_id} className="text-xs bg-[rgba(139,115,85,0.08)] px-2 py-0.5 rounded-full">
                            {mt.tags.icon} {mt.tags.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleApproveMemory(memory.id)}
                      disabled={actionLoading === memory.id}
                      className="p-2 bg-[#5B8C5A] text-white rounded-lg hover:bg-[#4A7A4A] transition-colors disabled:opacity-50"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteMemory(memory.id, memory.image_url)}
                      disabled={actionLoading === memory.id}
                      className="p-2 bg-[#B05050] text-white rounded-lg hover:bg-[#9A4040] transition-colors disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollReveal>
      )}

      {activeTab === "stories" && (
        <ScrollReveal delay={0.2}>
          {pendingStories.length === 0 ? (
            <p className="text-center text-[#8E8E93] py-12">Nessun racconto in attesa</p>
          ) : (
            <div className="space-y-4">
              {pendingStories.map((story) => (
                <div key={story.id} className="bg-white rounded-xl p-4 shadow-sm border border-[#E5DFD7] flex gap-4">
                  <div className="flex-1">
                    <h3 className="font-cormorant text-lg mb-1">{story.title}</h3>
                    <p className="text-sm text-[#8E8E93] line-clamp-2 mb-2">{story.body}</p>
                    <p className="text-sm text-[#8E8E93] font-dm-sans">di {story.is_anonymous ? "Anonimo" : story.author_name}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleApproveStory(story.id)}
                      disabled={actionLoading === story.id}
                      className="p-2 bg-[#5B8C5A] text-white rounded-lg hover:bg-[#4A7A4A] transition-colors disabled:opacity-50"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      disabled={actionLoading === story.id}
                      className="p-2 bg-[#B05050] text-white rounded-lg hover:bg-[#9A4040] transition-colors disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollReveal>
      )}

      {activeTab === "tags" && (
        <ScrollReveal delay={0.2}>
          <form onSubmit={handleAddTag} className="flex gap-2 mb-6 max-w-md mx-auto">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Nome categoria"
              className="flex-1 px-4 py-2 rounded-lg border border-[#E5DFD7] focus:border-[#8B7355] focus:outline-none font-dm-sans"
            />
            <select
              value={newTagIcon}
              onChange={(e) => setNewTagIcon(e.target.value)}
              className="px-3 py-2 rounded-lg border border-[#E5DFD7] focus:border-[#8B7355] focus:outline-none font-dm-sans"
            >
              <option value="🏷️">🏷️</option>
              <option value="🌊">🌊</option>
              <option value="📚">📚</option>
              <option value="⚽">⚽</option>
              <option value="👨‍👩‍👧‍👦">👨‍👩‍👧‍👦</option>
              <option value="✈️">✈️</option>
              <option value="🎵">🎵</option>
              <option value="🤝">🤝</option>
              <option value="🎉">🎉</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-[#8B7355] text-white rounded-lg hover:bg-[#7A6455] transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>

          <div className="space-y-2 max-w-md mx-auto">
            {tags.map((tag) => (
              <div key={tag.id} className="bg-white rounded-lg p-3 shadow-sm border border-[#E5DFD7] flex items-center justify-between">
                <span className="font-dm-sans">
                  {tag.icon} {tag.name}
                </span>
                <button
                  onClick={() => handleDeleteTag(tag.id)}
                  className="p-1.5 text-[#B05050] hover:bg-[rgba(176,80,80,0.1)] rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}