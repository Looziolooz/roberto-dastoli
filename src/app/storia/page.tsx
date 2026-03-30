import Image from "next/image";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BIOGRAPHY_CHAPTERS } from "@/data/biography";
import { Sparkles } from "lucide-react";

export default function StoriaPage() {
  return (
    <div className="space-y-0 pb-16">
      {/* Hero */}
      <ScrollReveal>
        <div className="text-center space-y-4 py-16 px-4">
          <div className="flex justify-center">
            <Sparkles className="w-6 h-6 text-brand-accent opacity-60" />
          </div>
          <h1 className="text-5xl font-semibold text-brand-text font-cormorant leading-tight">
            La sua storia
          </h1>
          <p className="text-brand-muted max-w-lg mx-auto font-dm-sans leading-relaxed">
            Un viaggio attraverso i momenti che hanno definito una vita straordinaria.
            Scorri per scoprire ogni capitolo.
          </p>
          <div className="w-16 h-px bg-brand-accent mx-auto opacity-40 mt-6" />
        </div>
      </ScrollReveal>

      {/* Scrollytelling Chapters */}
      {BIOGRAPHY_CHAPTERS.map((chapter, index) => (
        <ScrollReveal key={chapter.period} delay={0.1}>
          <section 
            className="min-h-[80vh] flex items-center justify-center py-16 px-4"
            style={{ 
              background: index % 2 === 0 
                ? 'linear-gradient(180deg, #F5F0EB 0%, rgba(255,255,255,0.5) 100%)'
                : 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, #F5F0EB 100%)'
            }}
          >
            <div className="max-w-5xl w-full">
              {/* Chapter Number */}
              <div className="text-center mb-8">
                <span 
                  className="inline-block text-6xl font-cormorant font-bold opacity-10"
                  style={{ color: chapter.color }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Photo */}
                <div className="flex-1 w-full">
                  <div 
                    className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
                    style={{ 
                      boxShadow: `0 25px 50px -12px ${chapter.color}33`
                    }}
                  >
                    <Image
                      src={chapter.photo ?? "/placeholder.jpg"}
                      alt={chapter.period}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      loading={index < 2 ? "eager" : "lazy"}
                      style={{
                        objectPosition: chapter.photoPosition
                          ? `${chapter.photoPosition.x}% ${chapter.photoPosition.y}%`
                          : "50% 50%",
                      }}
                    />
                    {/* Gradient overlay */}
                    <div 
                      className="absolute inset-0"
                      style={{ 
                        background: `linear-gradient(135deg, ${chapter.color}15 0%, transparent 50%, ${chapter.color}10 100%)`
                      }}
                    />
                    {/* Corner accent */}
                    <div 
                      className="absolute top-0 left-0 w-16 h-16"
                      style={{ 
                        borderTop: `3px solid ${chapter.color}`,
                        borderLeft: `3px solid ${chapter.color}`
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 w-full text-center lg:text-left">
                  {/* Period badge */}
                  <div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                    style={{ 
                      backgroundColor: chapter.color + '15',
                      border: `1px solid ${chapter.color}33`
                    }}
                  >
                    <span 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ 
                        backgroundColor: chapter.color + '22',
                        border: `1.5px solid ${chapter.color}55`
                      }}
                    >
                      {chapter.icon}
                    </span>
                    <span 
                      className="text-sm font-semibold"
                      style={{ color: chapter.color }}
                    >
                      {chapter.period}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 
                    className="text-3xl lg:text-4xl font-semibold font-cormorant mb-3"
                    style={{ color: chapter.color }}
                  >
                    {chapter.period}
                  </h2>

                  {/* Years */}
                  <p className="text-lg text-brand-muted font-dm-sans mb-6">
                    {chapter.years}
                  </p>

                  {/* Description */}
                  <p className="text-brand-text font-cormorant text-lg leading-relaxed max-w-md">
                    {chapter.text}
                  </p>

                  {/* Decorative line */}
                  <div 
                    className="w-16 h-px mt-8 mx-auto lg:mx-0"
                    style={{ backgroundColor: chapter.color }}
                  />
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      ))}

      {/* Closing Quote */}
      <ScrollReveal>
        <section className="py-24 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div 
              className="inline-block p-8 rounded-2xl"
              style={{ 
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(31,38,135,0.08)'
              }}
            >
              <Sparkles className="w-8 h-8 text-brand-accent mx-auto mb-4 opacity-40" />
              <p className="text-2xl lg:text-3xl font-cormorant italic text-brand-text leading-relaxed mb-6">
                "Non chi parte, ma chi resta nel cuore."
              </p>
              <p className="text-sm text-brand-muted font-dm-sans">
                — Roberto Dastoli
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
