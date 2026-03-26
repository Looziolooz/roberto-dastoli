import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BIOGRAPHY_CHAPTERS } from "@/data/biography";

// frontend-design + ui-designer: elevated memorial timeline
// Alternating left/right layout on desktop, full-width on mobile
// Each chapter has its photo + text, connected by a vertical golden thread

export default function StoriaPage() {
  return (
    <div className="space-y-12 pt-8">
      {/* Hero */}
      <ScrollReveal>
        <div className="text-center space-y-4 pb-4">
          <div className="flex justify-center">
            <span className="text-3xl opacity-60">✦</span>
          </div>
          <h1 className="text-5xl font-semibold text-[#2C2C2E] font-cormorant leading-tight">
            La sua storia
          </h1>
          <p className="text-[#8E8E93] max-w-lg mx-auto font-dm-sans leading-relaxed">
            Un viaggio attraverso i momenti che hanno definito una vita straordinaria.
            Ogni foto, ogni capitolo, ogni sorriso — per sempre con noi.
          </p>
          <div className="w-16 h-px bg-[#8B7355] mx-auto opacity-40 mt-4" />
        </div>
      </ScrollReveal>

      {/* Timeline */}
      <div className="relative">
        {/* Central vertical line — hidden on mobile */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, #C4A882 8%, #C4A882 92%, transparent 100%)",
          }}
        />

        <div className="space-y-20">
          {BIOGRAPHY_CHAPTERS.map((chapter, index) => {
            const isLeft = index % 2 === 0;
            return (
              <ScrollReveal key={chapter.period} delay={index * 0.08}>
                <div
                  className={`flex items-center gap-0 md:gap-8 flex-col ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* ── Content side ── */}
                  <div className="flex-1 w-full">
                    <div
                      className={`bg-white rounded-2xl p-6 shadow-sm border border-[#E5DFD7] relative
                        ${isLeft ? "md:mr-8" : "md:ml-8"}`}
                      style={{
                        borderLeft: `3px solid ${chapter.color}`,
                      }}
                    >
                      {/* Period badge */}
                      <div className="flex items-center gap-3 mb-3">
                        <span
                          className="w-9 h-9 rounded-full flex items-center justify-center text-base shadow-sm flex-shrink-0"
                          style={{ backgroundColor: chapter.color + "22", border: `1.5px solid ${chapter.color}55` }}
                        >
                          {chapter.icon}
                        </span>
                        <div>
                          <h3
                            className="text-lg font-semibold font-cormorant leading-tight"
                            style={{ color: chapter.color }}
                          >
                            {chapter.period}
                          </h3>
                          <span className="text-xs text-[#8E8E93] font-dm-sans">
                            {chapter.years}
                          </span>
                        </div>
                      </div>

                      <p className="text-[#2C2C2E] font-cormorant leading-relaxed text-base">
                        {chapter.text}
                      </p>
                    </div>
                  </div>

                  {/* ── Central dot on the line ── */}
                  <div className="hidden md:flex flex-col items-center flex-shrink-0 z-10">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: chapter.color }}
                    />
                  </div>

                  {/* ── Photo side ── */}
                  <div className="flex-1 w-full mt-4 md:mt-0 flex justify-center">
                    <div
                      className={`relative rounded-full overflow-hidden shadow-md
                        ${isLeft ? "md:ml-8" : "md:mr-8"}`}
                      style={{
                        width: "clamp(160px, 25vw, 240px)",
                        height: "clamp(160px, 25vw, 240px)",
                        border: `2px solid ${chapter.color}33`,
                      }}
                    >
                      <Image
                        src={chapter.photo ?? "/placeholder.jpg"}
                        alt={chapter.period}
                        fill
                        className="object-cover"
                        sizes="clamp(160px, 25vw, 240px)"
                        loading={index < 2 ? "eager" : "lazy"}
                        style={{
                          objectPosition: chapter.photoPosition
                            ? `${chapter.photoPosition.x}% ${chapter.photoPosition.y}%`
                            : "50% 50%",
                        }}
                      />
                      <div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                          background: `linear-gradient(135deg, ${chapter.color}18 0%, transparent 60%)`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>

      {/* Closing quote */}
      <ScrollReveal delay={0.5}>
        <div className="text-center bg-white rounded-2xl p-10 shadow-sm border border-[#E5DFD7] max-w-2xl mx-auto">
          <div className="text-4xl text-[#8B7355] opacity-30 font-cormorant leading-none mb-4">
            ❝
          </div>
          <p className="text-2xl font-cormorant italic text-[#8B7355] leading-relaxed">
            "Non chi parte, ma chi resta nel cuore."
          </p>
          <div className="w-12 h-px bg-[#8B7355] mx-auto opacity-30 mt-6" />
        </div>
      </ScrollReveal>
    </div>
  );
}
