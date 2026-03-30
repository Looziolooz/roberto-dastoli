"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { MemoryWithTags, MemoryTagJoin } from "@/types";

interface InlineLightboxProps {
  memories: MemoryWithTags[];
  selectedIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function InlineLightbox({ 
  memories, 
  selectedIndex, 
  onClose, 
  onNavigate 
}: InlineLightboxProps) {
  const selected = memories[selectedIndex];
  
  if (!selected) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 bg-black/90 backdrop-blur-md"
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
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Navigation */}
        {selectedIndex > 0 && (
          <button
            onClick={() => onNavigate(selectedIndex - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
            aria-label="Immagine precedente"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}
        {selectedIndex < memories.length - 1 && (
          <button
            onClick={() => onNavigate(selectedIndex + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
            aria-label="Immagine successiva"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Content - scrollable */}
        <div className="h-full overflow-y-auto custom-scrollbar p-8 md:p-16">
          <motion.div
            className="relative max-w-4xl w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {selected.image_url ? (
              <div className="relative aspect-auto flex justify-center">
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
                <p className="text-lg font-cormorant text-white mb-3">
                  {selected.caption}
                </p>
              )}
              <div className="flex justify-center gap-2 flex-wrap">
                {selected.memory_tags?.map((mt: MemoryTagJoin) => (
                  <span
                    key={mt.tag_id}
                    className="px-3 py-1 bg-white/20 text-white rounded-full text-sm"
                  >
                    {mt.tags.icon} {mt.tags.name}
                  </span>
                ))}
              </div>
              {selected.author_name && (
                <p className="text-sm text-white/60 mt-3">
                  di {selected.author_name}
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
