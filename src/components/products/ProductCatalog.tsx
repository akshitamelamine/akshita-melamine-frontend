"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import type { Product } from "@/lib/products";
import { fetchProducts } from "@/lib/product-api";
import ProductCard from "./ProductCard";

export default function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /*
   * Load published products from FastAPI when the
   * catalogue component mounts.
   */
  useEffect(() => {
    let isActive = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await fetchProducts();

        if (isActive) {
          setProducts(data);
        }
      } catch (err) {
        console.error("Failed to load catalogue:", err);

        if (isActive) {
          setError(
            "We couldn't load the catalogue. Please try again."
          );
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isActive = false;
    };
  }, []);

  /*
   * Build category filters from the products returned
   * by the backend rather than the local sample data.
   */
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  /*
   * Filter the API-backed products by the selected category.
   */
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category === selectedCategory
        );

  return (
    <section className="bg-[#f5f1e8] px-6 pb-24 md:px-10 md:pb-32">
      <div className="mx-auto max-w-7xl">

        {/* Category navigation */}
        <div className="mb-16 overflow-x-auto border-b border-black/10 pb-6">
          <div className="flex min-w-max gap-x-8">
            {categories.map((category) => {
              const isActive = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`relative pb-2 text-xs uppercase tracking-[0.2em] transition-opacity ${
                    isActive
                      ? "text-neutral-800 opacity-100"
                      : "text-neutral-700 opacity-60 hover:opacity-100"
                  }`}
                >
                  {category}

                  {isActive && (
                    <motion.span
                      layoutId="active-category"
                      className="absolute bottom-0 left-0 h-px w-full bg-black"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <p className="text-sm text-neutral-700">
              Loading the collection...
            </p>
          </div>
        )}

        {/* Error state */}
        {!isLoading && error && (
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-5">
            <p className="text-sm text-neutral-700">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="border border-neutral-800 px-5 py-3 text-xs uppercase tracking-[0.2em] text-neutral-800 transition-opacity hover:opacity-60"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Catalogue results */}
        {!isLoading && !error && (
          <>
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-700">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "Product" : "Products"}
              </p>

              <p className="text-xs uppercase tracking-[0.2em] text-neutral-700">
                {selectedCategory}
              </p>
            </div>

            {/* Product grid */}
            <motion.div
              layout
              className="grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-4"
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </motion.div>

            {/* Empty state */}
            {filteredProducts.length === 0 && (
              <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-sm text-neutral-700">
                  No products found in this collection.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}