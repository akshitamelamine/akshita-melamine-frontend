"use client";

import { motion } from "framer-motion";
import EnquiryForm from "@/components/enquiry/EnquiryForm";

export default function FinalCTA() {
  return (
    <section
      id="contact"
      className="bg-[#f5f1e8] px-6 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-8 text-xs uppercase tracking-[0.3em] text-neutral-700"
        >
          Hospitality & Bulk Enquiries
        </motion.p>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="max-w-5xl text-5xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl text-zinc-600"
        >
          Tell us what
          <br />
          you need.
        </motion.h2>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.15,
          }}
          className="mt-8 max-w-xl text-base leading-relaxed text-neutral-700"
        >
          Share your tableware requirements and our team
          can help you with product details, quantities,
          sizes and bulk requirements.
        </motion.p>

        {/* Direct contact options */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.25,
          }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap"
        >
          <a
            href="https://wa.me/918437315690"
            target="_blank"
            rel="noreferrer"
            className="inline-flex justify-center border border-black bg-black px-8 py-4 text-xs uppercase tracking-[0.2em] text-white transition-opacity duration-300 hover:opacity-75"
          >
            WhatsApp Us
          </a>

          <a
            href="mailto:akshitamelamine@gmail.com"
            className="inline-flex justify-center border border-black px-8 py-4 text-xs uppercase tracking-[0.2em] text-neutral-700 transition-colors duration-300 hover:bg-black hover:text-white"
          >
            Email Us
          </a>

          <a
            href="/catalog/akshita-hospitality-catalog.pdf"
            download
            className="inline-flex justify-center border border-black/20 px-8 py-4 text-xs uppercase tracking-[0.2em] text-neutral-700 transition-colors duration-300 hover:border-black hover:bg-black hover:text-white"
          >
            Download Catalog
          </a>
        </motion.div>

        {/* Enquiry form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.9,
            delay: 0.2,
          }}
          className="mt-24 grid gap-12 border-t border-black/10 pt-12 md:grid-cols-12 md:gap-16 md:pt-16"
        >
          {/* Form introduction */}
          <div className="md:col-span-4">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-700">
              Send an Enquiry
            </p>

            <h3 className="mt-5 text-3xl leading-tight tracking-tight md:text-4xl text-neutral-600">
              Let's discuss your requirement.
            </h3>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-700">
              Whether you're sourcing for a hotel,
              restaurant, café, catering operation or
              institutional setup, share the details of
              what you're looking for.
            </p>
          </div>

          {/* Form */}
          <div className="md:col-span-8">
            <EnquiryForm />
          </div>
        </motion.div>

      </div>
    </section>
  );
}