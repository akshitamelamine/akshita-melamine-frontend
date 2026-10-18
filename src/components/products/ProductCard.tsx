
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Prevent empty or whitespace-only image URLs from reaching src.
  const imageSrc =
    typeof product.image === "string" && product.image.trim().length > 0
      ? product.image.trim()
      : null;

  return (
    <Link href={`/products/${product.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="group"
      >
        {/*
         * Product image
         *
         * Keep the same aspect ratio for every card.
         * If an image URL is unavailable, show a neutral
         * placeholder rather than rendering img with src="".
         */}
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
          {imageSrc ? (
            <motion.img
              src={imageSrc}
              alt={product.name}
              className="h-full w-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            />
          ) : (
            <div
              role="img"
              aria-label={`No image available for ${product.name}`}
              className="flex h-full w-full items-center justify-center bg-[#e9e3d8] px-6 text-center"
            >
              <span className="text-xs uppercase tracking-[0.2em] text-neutral-700">
                Image Coming Soon
              </span>
            </div>
          )}

          {/* Category label */}
          <div className="absolute left-5 top-5">
            <span className="bg-white/90 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-neutral-700 backdrop-blur-sm">
              {product.category}
            </span>
          </div>

          {/* Catalogue number */}
          <div className="absolute bottom-5 left-5">
            <span className="bg-black/80 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white">
              No. {product.catalogueNumber}
            </span>
          </div>

          {/* View Details interaction */}
          <div className="absolute bottom-5 right-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="bg-black px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-white">
              View Details →
            </span>
          </div>
        </div>

        {/* Product information */}
        <div className="pt-5">
          <h3 className="text-xl tracking-tight text-neutral-700">
            {product.name}
          </h3>

          <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-700">
            {product.description}
          </p>

          {/* Product specifications */}
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-[0.15em] text-neutral-700">
            {product.size && <span>Size · {product.size}</span>}

            {product.quantityPerCarton && (
              <span>Qty / CTN · {product.quantityPerCarton}</span>
            )}
          </div>

          {/* B2B product enquiry journey */}
          <div className="mt-5 text-xs uppercase tracking-[0.2em] text-neutral-700">
            View Product →
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
