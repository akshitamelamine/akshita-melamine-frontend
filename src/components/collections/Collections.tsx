"use client";

import { motion } from "framer-motion";

/*
 * These are the main customer-facing product categories.
 *
 * We are intentionally grouping the large catalogue into
 * understandable product families instead of exposing the
 * original catalogue page numbers to customers.
 *
 * Later, each category can be connected to the product
 * catalogue and filtered through our backend API.
 */
const collections = [
  {
    number: "01",
    title: "Plates",
    description:
      "Round, square, spiral, step and specialty plates for professional dining.",
    image:
      "/images/plates.jpg",
  },
  {
    number: "02",
    title: "Bowls & Katoris",
    description:
      "A versatile range of bowls, katoris and portionware for everyday service.",
    image:
      "/images/bowls.jpg",
  },
  {
    number: "03",
    title: "Platters",
    description:
      "Distinctive platters designed for presentation, sharing and professional service.",
    image:
      "/images/platters.jpg",
  },
  {
    number: "04",
    title: "Chat & Indian Serveware",
    description:
      "Specialized serving pieces for chat, Indian dishes, snacks and traditional favourites.",
    image:
      "/images/chat.jpg",
  },
  {
    number: "05",
    title: "Specialty Serveware",
    description:
      "Kadai, handi, grill, pasta and other distinctive formats for modern food service.",
    image:
      "/images/speciality.jpg",
  },
  {
    number: "06",
    title: "Drinkware",
    description:
      "Cups, mugs and glasses designed to complete professional table settings.",
    image:
      "/images/drinkware.jpg",
  },
  {
    number: "07",
    title: "Trays, Baskets & Sets",
    description:
      "Practical serving solutions, coordinated sets and hospitality essentials.",
    image:
      "/images/trays.jpg",
  },
  {
    number: "08",
    title: "Cutlery & Accessories",
    description:
      "Serving spoons, forks and supporting accessories for complete service.",
    image:
      "/images/cutlery.jpg",
  },
];

export default function Collections() {
  return (
    <section
      id="collections"
      className="bg-[#f5f1e8] px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section heading */}
        <div className="mb-16 max-w-3xl">

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-4 text-xs uppercase tracking-[0.3em] text-neutral-700"
          >
            Explore the Range
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl leading-tight tracking-tight md:text-6xl text-neutral-700"
          >
            A collection built
            <br />
            for every service.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-neutral-700"
          >
            Discover plates, bowls, platters, specialty
            serveware and more across the Akshita Hospitality
            Melamine collection.
          </motion.p>

        </div>

        {/* Collection grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          {collections.map((collection, index) => (
            <motion.a
              href="/products"
              key={collection.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: index * 0.08,
              }}
              className="group relative h-[460px] overflow-hidden md:h-[500px]"
            >
              {/* Category image */}
              <motion.img
                src={collection.image}
                alt={collection.title}
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/25 transition-colors duration-500 group-hover:bg-black/40" />

              {/* Category information */}
              <div className="absolute inset-x-0 bottom-0 p-8 text-white md:p-10">

                {/* Category number */}
                <p className="mb-2 text-xs uppercase tracking-[0.25em] text-white/80">
                  Collection {collection.number}
                </p>

                {/* Category title */}
                <h3 className="text-3xl tracking-tight md:text-4xl">
                  {collection.title}
                </h3>

                {/* Description */}
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
                  {collection.description}
                </p>

                {/* Explore action */}
                <div className="mt-6 inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em]">
                  Explore
                  <span className="transition-transform duration-300 group-hover:translate-x-2">
                    →
                  </span>
                </div>

              </div>
            </motion.a>
          ))}

        </div>

      </div>
    </section>
  );
}