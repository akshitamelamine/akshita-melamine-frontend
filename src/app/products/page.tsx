import Link from "next/link";
import ProductCatalog from "@/components/products/ProductCatalog";

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#f5f1e8]">

      {/* Page header */}
      <header className="px-6 pb-16 pt-8 md:px-10 md:pb-24 md:pt-10">
        <div className="mx-auto max-w-7xl">

          {/* Back to homepage */}
          <Link
            href="/"
            className="inline-block text-xs uppercase tracking-[0.2em] text-neutral-700 transition-opacity hover:opacity-50"
          >
            ← Back to Home
          </Link>

          {/* Introduction */}
          <div className="mt-20 max-w-5xl md:mt-28">

            <p className="mb-5 text-xs uppercase tracking-[0.3em] text-neutral-700">
              Akshita Hospitality Melamine
            </p>

            <h1 className="text-5xl leading-[0.95] tracking-tight md:text-7xl lg:text-8xl text-neutral-700">
              Tableware for
              <br />
              professional service.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-relaxed text-neutral-700 md:text-lg">
              Explore the Akshita Hospitality collection of
              commercial-quality melamine tableware for
              hotels, restaurants, cafés, catering services,
              and institutional dining.
            </p>

          </div>

          {/* Catalogue context */}
          <div className="mt-16 grid gap-8 border-t border-black/10 pt-8 md:grid-cols-3 md:gap-12">

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-700">
                Hospitality
              </p>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-700">
                Tableware formats designed around the
                practical requirements of professional
                food service.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-700">
                Bulk Procurement
              </p>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-700">
                Product specifications include catalogue
                numbers, sizes and carton quantities to
                support bulk enquiries.
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-neutral-700">
                Enquiries
              </p>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-700">
                Select a product to view its specifications
                and contact Akshita for your requirements.
              </p>
            </div>

          </div>

        </div>
      </header>

      {/* Product catalogue */}
      <ProductCatalog />

    </main>
  );
}