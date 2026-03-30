# Storia & Galleria Premium Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform "La sua storia" timeline into glassmorphism card grid, and convert "Galleria" modal to inline lightbox

**Architecture:** 
- Storia: Replace alternating timeline with CSS Grid masonry layout + glassmorphism cards
- Galleria: Replace modal overlay with inline expansion using Framer Motion layout animations

**Tech Stack:** Next.js, Framer Motion, Tailwind CSS

---

## File Structure

### New Files
- `src/components/GlassCard.tsx` — Reusable glassmorphism card component
- `src/components/InlineLightbox.tsx` — Inline lightbox component for gallery

### Modified Files
- `src/app/storia/page.tsx` — Replace timeline with grid layout
- `src/app/galleria/page.tsx` — Replace modal with inline lightbox
- `src/app/globals.css` — Add glassmorphism utility classes

---

## Task 1: Add Glassmorphism CSS Utilities

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add glassmorphism utility classes**

```css
.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 
    0 8px 32px rgba(31, 38, 135, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
}

.glass-card-hover:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 16px 48px rgba(31, 38, 135, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}
```

---

## Task 2: Create GlassCard Component

**Files:**
- Create: `src/components/GlassCard.tsx`

- [ ] **Step 1: Create GlassCard component**

```tsx
"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: Record<string, string>;
  delay?: number;
}

export function GlassCard({ children, className = "", style, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card glass-card-hover rounded-2xl overflow-hidden transition-all duration-300 ${className}`}
      style={style}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" as const }}
    >
      {children}
    </motion.div>
  );
}
```

---

## Task 3: Redesign Storia Page with Grid Layout

**Files:**
- Modify: `src/app/storia/page.tsx`

- [ ] **Step 1: Update imports**

```tsx
import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";
import { GlassCard } from "@/components/GlassCard";
import { BIOGRAPHY_CHAPTERS } from "@/data/biography";
import { Sparkles } from "lucide-react";
```

- [ ] **Step 2: Replace timeline layout with masonry grid**

Replace the entire timeline section (lines 30-131) with:

```tsx
{/* Hero - keep existing */}

{/* Masonry Grid */}
<div className="columns-1 md:columns-2 lg:columns-3 gap-5 max-w-6xl mx-auto px-4">
  {BIOGRAPHY_CHAPTERS.map((chapter, index) => (
    <div key={chapter.period} className="break-inside-avoid mb-5">
      <GlassCard delay={index * 0.08}>
        {/* Photo */}
        <div className="relative aspect-[16/10] w-full">
          <Image
            src={chapter.photo ?? "/placeholder.jpg"}
            alt={chapter.period}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading={index < 3 ? "eager" : "lazy"}
            style={{
              objectPosition: chapter.photoPosition
                ? `${chapter.photoPosition.x}% ${chapter.photoPosition.y}%`
                : "50% 50%",
            }}
          />
          <div 
            className="absolute inset-0 opacity-20"
            style={{ background: `linear-gradient(135deg, ${chapter.color} 0%, transparent 60%)` }}
          />
        </div>
        
        {/* Content */}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
              style={{ 
                backgroundColor: chapter.color + "22", 
                border: `1.5px solid ${chapter.color}55` 
              }}
            >
              {chapter.icon}
            </span>
            <span className="text-xs font-medium" style={{ color: chapter.color }}>
              {chapter.period}
            </span>
          </div>
          <p className="text-sm text-brand-muted font-dm-sans mb-2">
            {chapter.years}
          </p>
          <p className="text-brand-text font-cormorant leading-relaxed line-clamp-4">
            {chapter.text}
          </p>
        </div>
      </GlassCard>
    </div>
  ))}
