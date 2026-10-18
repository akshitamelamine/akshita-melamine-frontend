"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f5f1e8]">

      {/* Background Image */}
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <div
          className="h-full w-full bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/images/hero.jpeg')",
          }}
        />
      </motion.div>

      {/* Image Overlay */}
      <div className="absolute inset-0 bg-black/25" />

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen items-end px-6 pb-16 md:px-10 md:pb-20">
        <div className="max-w-5xl text-white">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-5 text-xs uppercase tracking-[0.35em]"
          >
            Hospitality Tableware · Commercial Melamine
          </motion.p>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="max-w-5xl text-5xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl"
          >
            Tableware designed
            <br />
            for hospitality.
          </motion.h1>

          {/* Supporting copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-7 max-w-xl text-sm leading-relaxed text-white/85 md:text-base"
          >
            Commercial-quality melamine tableware for
            hotels, restaurants, cafés, catering services,
            and institutional dining.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#collections"
              className="inline-flex justify-center border border-white bg-white px-7 py-4 text-xs uppercase tracking-[0.2em] text-black transition-all duration-300 hover:bg-transparent hover:text-white"
            >
              Explore Collection
            </a>

            <a
              href="/catalog/akshita-hospitality-catalog.pdf"
              download
              className="inline-flex justify-center border border-white px-7 py-4 text-xs uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              Download Catalog
            </a>
          </motion.div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 right-6 z-10 flex items-center gap-3 text-xs tracking-[0.2em] text-white md:right-10"
      >
        <span>SCROLL</span>

        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          ↓
        </motion.span>
      </motion.div>

    </section>
  );
}