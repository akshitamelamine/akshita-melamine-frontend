"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import ProductCard from "./ProductCard";
import { fetchFeaturedProducts } from "@/lib/product-api";
import type { Product } from "@/lib/products";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch the products selected as featured in the backend.
  useEffect(() => {
    let isMounted = true;

    async function loadFeaturedProducts() {
      try {
        const featured = await fetchFeaturedProducts();

        if (isMounted) {
          setProducts(featured);
          setError(false);
        }
      } catch (err) {
        console.error("Failed to load featured products:", err);

        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section
      id="products"
      className="bg-[#f5f1e8] px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section introduction */}
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mb-4 text-xs uppercase tracking-[0.3em] text-neutral-700"
            >
              Selected Catalogue
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl leading-tight tracking-tight text-neutral-700 md:text-6xl"
            >
              Selected pieces for
              <br />
              professional service.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-neutral-700"
            >
              A selection from the Akshita Hospitality
              collection, covering everyday tableware and
              distinctive serving formats for professional
              dining environments.
            </motion.p>
          </div>

          {/* View complete catalogue */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <a
              href="/products"
              className="inline-block w-fit border-b border-black pb-2 text-xs uppercase tracking-[0.2em] text-neutral-700 transition-opacity hover:opacity-50"
            >
              View Full Catalogue →
            </a>
          </motion.div>
        </div>

        {/* Featured product grid */}
        {loading ? (
          <p className="py-12 text-sm text-neutral-700">
            Loading selected products...
          </p>
        ) : error ? (
          <p className="py-12 text-sm text-neutral-700">
            Featured products are temporarily unavailable. Please try again shortly.
          </p>
        ) : products.length === 0 ? (
          <p className="py-12 text-sm text-neutral-700">
            Our selected collection is being updated. Please explore the full catalogue in the meantime.
          </p>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-3"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}