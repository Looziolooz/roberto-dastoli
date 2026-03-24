import { ScrollReveal } from "@/components/ScrollReveal";
import { BIOGRAPHY_CHAPTERS } from "@/data/biography";

export default function StoriaPage() {
  return (
    <div className="space-y-12 pt-8">
      <ScrollReveal>
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-semibold text-[#2C2C2E] font-cormorant">La sua storia</h1>
          <p className="text-[#8E8E93] max-w-lg mx-auto font-dm-sans">
            Un viaggio attraverso i momenti che hanno definito una vita straordinaria
          </p>
        </div>
      </ScrollReveal>

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#E5DFD7] -translate-x-1/2 hidden md:block" />

        <div className="space-y-16">
          {BIOGRAPHY_CHAPTERS.map((chapter, index) => (
            <ScrollReveal key={chapter.period} delay={index * 0.15}>
              <div className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="flex-1 hidden md:block" />
                <div className="flex flex-col items-center">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg"
                    style={{ backgroundColor: chapter.color }}
                  >
                    {chapter.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E5DFD7]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-dm-sans text-[#8E8E93]">{chapter.years}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-[#2C2C2E] font-cormorant mb-3" style={{ color: chapter.color }}>
                      {chapter.period}
                    </h3>
                    <p className="text-[#2C2C2E] font-cormorant leading-relaxed">{chapter.text}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <ScrollReveal delay={0.8}>
        <div className="text-center bg-white rounded-xl p-8 shadow-sm border border-[#E5DFD7]">
          <p className="text-2xl font-cormorant italic text-[#8B7355]">
            "Non chi parte, ma chi resta nel cuore."
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}