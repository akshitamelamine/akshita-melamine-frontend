"use client";

import { motion } from "framer-motion";

/*
 * These points come from the product information
 * provided from the client's catalogue.
 *
 * They describe material and usage characteristics,
 * rather than making unsupported performance guarantees.
 */
const reasons = [
  {
    number: "01",
    title: "Commercial-Quality Melamine",
    description:
      "High-grade melamine designed for professional food-service and hospitality environments.",
  },
  {
    number: "02",
    title: "Built for Everyday Service",
    description:
      "Lightweight, break-resistant and shatter-resistant tableware suited to busy dining environments.",
  },
  {
    number: "03",
    title: "Designed for Hygiene",
    description:
      "A non-porous surface makes the collection easy to clean and suited to everyday food service.",
  },
];

export default function WhyAkshita() {
  return (
    <section className="bg-neutral-900 px-6 py-24 text-white md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">

        {/* Section introduction */}
        <div className="grid gap-10 md:grid-cols-12 md:items-end">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-7"
          >
            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-white/60">
              Why Akshita
            </p>

            <h2 className="text-4xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Designed around
              <br />
              the demands of service.
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="max-w-md text-base leading-relaxed text-white/70 md:col-span-4 md:col-start-9"
          >
            A collection created for hospitality settings,
            combining commercial-quality melamine with
            practical formats and a wide range of designs.
          </motion.p>

        </div>

        {/* Product principles */}
        <div className="mt-20 border-t border-white/15 md:mt-28">

          {reasons.map((reason, index) => (
            <motion.div
              key={reason.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.1,
              }}
              className="grid gap-6 border-b border-white/15 py-10 md:grid-cols-12 md:items-start md:py-14"
            >
              {/* Number */}
              <span className="text-xs tracking-[0.2em] text-white/50 md:col-span-2">
                {reason.number}
              </span>

              {/* Title */}
              <h3 className="text-2xl tracking-tight md:col-span-4 md:text-3xl">
                {reason.title}
              </h3>

              {/* Description */}
              <p className="max-w-md text-sm leading-relaxed text-white/65 md:col-span-5 md:col-start-8">
                {reason.description}
              </p>
            </motion.div>
          ))}

        </div>

        {/* Closing statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mt-16 flex justify-end md:mt-20"
        >
          <p className="max-w-xl text-right text-2xl leading-tight tracking-tight text-white/90 md:text-4xl">
            From everyday service to large-scale hospitality,
            <br />
            tableware made for the environment it serves.
          </p>
        </motion.div>

      </div>
    </section>
  );
}