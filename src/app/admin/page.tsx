"use client";

import { useState, useEffect } from "react";
import { Tag, MemoryWithTags, MemoryTagJoin, Story } from "@/types";
import { ScrollReveal } from "@/components/ScrollReveal";
import { 
  Check, X, Plus, Trash2, Loader2, Lock, ChevronDown, ChevronUp, 
  Archive, RotateCcw, Image as ImageIcon, FileText, Sparkles, 
  Camera, BookOpen, FolderArchive, FolderOpen,
  GraduationCap, Heart, Briefcase, Waves, Mountain,
  Users, Handshake, PartyPopper, VenetianMask, Ghost,
  Plane, Palmtree, User, HandHeart, MessageCircle,
  Cake, Award, Star, Music, Coffee, Smile, HeartHandshake,
  CloudRain, HeartCrack, Wind, Zap, Eye, Gift, Flame,
  Clock, TreePine, Flower2, SunMedium, Leaf, Snowflake,
  Sunrise, Sunset, Moon, Rainbow, Baby, HeartPulse, Sun, Cloud, Home
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type ContentFilter = "all" | "pending" | "approved";
type ContentTab = "memories" | "stories" | "archive_memories" | "archive_stories";

interface ArchivedItem {
  id: string;
  type: "memory" | "story";
  data: MemoryWithTags | Story;
}

const CATEGORY_ICONS = [
  // Luoghi e Attività
  { icon: GraduationCap, name: "Scuola", color: "text-blue-500", key: "scuola" },
  { icon: Briefcase, name: "Lavoro", color: "text-gray-600", key: "lavoro" },
  { icon: Waves, name: "Mare", color: "text-cyan-500", key: "mare" },
  { icon: Mountain, name: "Montagna", color: "text-green-600", key: "montagna" },
  { icon: Users, name: "Famiglia", color: "text-amber-600", key: "famiglia" },
  { icon: Handshake, name: "Amicizia", color: "text-purple-500", key: "amicizia" },
  { icon: PartyPopper, name: "Feste", color: "text-pink-500", key: "feste" },
  { icon: VenetianMask, name: "Carnevale", color: "text-violet-500", key: "carnevale" },
  { icon: Ghost, name: "Halloween", color: "text-orange-500", key: "halloween" },
  { icon: Plane, name: "Viaggi", color: "text-sky-500", key: "viaggi" },
  { icon: Palmtree, name: "Vacanze", color: "text-teal-500", key: "vacanze" },
  { icon: User, name: "Parenti", color: "text-rose-500", key: "parenti" },
  { icon: Music, name: "Musica", color: "text-fuchsia-500", key: "musica" },
  { icon: Coffee, name: "Momenti", color: "text-amber-700", key: "momenti" },
  
  // Emozioni - Gioia
  { icon: Heart, name: "Gioia", color: "text-red-500", key: "gioia" },
  { icon: Smile, name: "Felicità", color: "text-yellow-500", key: "felicita" },
  { icon: HeartHandshake, name: "Amore", color: "text-pink-500", key: "amore" },
  { icon: Sparkles, name: "Serenità", color: "text-cyan-500", key: "serenita" },
  { icon: PartyPopper, name: "Festa", color: "text-purple-500", key: "festa" },
  { icon: Music, name: "Allegria", color: "text-pink-400", key: "allegria" },
  { icon: Sun, name: "Luce", color: "text-amber-500", key: "luce" },
  
  // Emozioni - Malinconia
  { icon: CloudRain, name: "Malinconia", color: "text-blue-400", key: "malinconia" },
  { icon: Cloud, name: "Tristezza", color: "text-gray-500", key: "tristezza" },
  { icon: HeartCrack, name: "Delusione", color: "text-red-400", key: "delusione" },
  { icon: Wind, name: "Rabbia", color: "text-orange-400", key: "rabbia" },
  { icon: Zap, name: "Paura", color: "text-yellow-400", key: "paura" },
  { icon: Eye, name: "Meraviglia", color: "text-indigo-400", key: "meraviglia" },
  
  // Moment
  { icon: Camera, name: "Ricordo", color: "text-teal-400", key: "ricordo" },
  { icon: Cake, name: "Compleanno", color: "text-red-400", key: "compleanno" },
  { icon: Gift, name: "Regalo", color: "text-pink-400", key: "regalo" },
  { icon: Flame, name: "Commemorazione", color: "text-amber-600", key: "commemorazione" },
  { icon: Clock, name: "Tempo", color: "text-slate-500", key: "tempo" },
  
  // Natura
  { icon: TreePine, name: "Natura", color: "text-green-500", key: "natura" },
  { icon: Flower2, name: "Primavera", color: "text-pink-300", key: "primavera" },
  { icon: SunMedium, name: "Estate", color: "text-orange-500", key: "estate" },
  { icon: Leaf, name: "Autunno", color: "text-amber-600", key: "autunno" },
  { icon: Snowflake, name: "Inverno", color: "text-blue-300", key: "inverno" },
  { icon: Sunrise, name: "Alba", color: "text-orange-400", key: "alba" },
  { icon: Sunset, name: "Tramonto", color: "text-red-300", key: "tramonto" },
  { icon: Moon, name: "Notte", color: "text-indigo-500", key: "notte" },
  { icon: Star, name: "Stelle", color: "text-yellow-400", key: "stelle" },
  { icon: Rainbow, name: "Arcobaleno", color: "text-pink-300", key: "arcobaleno" },
  
  // Vita
  { icon: Baby, name: "Infanzia", color: "text-amber-400", key: "infanzia" },
  { icon: User, name: "Giovinezza", color: "text-blue-400", key: "giovinezza" },
  { icon: Briefcase, name: "Adulta", color: "text-slate-600", key: "adulta" },
  { icon: GraduationCap, name: "Laurea", color: "text-indigo-500", key: "laurea" },
  { icon: HeartPulse, name: "Matrimonio", color: "text-pink-500", key: "matrimonio" },
  { icon: Home, name: "Casa", color: "text-amber-600", key: "casa" },
];

const getTagIcon = (tagName: string) => {
  const normalizedName = tagName.toLowerCase().trim();
  const found = CATEGORY_ICONS.find(c => c.key === normalizedName || c.name.toLowerCase() === normalizedName);
  return found ? { Icon: found.icon, color: found.color } : { Icon: Star, color: "text-brand-accent" };
};

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
  const [archivedMemories, setArchivedMemories] = useState<MemoryWithTags[]>([]);
  const [archivedStories, setArchivedStories] = useState<Story[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState("");
  const [newTagIcon, setNewTagIcon] = useState("Star");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [rateLimited, setRateLimited] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);
  const [tagsExpanded, setTagsExpanded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const checkAuth = async () => {
    setAuthChecking(true);
    const res = await fetch("/api/admin/login");
    const data = await res.json();
    if (data.authenticated) {
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
    setArchivedMemories(Array.isArray(memData) ? memData : []);
    setArchivedStories(Array.isArray(storiesData) ? storiesData : []);
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (contentTab === "archive_memories" || contentTab === "archive_stories") {
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
    if (!confirm("Archiviare questa foto?")) return;
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
    if (!confirm("Archiviare questo racconto?")) return;
    setActionLoading(id);
    await fetch("/api/admin/stories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setStories((prev) => prev.filter((s) => s.id !== id));
    setActionLoading(null);
  };

  const handleRestoreMemory = async (id: string) => {
    setActionLoading(id);
    await fetch("/api/admin/archive", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "restore" }),
    });
    setArchivedMemories((prev) => prev.filter((m) => m.id !== id));
    setActionLoading(null);
  };

  const handleRestoreStory = async (id: string) => {
    setActionLoading(id);
    await fetch("/api/admin/archive", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "restore" }),
    });
    setArchivedStories((prev) => prev.filter((s) => s.id !== id));
    setActionLoading(null);
  };

  const handlePermanentDeleteMemory = async (id: string) => {
    if (!confirm("Eliminare definitivamente questa foto?")) return;
    setActionLoading(id);
    await fetch("/api/admin/archive", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "delete" }),
    });
    setArchivedMemories((prev) => prev.filter((m) => m.id !== id));
    setActionLoading(null);
  };

  const handlePermanentDeleteStory = async (id: string) => {
    if (!confirm("Eliminare definitivamente questo racconto?")) return;
    setActionLoading(id);
    await fetch("/api/admin/archive", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action: "delete" }),
    });
    setArchivedStories((prev) => prev.filter((s) => s.id !== id));
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

  const tabs = [
    { id: "memories" as ContentTab, label: "Foto", icon: Camera, count: memories.length },
    { id: "stories" as ContentTab, label: "Racconti", icon: BookOpen, count: stories.length },
    { id: "archive_memories" as ContentTab, label: "Archivio Foto", icon: FolderArchive, count: archivedMemories.length },
    { id: "archive_stories" as ContentTab, label: "Archivio Racconti", icon: FolderOpen, count: archivedStories.length },
  ];

  if (authChecking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-brand-accent animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/20 via-brand-accent/10 to-transparent rounded-3xl blur-xl" />
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50">
            <div className="text-center space-y-4 mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-accent to-[#a08060] rounded-2xl shadow-lg">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-semibold text-brand-text font-cormorant">
                Admin
              </h1>
              <p className="text-brand-muted font-dm-sans text-sm">
                Inserisci il PIN per accedere
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/20 to-[#C4A882]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted" />
                  <input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 rounded-xl border border-brand-border/50 bg-white/50 backdrop-blur-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20 font-dm-sans text-center tracking-widest text-2xl transition-all"
                    placeholder="••••"
                    maxLength={6}
                    disabled={rateLimited}
                    autoComplete="current-password"
                  />
                </div>
              </div>
              {error && (
                <p className="text-brand-danger text-xs text-center font-dm-sans bg-brand-danger/10 py-2 rounded-lg">
                  {error}
                  {rateLimited && retryAfter > 0 && ` (${retryAfter}s)`}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || rateLimited}
                className="w-full py-4 bg-gradient-to-r from-brand-accent to-[#a08060] text-white rounded-xl font-dm-sans font-medium hover:shadow-lg hover:shadow-brand-accent/25 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Accedi
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const currentItems = contentTab === "memories" ? memories :
                      contentTab === "stories" ? stories :
                      contentTab === "archive_memories" ? archivedMemories :
                      archivedStories;

  const filteredItems = currentItems.filter((item: any) => {
    if (contentFilter === "pending") return !item.is_approved;
    if (contentFilter === "approved") return item.is_approved;
    return true;
  });

  const isArchiveTab = contentTab === "archive_memories" || contentTab === "archive_stories";

  return (
    <div className="space-y-8 pt-8">
      {/* Header */}
      <ScrollReveal>
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-brand-accent/10 to-[#C4A882]/10 rounded-full">
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-dm-sans text-brand-muted">Pannello di Controllo</span>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setContentTab(tab.id)}
                  className={`group relative px-5 py-3 rounded-xl font-dm-sans text-sm transition-all duration-300 ${
                    contentTab === tab.id
                      ? "bg-gradient-to-r from-brand-accent to-[#a08060] text-white shadow-lg shadow-brand-accent/25"
                      : "bg-white/50 backdrop-blur-sm text-brand-muted hover:bg-white/80 border border-brand-border/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${contentTab === tab.id ? "text-white" : "text-brand-muted"}`} />
                    <span>{tab.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      contentTab === tab.id 
                        ? "bg-white/20 text-white" 
                        : "bg-brand-accent/10 text-brand-accent"
                    }`}>
                      {tab.count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Filters */}
      {!isArchiveTab && (
        <ScrollReveal delay={0.1}>
          <div className="flex justify-center">
            <div className="inline-flex bg-white/60 backdrop-blur-md rounded-2xl p-1.5 gap-1 shadow-lg shadow-brand-accent/10 border border-white/50">
              {[
                { id: "all" as ContentFilter, label: "Tutti", count: currentItems.length },
                { id: "pending" as ContentFilter, label: "In attesa", count: currentItems.filter((i: any) => !i.is_approved).length },
                { id: "approved" as ContentFilter, label: "Approvati", count: currentItems.filter((i: any) => i.is_approved).length },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setContentFilter(filter.id)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-dm-sans transition-all duration-300 ${
                    contentFilter === filter.id
                      ? "bg-gradient-to-r from-brand-accent to-[#a08060] text-white shadow-md"
                      : "text-brand-muted hover:text-brand-text hover:bg-white/50"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* Content */}
      <ScrollReveal delay={0.2}>
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-accent/10 to-[#C4A882]/10 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-brand-accent/50" />
            </div>
            <p className="text-brand-muted font-dm-sans">
              Nessun elemento {contentFilter === "pending" ? "in attesa" : contentFilter === "approved" ? "approvato" : ""} ✓
            </p>
          </div>
        ) : (
          <div className="grid gap-4 max-w-4xl mx-auto">
            {filteredItems.map((item: any, index: number) => {
              const isExpanded = expandedCards.has(item.id);
              const isMemory = contentTab === "memories" || contentTab === "archive_memories";
              
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className={`group relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg shadow-brand-accent/5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-brand-accent/10 hover:scale-[1.01] ${
                    hoveredCard === item.id ? "ring-2 ring-brand-accent/20" : ""
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-accent/5 to-[#C4A882]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex">
                    {/* Image preview for memories */}
                    {isMemory && item.image_url && (
                      <div className="w-32 h-32 shrink-0 relative overflow-hidden">
                        <img 
                          src={item.image_url} 
                          alt="" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                    )}
                    
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Status badge */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-3 py-1 rounded-full font-dm-sans ${
                              item.is_approved 
                                ? "bg-green-100/80 text-green-700 backdrop-blur-sm" 
                                : "bg-yellow-100/80 text-yellow-700 backdrop-blur-sm"
                            }`}>
                              {item.is_approved ? "Approvato" : "In attesa"}
                            </span>
                            {isArchiveTab && (
                              <span className="text-xs px-3 py-1 rounded-full bg-gray-100/80 text-gray-600 backdrop-blur-sm">
                                Archiviato
                              </span>
                            )}
                          </div>
                          
                          {/* Title/Caption */}
                          {isMemory ? (
                            <p className={`font-dm-sans text-sm text-brand-text ${isExpanded ? "" : "line-clamp-2"}`}>
                              {item.caption || <span className="text-brand-muted italic">Nessuna didascalia</span>}
                            </p>
                          ) : (
                            <h3 className="font-cormorant text-xl text-brand-text mb-1">{item.title}</h3>
                          )}
                          
                          {!isMemory && (
                            <p className={`font-dm-sans text-sm text-[#666] ${isExpanded ? "" : "line-clamp-2"}`}>
                              {item.body}
                            </p>
                          )}
                          
                          {/* Tags */}
                          {isMemory && item.memory_tags && item.memory_tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {item.memory_tags.map((mt: MemoryTagJoin) => {
                                const { Icon, color } = getTagIcon(mt.tags.name);
                                return (
                                  <span key={mt.tag_id} className="text-xs bg-brand-accent/10 px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                                    <Icon className={`w-3 h-3 ${color}`} />
                                    <span className="text-brand-text">{mt.tags.name}</span>
                                  </span>
                                );
                              })}
                            </div>
                          )}
                          
                          {/* Author & Date */}
                          <p className="text-xs text-brand-muted mt-2 font-dm-sans">
                            di <strong>{item.author_name}</strong>
                            {item.created_at && ` · ${new Date(item.created_at).toLocaleDateString("it-IT")}`}
                          </p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => toggleExpand(item.id)} 
                            className="p-2.5 text-brand-muted hover:bg-brand-accent/10 hover:text-brand-accent rounded-xl transition-all duration-300"
                          >
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </button>
                          
                          {!isArchiveTab && !item.is_approved && (
                            <button 
                              onClick={() => isMemory ? handleApproveMemory(item.id) : handleApproveStory(item.id)} 
                              disabled={actionLoading === item.id} 
                              className="p-2.5 bg-green-100/80 hover:bg-green-200/80 text-green-600 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg disabled:opacity-50 backdrop-blur-sm"
                              title="Approva"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                          )}
                          
                          {isArchiveTab ? (
                            <>
                              <button 
                                onClick={() => isMemory ? handleRestoreMemory(item.id) : handleRestoreStory(item.id)} 
                                disabled={actionLoading === item.id} 
                                className="p-2.5 bg-blue-100/80 hover:bg-blue-200/80 text-blue-600 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg disabled:opacity-50 backdrop-blur-sm"
                                title="Ripristina"
                              >
                                <RotateCcw className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => isMemory ? handlePermanentDeleteMemory(item.id) : handlePermanentDeleteStory(item.id)} 
                                disabled={actionLoading === item.id} 
                                className="p-2.5 bg-red-100/80 hover:bg-red-200/80 text-red-600 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg disabled:opacity-50 backdrop-blur-sm"
                                title="Elimina"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => isMemory ? handleArchiveMemory(item.id) : handleArchiveStory(item.id)} 
                              disabled={actionLoading === item.id} 
                              className="p-2.5 bg-gray-100/80 hover:bg-gray-200/80 text-gray-600 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg disabled:opacity-50 backdrop-blur-sm"
                              title="Archivia"
                            >
                              <Archive className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="relative px-4 pb-4 border-t border-brand-border/30 pt-3 mt-2">
                      <p className="text-xs text-brand-muted mb-2 font-dm-sans">Contenuto completo:</p>
                      <p className="font-dm-sans text-sm text-brand-text whitespace-pre-wrap bg-white/50 p-3 rounded-xl backdrop-blur-sm">
                        {isMemory ? item.caption : item.body}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </ScrollReveal>

      {/* Categories Section */}
      <ScrollReveal delay={0.3}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setTagsExpanded(!tagsExpanded)}
            className="w-full px-6 py-4 bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg shadow-brand-accent/10 border border-white/50 font-dm-sans text-sm text-brand-text flex items-center justify-between hover:shadow-xl hover:shadow-brand-accent/15 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-accent/20 to-[#C4A882]/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-accent" />
              </div>
              <span>Categorie Tag ({tags.length})</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-brand-muted transition-transform duration-300 ${tagsExpanded ? "rotate-180" : ""}`} />
          </button>

          {tagsExpanded && (
            <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 fade-in duration-300">
              {/* Add new tag */}
              <form onSubmit={handleAddTag} className="flex gap-2 p-4 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Nome categoria"
                  className="flex-1 px-4 py-3 rounded-xl border border-brand-border/30 bg-white/50 backdrop-blur-sm focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/20 font-dm-sans text-sm transition-all"
                />
                <select
                  value={newTagIcon}
                  onChange={(e) => setNewTagIcon(e.target.value)}
                  className="px-3 py-3 rounded-xl border border-brand-border/30 bg-white/50 backdrop-blur-sm focus:border-brand-accent focus:outline-none font-dm-sans text-sm transition-all"
                >
                  {CATEGORY_ICONS.map((c) => (
                    <option key={c.key} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="px-5 py-3 bg-gradient-to-r from-brand-accent to-[#a08060] text-white rounded-xl hover:shadow-lg hover:shadow-brand-accent/25 transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>

              {/* Tags grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tags.map((tag) => {
                  const { Icon, color } = getTagIcon(tag.name);
                  return (
                  <div
                    key={tag.id}
                    className="group relative bg-white/60 backdrop-blur-xl rounded-xl p-3 shadow-md border border-white/50 hover:shadow-lg hover:shadow-brand-accent/10 transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span className="font-dm-sans text-sm flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${color}`} />
                      <span className="text-brand-text">{tag.name}</span>
                    </span>
                    <button
                      onClick={() => handleDeleteTag(tag.id)}
                      className="absolute top-2 right-2 p-1.5 text-brand-danger opacity-0 group-hover:opacity-100 hover:bg-brand-danger/10 rounded-lg transition-all duration-300"
                      aria-label={`Elimina ${tag.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  );
                })}
              </div>

              {/* Quick add icons */}
              <div className="p-4 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/30">
                <p className="text-xs text-brand-muted mb-3 font-dm-sans">Icone rapide:</p>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_ICONS.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setNewTagIcon(cat.name)}
                        className={`p-2.5 rounded-xl transition-all duration-300 hover:scale-110 ${
                          newTagIcon === cat.name
                            ? "bg-brand-accent text-white shadow-lg" 
                            : "bg-white/60 text-brand-text hover:bg-brand-accent/10"
                        }`}
                        title={cat.name}
                      >
                        <Icon className={`w-5 h-5 ${newTagIcon === cat.name ? "text-white" : cat.color}`} />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}