</div>
```

- [ ] **Step 3: Keep hero and closing quote sections unchanged**

---

## Task 4: Create InlineLightbox Component

**Files:**
- Create: `src/components/InlineLightbox.tsx`

- [ ] **Step 1: Create InlineLightbox component**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { MemoryWithTags, MemoryTagJoin } from "@/types";

interface InlineLightboxProps {
  memories: MemoryWithTags[];
  selectedIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function InlineLightbox({ 
  memories, 
  selectedIndex, 
  onClose, 
  onNavigate 
}: InlineLightboxProps) {
  const selected = selectedIndex !== null ? memories[selectedIndex] : null;
  
  if (selectedIndex === null || !selected) return null;

  return (
    <motion.div
      className="fixed inset-0 z-40 bg-white/95 backdrop-blur-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors z-50"
        aria-label="Chiudi"
      >
        <X className="w-6 h-6 text-brand-text" />
      </button>

      {/* Navigation */}
      {selectedIndex > 0 && (
        <button
          onClick={() => onNavigate(selectedIndex - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
          aria-label="Immagine precedente"
        >
          <ChevronLeft className="w-6 h-6 text-brand-text" />
        </button>
      )}
      {selectedIndex < memories.length - 1 && (
        <button
          onClick={() => onNavigate(selectedIndex + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
          aria-label="Immagine successiva"
        >
          <ChevronRight className="w-6 h-6 text-brand-text" />
        </button>
      )}

      {/* Content */}
      <div className="h-full flex items-center justify-center p-8 md:p-16">
        <motion.div
          className="relative max-w-4xl max-h-[80vh] w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {selected.image_url ? (
            <div className="relative aspect-auto">
              <Image
                src={selected.image_url}
                alt={selected.caption || "Foto"}
                width={1200}
                height={800}
                className="max-h-[70vh] w-auto mx-auto object-contain rounded-lg shadow-2xl"
                priority
              />
            </div>
          ) : (
            <div className="w-64 h-64 bg-brand-bg rounded-full flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-brand-accent" />
            </div>
          )}
          
          {/* Caption */}
          <div className="mt-6 text-center">
            {selected.caption && (
              <p className="text-lg font-cormorant text-brand-text mb-3">
                {selected.caption}
              </p>
            )}
            <div className="flex justify-center gap-2 flex-wrap">
              {selected.memory_tags?.map((mt: MemoryTagJoin) => (
                <span
                  key={mt.tag_id}
                  className="px-3 py-1 bg-brand-accent/10 text-brand-accent rounded-full text-sm"
                >
                  {mt.tags.icon} {mt.tags.name}
                </span>
              ))}
            </div>
            {selected.author_name && (
              <p className="text-sm text-brand-muted mt-3">
                di {selected.author_name}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Add Sparkles import to InlineLightbox**

```tsx
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
```

---

## Task 5: Redesign Galleria Page with Inline Lightbox

**Files:**
- Modify: `src/app/galleria/page.tsx`

- [ ] **Step 1: Update imports**

```tsx
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Tag, MemoryWithTags, MemoryTagJoin } from "@/types";
import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";
import { InlineLightbox } from "@/components/InlineLightbox";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
```

- [ ] **Step 2: Replace modal state with inline lightbox state**

Change:
```tsx
const [selectedImage, setSelectedImage] = useState<MemoryWithTags | null>(null);
```

To:
```tsx
const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
```

- [ ] **Step 3: Update filteredMemories and handlers**

```tsx
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
```

- [ ] **Step 4: Remove the old modal JSX (lines 192-265) and replace with InlineLightbox**

Replace the entire modal section with:

```tsx
{/* Inline Lightbox */}
<AnimatePresence>
  {selectedIndex !== null && (
    <InlineLightbox
      memories={filteredMemories}
      selectedIndex={selectedIndex}
      onClose={closeLightbox}
      onNavigate={navigateLightbox}
    />
  )}
</AnimatePresence>
```

- [ ] **Step 5: Update grid item clicks**

In the grid mapping, change:
```tsx
onClick={() => setSelectedImage(memory)}
```

To:
```tsx
onClick={() => openLightbox(index)}
```

- [ ] **Step 6: Remove old modal useEffect (lines 47-60)**

Remove the Escape key handler and scroll lock since InlineLightbox handles this differently.

---

## Task 6: Build and Verify

**Files:**
- Run: `npm run build`

- [ ] **Step 1: Build the project**

Run: `npm run build`

Expected: Build succeeds without errors

- [ ] **Step 2: Test locally (optional)**

Run: `npm run dev`

Verify:
- Storia page shows glassmorphism cards in grid
- Hover effects work smoothly
- Galleria grid displays correctly
- Clicking image opens inline lightbox
- Navigation between images works
- Close button returns to grid

---

## Verification Checklist

### Storia Page
- [ ] Masonry grid layout displays correctly
- [ ] Glassmorphism effect visible (blur, border, shadow)
- [ ] Hover lift animation works
- [ ] Stagger scroll reveal on load
- [ ] Responsive at mobile/tablet/desktop

### Galleria Page
- [ ] Images display in grid
- [ ] Click expands to inline lightbox (not modal)
- [ ] Lightbox uses adaptive image sizing
- [ ] Close button collapses to grid
- [ ] Prev/next navigation works
- [ ] Tag filter still functions

### Performance
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] All imports resolve correctly
