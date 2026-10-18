import Link from "next/link";
import { fetchProductById } from "@/lib/product-api";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetails({
  params,
}: ProductDetailsPageProps) {
  // Read the product ID from the URL.
  const { id } = await params;
  const productId = Number(id);

  // Fetch the latest product from the FastAPI backend.
  // This replaces the old static sample-data lookup.
  const product =
    Number.isFinite(productId) && productId > 0
      ? await fetchProductById(productId)
      : null;

  // Show a friendly message if the product doesn't exist.
  if (!product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-6">
        <div className="text-center">
          <p className="mb-4 text-xs uppercase tracking-[0.3em] text-neutral-700">
            Product Not Found
          </p>

          <h1 className="text-4xl tracking-tight text-neutral-700">
            We couldn&apos;t find this product.
          </h1>

          <Link
            href="/products"
            className="mt-8 inline-block border-b border-black pb-2 text-xs uppercase tracking-[0.2em] text-neutral-700"
          >
            Back to Collection
          </Link>
        </div>
      </main>
    );
  }

  // Pass the product name to the homepage enquiry form.
  const enquiryUrl = `/?product=${encodeURIComponent(
    product.name
  )}#contact`;

  return (
    <main className="min-h-screen bg-[#f5f1e8]">
      {/* Product page header */}
      <header className="px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/"
            className="text-sm tracking-[0.25em] text-neutral-700"
          >
            AKSHITA
            <span className="ml-2 text-neutral-700">
              / MELAMINE
            </span>
          </Link>

          <Link
            href="/products"
            className="text-xs uppercase tracking-[0.2em] text-neutral-700 transition-opacity hover:opacity-50"
          >
            ← All Products
          </Link>
        </div>
      </header>

      {/* Product information */}
      <section className="px-6 pb-24 pt-10 md:px-10 md:pt-16">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:gap-20">
          {/* Product image from the backend */}
          <div className="aspect-[4/5] overflow-hidden bg-neutral-200">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-neutral-700">
                Image unavailable
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-700">
              {product.category}
            </p>

            <h1 className="mt-5 text-5xl leading-[0.95] tracking-tight text-neutral-700 md:text-7xl">
              {product.name}
            </h1>

            <p className="mt-5 text-sm text-neutral-700">
              Catalogue No. {product.catalogueNumber}
            </p>

            <p className="mt-8 max-w-lg text-base leading-relaxed text-neutral-700">
              {product.description}
            </p>

            {/* Product specifications */}
            <div className="mt-12 border-t border-black/10">
              {product.size && (
                <div className="flex justify-between gap-8 border-b border-black/10 py-4 text-sm">
                  <span className="text-neutral-700">Size</span>
                  <span className="text-right text-neutral-700">
                    {product.size}
                  </span>
                </div>
              )}

              {product.quantityPerCarton && (
                <div className="flex justify-between gap-8 border-b border-black/10 py-4 text-sm">
                  <span className="text-neutral-700">
                    Quantity / Carton
                  </span>
                  <span className="text-right text-neutral-700">
                    {product.quantityPerCarton}
                  </span>
                </div>
              )}

              {/* <div className="flex justify-between gap-8 border-b border-black/10 py-4 text-sm">
                <span className="text-neutral-700">Material</span>
                <span className="text-right text-neutral-700">
                  {product.material || "Commercial-Quality Melamine"}
                </span>
              </div> */}

              {product.finish && (
                <div className="flex justify-between gap-8 border-b border-black/10 py-4 text-sm">
                  <span className="text-neutral-700">Finish</span>
                  <span className="text-right text-neutral-700">
                    {product.finish}
                  </span>
                </div>
              )}

              {product.sku && (
                <div className="flex justify-between gap-8 border-b border-black/10 py-4 text-sm">
                  <span className="text-neutral-700">SKU</span>
                  <span className="text-right text-neutral-700">
                    {product.sku}
                  </span>
                </div>
              )}
            </div>

            {/* Business enquiries */}
            <div className="mt-12">
              <p className="mb-5 text-xs uppercase tracking-[0.2em] text-neutral-700">
                Hospitality &amp; Bulk Enquiries
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={enquiryUrl}
                  className="inline-flex justify-center bg-black px-7 py-4 text-xs uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-75"
                >
                  Enquire Now
                </a>

                <a
                  href="https://wa.me/918437315690"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex justify-center border border-black px-7 py-4 text-xs uppercase tracking-[0.2em] text-neutral-700 transition-colors hover:bg-black hover:text-white"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}