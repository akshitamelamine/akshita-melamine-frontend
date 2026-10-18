"use client";

import { motion } from "framer-motion";

export default function Lifestyle() {
  return (
    <section className="bg-[#f5f1e8] px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">

        {/* Section introduction */}
        <div className="grid gap-10 md:grid-cols-12 md:items-end">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-8"
          >
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-700">
              Designed for Service
            </p>

            <h2 className="text-4xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl text-neutral-700">
              From the first
              <br />
              serving to the last table.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.15,
            }}
            className="max-w-md text-base leading-relaxed text-neutral-700 md:col-span-4"
          >
            Professional dining demands tableware that
            works as hard as the service around it. Akshita
            brings together practical formats, considered
            presentation and commercial-quality melamine.
          </motion.p>

        </div>

        {/* Main visual */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mt-16 overflow-hidden md:mt-24"
        >
          <motion.img
            src="/images/desgined.jpg"
            alt="Hospitality table setting"
            className="h-[60vh] w-full object-cover md:h-[75vh]"
            whileHover={{ scale: 1.025 }}
            transition={{ duration: 0.9 }}
          />

          {/* Image caption */}
          <div className="absolute bottom-0 left-0 p-6 md:p-10">
            <p className="text-xs uppercase tracking-[0.25em] text-white">
              Hospitality Tableware
            </p>
          </div>
        </motion.div>

        {/* Hospitality applications */}
        <div className="mt-16 grid gap-10 md:mt-20 md:grid-cols-3">

          {/* Hotels */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-t border-black/10 pt-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-700">
              Hotels
            </p>

            <p className="mt-5 max-w-lg text-2xl leading-tight tracking-tight md:text-3xl text-neutral-500">
              Tableware suited to guest dining,
              breakfast service and everyday
              hospitality operations.
            </p>
          </motion.div>

          {/* Restaurants & Cafés */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            className="border-t border-black/10 pt-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-700">
              Restaurants & Cafés
            </p>

            <p className="mt-5 max-w-lg text-2xl leading-tight tracking-tight md:text-3xl text-neutral-500" >
              Serving formats that bring presentation
              and practical everyday service together.
            </p>
          </motion.div>

          {/* Catering & Institutional Dining */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="border-t border-black/10 pt-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-700">
              Catering & Institutional
            </p>

            <p className="mt-5 max-w-lg text-2xl leading-tight tracking-tight md:text-3xl text-neutral-500">
              Practical tableware for environments where
              consistent service matters every day.
            </p>
          </motion.div>

        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="mt-20 border-t border-black/10 pt-8 md:mt-28 md:flex md:items-end md:justify-between"
        >
          <p className="max-w-3xl text-2xl leading-tight tracking-tight md:text-4xl text-neutral-600">
            Tableware that becomes part of the rhythm
            of professional service.
          </p>

          <span className="mt-6 block text-xs uppercase tracking-[0.2em] text-neutral-700 md:mt-0">
            Akshita Hospitality Melamine
          </span>
        </motion.div>

      </div>
    </section>
  );
}