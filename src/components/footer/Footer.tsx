"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 px-6 py-16 text-white md:px-10 md:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Top footer */}
        <div className="grid gap-12 md:grid-cols-12">

          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="md:col-span-5"
          >
            <p className="text-sm tracking-[0.25em]">
              AKSHITA
            </p>

            <p className="mt-1 text-[10px] tracking-[0.45em] text-white/50">
              MELAMINE
            </p>

            <p className="mt-8 max-w-sm text-sm leading-relaxed text-white/60">
              Commercial-quality melamine tableware for
              hotels, restaurants, cafés, catering services,
              and institutional dining.
            </p>
          </motion.div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-10 md:col-span-4">

            {/* Explore */}
            <div>
              <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-white/40">
                Explore
              </p>

              <div className="flex flex-col gap-3 text-sm text-white/70">

                <a
                  href="/"
                  className="transition-colors hover:text-white"
                >
                  Home
                </a>

                <a
                  href="#collections"
                  className="transition-colors hover:text-white"
                >
                  Collections
                </a>

                <a
                  href="/products"
                  className="transition-colors hover:text-white"
                >
                  Products
                </a>

                <a
                  href="#about"
                  className="transition-colors hover:text-white"
                >
                  About
                </a>

              </div>
            </div>

            {/* Business contact */}
            <div>
              <p className="mb-5 text-[10px] uppercase tracking-[0.25em] text-white/40">
                Connect
              </p>

              <div className="flex flex-col gap-3 text-sm text-white/70">

                {/* WhatsApp */}
                <a
                  href="https://wa.me/918437315690"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors hover:text-white"
                >
                  WhatsApp
                </a>

                {/* Email */}
                <a
                  href="mailto:akshitamelamine@gmail.com"
                  className="transition-colors hover:text-white"
                >
                  Email
                </a>

                {/* Phone */}
                <a
                  href="tel:+918437315690"
                  className="transition-colors hover:text-white"
                >
                  +91 84373 15690
                </a>

              </div>
            </div>

          </div>

          {/* Catalog download */}
          <div className="md:col-span-3 md:flex md:justify-end">
            <a
              href="/catalog/akshita-hospitality-catalog.pdf"
              download
              className="inline-flex h-fit border border-white/30 px-6 py-4 text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-white hover:text-black"
            >
              Download Catalog
            </a>
          </div>

        </div>

        {/* Divider */}
        <div className="my-14 border-t border-white/10" />

        {/* Bottom footer */}
        <div className="flex flex-col justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-white/40 md:flex-row">

          <p>
            © {new Date().getFullYear()} Akshita Melamine
          </p>

          <p>
            Hospitality Tableware
          </p>

        </div>

      </div>
    </footer>
  );
}