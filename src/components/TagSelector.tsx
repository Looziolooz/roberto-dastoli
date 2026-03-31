"use client";

import { useState, useEffect } from "react";
import { Tag } from "@/types";
import { Plus, X, Loader2 } from "lucide-react";
import { TAG_ICONS } from "@/lib/tag-icons";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tagIds: string[] | ((prev: string[]) => string[])) => void;
  showCreateForm?: boolean;
  className?: string;
}

export function TagSelector({ 
  selectedTags, 
  onTagsChange, 
  showCreateForm = true,
  className = "" 
}: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [showNewTagForm, setShowNewTagForm] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [creatingTag, setCreatingTag] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/tags");
        if (res.ok) {
          const data = await res.json();
          setTags(data ?? []);
        }
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };
    fetchTags();
  }, []);

  const getAutoIcon = (name: string): string => {
    const normalizedName = name.toLowerCase().trim();
    const found = TAG_ICONS.find(
      (t) => t.key === normalizedName || t.name.toLowerCase() === normalizedName
    );
    return found ? found.emoji : "🏷️";
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    setCreatingTag(true);

    const icon = getAutoIcon(newTagName);

    try {
      const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName.trim(), icon }),
      });

      if (res.ok) {
        const tag = await res.json();
        setTags((prev) => [...prev, tag]);
        onTagsChange((prev) => [...prev, tag.id]);
        setNewTagName("");
        setShowNewTagForm(false);
      }
    } catch (error) {
      console.error("Failed to create tag:", error);
    } finally {
      setCreatingTag(false);
    }
  };

  const toggleTag = (tagId: string) => {
    onTagsChange(
      selectedTags.includes(tagId)
        ? selectedTags.filter((id) => id !== tagId)
        : [...selectedTags, tagId]
    );
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-dm-sans text-brand-muted">
          Categoria
        </label>
        {showCreateForm && (
          <button
            type="button"
            onClick={() => setShowNewTagForm(!showNewTagForm)}
            className="text-xs text-brand-accent hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Nuova categoria
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto scrollbar-hide -mx-2 px-2">
        <div className="flex flex-wrap gap-2 min-w-max pb-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              aria-pressed={selectedTags.includes(tag.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-dm-sans transition-colors shrink-0 ${
                selectedTags.includes(tag.id)
                  ? "bg-brand-accent text-white"
                  : "bg-brand-bg text-brand-muted hover:border-brand-accent-light border border-transparent"
              }`}
            >
              {tag.icon} {tag.name}
            </button>
          ))}
        </div>
      </div>
      
      {showCreateForm && showNewTagForm && (
        <form onSubmit={handleCreateTag} className="mt-3 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Nome categoria"
            className="flex-1 px-3 py-2 rounded-lg border border-brand-border focus:border-brand-accent focus:outline-none text-sm font-dm-sans"
            maxLength={20}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creatingTag || !newTagName.trim()}
              className="px-3 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-accent/80 transition-colors disabled:opacity-50 text-sm"
            >
              {creatingTag ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aggiungi"}
            </button>
            <button
              type="button"
              onClick={() => { setShowNewTagForm(false); setNewTagName(""); }}
              className="p-2 text-brand-muted hover:text-brand-danger"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

interface TagFilterProps {
  tags: Tag[];
  selectedTag: string | null;
  onTagChange: (tagId: string | null) => void;
  allLabel?: string;
  className?: string;
}

export function TagFilter({ 
  tags, 
  selectedTag, 
  onTagChange, 
  allLabel = "Tutte",
  className = "" 
}: TagFilterProps) {
  return (
    <div className={`overflow-x-auto scrollbar-hide px-4 -mx-4 ${className}`}>
      <div className="flex gap-2 justify-start min-w-max pb-2">
        <button
          onClick={() => onTagChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-dm-sans transition-all shrink-0 ${
            selectedTag === null
              ? "bg-brand-accent text-white shadow-md"
              : "bg-white text-brand-muted border border-brand-border hover:border-brand-accent hover:shadow-sm"
          }`}
        >
          {allLabel}
        </button>
        {tags.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagChange(tag.id === selectedTag ? null : tag.id)}
            className={`px-4 py-2 rounded-full text-sm font-dm-sans transition-all shrink-0 ${
              selectedTag === tag.id
                ? "bg-brand-accent text-white shadow-md"
                : "bg-white text-brand-muted border border-brand-border hover:border-brand-accent hover:shadow-sm"
            }`}
          >
            {tag.icon} {tag.name}
          </button>
        ))}
      </div>
    </div>
  );
}
