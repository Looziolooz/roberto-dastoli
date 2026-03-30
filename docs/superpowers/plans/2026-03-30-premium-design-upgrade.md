# Design Premium Upgrade Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Elevate the entire Luogo dei Ricordi website to a premium level with smooth animations, parallax effects, and modern design patterns.

**Architecture:** Implement Framer Motion animations, Lenis smooth scrolling, 3D card effects, and parallax sections across all pages while maintaining SEO and performance.

**Tech Stack:** Next.js 14, Framer Motion, Lenis, Radix UI Dialog

---

### Task 1: Setup SmoothScroll with Lenis

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create SmoothScroll component**

Create `src/components/SmoothScroll.tsx`:
```tsx
"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);
  return null;
}
```

- [ ] **Step 2: Add SmoothScroll to layout**

Modify `src/app/layout.tsx`, add import and add `<SmoothScroll />` inside `<body>`:
```tsx
import { SmoothScroll } from "@/components/SmoothScroll";

// Inside body:
<SmoothScroll />
```

- [ ] **Step 3: Commit**
```bash
git add src/components/SmoothScroll.tsx src/app/layout.tsx
git commit -m "feat: add smooth scroll with Lenis"
```

---

### Task 2: Rewrite ScrollReveal with Framer Motion

**Files:**
- Modify: `src/components/ScrollReveal.tsx`

- [ ] **Step 1: Rewrite ScrollReveal component**

```tsx
"use client";
import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
}

export function ScrollReveal({ children, delay = 0, className = "", direction = "up" }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 40 : 0,
      x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**
```bash
git add src/components/ScrollReveal.tsx
git commit -m "feat: rewrite ScrollReveal with Framer Motion"
```

---

### Task 3: Hero with Parallax

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Extract HeroSection as client component**

Create `src/components/HeroSection.tsx`:
```tsx
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
```

- [ ] **Step 2: Update page.tsx to use HeroSection**

Modify `src/app/page.tsx` to import and use `<HeroSection />` instead of the inline hero.

- [ ] **Step 3: Commit**
```bash
git add src/components/HeroSection.tsx src/app/page.tsx
git commit -m "feat: add parallax hero with Framer Motion"
```

---

### Task 4: AnimatedCard with 3D Tilt

**Files:**
- Create: `src/components/AnimatedCard.tsx`
- Modify: `src/app/page.tsx` (navigation cards)

- [ ] **Step 1: Create AnimatedCard component**

```tsx
"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  intensity?: number;
}

export function AnimatedCard({ children, className = "", onClick, intensity = 0.5 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8 * intensity, -8 * intensity]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8 * intensity, 8 * intensity]);
  const glareX = useTransform(springX, [-0.5, 0.5], ["10%", "90%"]);
  const glareY = useTransform(springY, [-0.5, 0.5], ["10%", "90%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(139,115,85,0.15)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.12) 0%, transparent 60%)`,
          transition: "opacity 0.3s",
        }}
      />
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Wrap navigation cards with AnimatedCard in page.tsx**

- [ ] **Step 3: Commit**
```bash
git add src/components/AnimatedCard.tsx src/app/page.tsx
git commit -m "feat: add AnimatedCard with 3D tilt effect"
```

---

### Task 5: Gallery with Animated Cards and Modal

**Files:**
- Modify: `src/app/galleria/page.tsx`

- [ ] **Step 1: Add motion buttons and AnimatePresence for modal**

Wrap gallery cards with motion components and add AnimatePresence for the modal with spring animations.

- [ ] **Step 2: Commit**
```bash
git add src/app/galleria/page.tsx
git commit -m "feat: enhance gallery with motion animations"
```

---

### Task 6: Stagger Animation for Nav Cards

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add stagger animations**

Add containerVariants and cardVariants to the navigation cards section.

- [ ] **Step 2: Commit**
```bash
git add src/app/page.tsx
git commit -m "feat: add stagger animations to nav cards"
```

---

### Task 7: Header Animated Underline

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Add animated underline with layoutId**

```tsx
{pathname === link.href && (
  <motion.div
    className="absolute bottom-0.5 left-3.5 right-3.5 h-0.5 rounded-full bg-brand-accent"
    layoutId="nav-underline"
    transition={{ type: "spring", stiffness: 400, damping: 30 }}
  />
)}
```

- [ ] **Step 2: Commit**
```bash
git add src/components/Header.tsx
git commit -m "feat: add animated underline to header navigation"
```

---

### Task 8: Global CSS Enhancements

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add premium styles**

```css
::selection {
  background: rgba(139, 115, 85, 0.2);
  color: #2C2C2E;
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #F5F0EB; }
::-webkit-scrollbar-thumb { background: #C4A882; border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: #8B7355; }

@keyframes pageIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
main { animation: pageIn 0.5s ease forwards; }
```

- [ ] **Step 2: Commit**
```bash
git add src/app/globals.css
git commit -m "feat: add global premium styles"
```

---

### Final Commit

```bash
git add -A
git commit -m "feat: complete premium design upgrade - animations, parallax, smooth scroll"
git push
```
