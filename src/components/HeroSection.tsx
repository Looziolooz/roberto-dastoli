"use client";
import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden w-screen max-w-[100vw] -mx-[calc(50vw-50%)]">
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <Image
          src="/photos/06-ritratto-teen.jpg"
          alt="Roberto"
          fill
          className="object-cover grayscale"
          style={{ objectPosition: "50% 20%" }}
          priority
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gray-900/80" />

      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center pb-12 px-6 h-full"
        style={{ opacity }}
      >
        <motion.div
          className="flex items-center gap-3 mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.div className="h-px bg-white/70" initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: 0.6, duration: 0.8 }} />
          <span className="text-white text-xs font-dm-sans tracking-[0.25em] uppercase">per sempre con noi</span>
          <motion.div className="h-px bg-white/70" initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: 0.6, duration: 0.8 }} />
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-semibold text-white font-cormorant leading-none mb-5"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Roberto Dastoli
        </motion.h1>

        <motion.p
          className="text-xl text-white/85 max-w-md font-cormorant italic mb-10 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.9 }}
        >
          Uno spazio dove i ricordi diventano immortali
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          <Link href="/storia" className="px-6 py-3 bg-white text-brand-text rounded-lg font-dm-sans font-medium hover:bg-white/90 transition-all hover:shadow-lg">
            La sua storia
          </Link>
          <Link href="/galleria" className="px-6 py-3 border-2 border-white text-white rounded-lg font-dm-sans font-medium hover:bg-white/20 transition-all backdrop-blur-sm">
            Galleria
          </Link>
          <Link href="/carica" className="px-6 py-3 bg-brand-accent text-white rounded-lg font-dm-sans font-medium hover:bg-brand-accent/80 transition-all hover:shadow-md">
            Condividi un ricordo
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
      >
        <span className="text-white/50 text-xs font-dm-sans tracking-widest">SCORRI</span>
        <motion.div className="w-px h-8 bg-white/40" animate={{ scaleY: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} style={{ transformOrigin: "top" }} />
      </motion.div>
    </section>
  );
}
