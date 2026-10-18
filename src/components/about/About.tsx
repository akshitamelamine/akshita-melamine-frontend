"use client";

import { motion } from "framer-motion";

/*
 * About Section
 *
 * This section introduces Akshita Melamine from a
 * hospitality and commercial tableware perspective.
 *
 * The messaging is based on the product information
 * available from the client's catalogue.
 */
export default function About() {
  return (
    <section
      id="about"
      className="bg-[#f5f1e8] px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-xs uppercase tracking-[0.3em] text-neutral-700"
        >
          About Akshita
        </motion.p>

        {/* Main editorial statement */}
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-4xl leading-[1.05] tracking-tight md:col-span-8 md:text-6xl lg:text-7xl text-neutral-700"
          >
            Tableware built
            <br />
            for hospitality.
          </motion.h2>

          {/* Supporting copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex items-end md:col-span-4"
          >
            <p className="max-w-md text-base leading-relaxed text-neutral-700">
              Akshita Melamine brings together practical
              tableware and considered design for professional
              dining environments. From hotels and restaurants
              to cafés, catering services, and institutional
              dining, the collection is designed around the
              demands of everyday service.
            </p>
          </motion.div>

        </div>

        {/* Visual story */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-20 overflow-hidden md:mt-28"
        >
          <motion.img
            src="/images/about.jpg"
            alt="Table setting for hospitality dining"
            className="h-[55vh] w-full object-cover md:h-[70vh]"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <p className="max-w-xl text-lg leading-relaxed text-neutral-700 md:text-xl">
            Designed to bring practicality and presentation
            together at the professional dining table.
          </p>

          <span className="text-xs uppercase tracking-[0.2em] text-neutral-700">
            Hospitality Tableware
          </span>
        </motion.div>

      </div>
    </section>
  );
}