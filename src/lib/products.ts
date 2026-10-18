 /*
  * Product
  *
  * This interface defines the structure of a product in
  * the Akshita Hospitality Melamine catalogue.
  *
  * IMPORTANT:
  *
  * This is currently frontend data.
  *
  * Later, the same concepts will come from:
  *
  * PostgreSQL
  *     ↓
  * Spring Boot
  *     ↓
  * REST API
  *     ↓
  * Next.js
  *
  * Keeping this structure clean now makes that transition
  * much easier later.
  */
export interface Product {
  /*
   * Internal ID used by the website.
   *
   * This does NOT have to be the catalogue serial number.
   */
  id: number;

  /*
   * Serial number or range from the client's catalogue.
   *
   * Examples:
   * "01–02"
   * "107–109"
   */
  catalogueNumber: string;

  /*
   * Product name exactly as represented in the catalogue.
   */
  name: string;

  /*
   * Customer-facing category.
   *
   * Examples:
   * Plates
   * Bowls & Katoris
   * Platters
   * Drinkware
   */
  category: string;

  /*
   * Short description used on product cards and
   * product detail pages.
   *
   * We will keep this concise instead of copying
   * the entire catalogue description everywhere.
   */
  description: string;

  /*
   * Product image.
   *
   * For now this can be a temporary image.
   *
   * Later it will point to the actual product image
   * supplied by the client.
   */
  image: string;

  /*
   * Product size as mentioned in the catalogue.
   *
   * Examples:
   * "11 inch"
   * "8.3 × 6 inch"
   * "200 ml"
   */
  size?: string;

  /*
   * Number of pieces supplied in one carton.
   *
   * Some products have different quantities for
   * different sizes, so this is stored as text.
   *
   * Example:
   * "25 / 45 pcs"
   */
  quantityPerCarton?: string;

  /*
   * Material used for the product.
   *
   * The catalogue identifies the collection as
   * professional melamine tableware.
   */
  material: string;

  /*
   * Finish is optional because the provided product
   * information does not specify it for every product.
   *
   * Examples:
   * "Matte"
   * "Glossy"
   */
  finish?: string;

  /*
   * SKU is optional for now.
   *
   * We will only add an SKU when the client provides
   * an actual SKU or product code.
   */
  sku?: string;

  /*
   * Products marked as featured can be displayed
   * on the homepage.
   *
   * This will eventually be controlled from the
   * admin dashboard.
   */
  featured?: boolean;
}

/*
 * Temporary image used while we build the catalogue.
 *
 * IMPORTANT:
 * This is only a development placeholder.
 *
 * We will replace it with the actual product
 * photographs before the website goes live.
 */
const placeholderImage =
  "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=1800&q=90";

/*
 * Initial catalogue data.
 *
 * We are starting with a small real-data batch.
 *
 * This allows us to verify the new data structure
 * throughout the website before entering all 210+
 * catalogue entries.
 */
export const products: Product[] = [
  {
    id: 1,
    catalogueNumber: "01–02",
    name: "Square Plate",
    category: "Plates",
    description:
      "A clean square-profile melamine plate designed for professional dining presentation.",
    image: placeholderImage,
    size: "11 inch",
    quantityPerCarton: "50 pcs",
    material: "Commercial-Quality Melamine",
    featured: true,
  },

  {
    id: 2,
    catalogueNumber: "03–04",
    name: "Round Collar Plate",
    category: "Plates",
    description:
      "A round plate with a defined collar profile for versatile hospitality table settings.",
    image: placeholderImage,
    size: "11 / 8 inch",
    quantityPerCarton: "15 pcs",
    material: "Commercial-Quality Melamine",
    featured: true,
  },

  {
    id: 3,
    catalogueNumber: "05–08",
    name: "Round Plate",
    category: "Plates",
    description:
      "Classic round melamine plates available in multiple sizes for professional food service.",
    image: placeholderImage,
    size: "11 / 8 inch",
    quantityPerCarton: "25 / 40 pcs",
    material: "Commercial-Quality Melamine",
    featured: true,
  },

  {
    id: 4,
    catalogueNumber: "19–20",
    name: "Nappy Bowl",
    category: "Bowls & Katoris",
    description:
      "A compact melamine bowl suited to portioning, sides and everyday food service.",
    image: placeholderImage,
    size: "6 inch",
    quantityPerCarton: "45 pcs",
    material: "Commercial-Quality Melamine",
  },

  {
    id: 5,
    catalogueNumber: "32–33",
    name: "Alaskan Bowl",
    category: "Bowls & Katoris",
    description:
      "A versatile bowl format designed for professional serving and presentation.",
    image: placeholderImage,
    size: "6 / 7 inch",
    quantityPerCarton: "72 / 60 pcs",
    material: "Commercial-Quality Melamine",
  },

  {
    id: 6,
    catalogueNumber: "81",
    name: "2 in 1 Platter",
    category: "Platters",
    description:
      "A distinctive two-in-one platter designed for presenting multiple food items together.",
    image: placeholderImage,
    size: "14 × 7 inch",
    quantityPerCarton: "30 pcs",
    material: "Commercial-Quality Melamine",
    featured: true,
  },

  {
    id: 7,
    catalogueNumber: "107–109",
    name: "Pizza Platter",
    category: "Platters",
    description:
      "A dedicated platter format available in multiple sizes for pizza and shared serving.",
    image: placeholderImage,
    size: "8 / 10 / 12 inch",
    quantityPerCarton: "30 / 20 / 8 pcs",
    material: "Commercial-Quality Melamine",
    featured: true,
  },

  {
    id: 8,
    catalogueNumber: "147–148",
    name: "Lining Glass",
    category: "Drinkware",
    description:
      "A lined melamine glass designed for practical hospitality beverage service.",
    image: placeholderImage,
    size: "300 ml",
    quantityPerCarton: "72 / 60 pcs",
    material: "Commercial-Quality Melamine",
  },

  {
    id: 9,
    catalogueNumber: "149",
    name: "Tea Cup",
    category: "Drinkware",
    description:
      "A compact tea cup designed for professional beverage service.",
    image: placeholderImage,
    size: "150 ml",
    quantityPerCarton: "64 pcs",
    material: "Commercial-Quality Melamine",
  },

  {
    id: 10,
    catalogueNumber: "117–118",
    name: "Serving Spoon",
    category: "Cutlery & Accessories",
    description:
      "A practical serving spoon for professional dining and hospitality service.",
    image: placeholderImage,
    quantityPerCarton: "200 pcs",
    material: "Commercial-Quality Melamine",
  },
];

/*
 * getProductById
 *
 * Finds one product using its internal website ID.
 *
 * Example:
 *
 * getProductById(7)
 *
 * returns the Pizza Platter.
 *
 * Later, this lookup will be replaced by an API request
 * to the Spring Boot backend.
 */
export function getProductById(
  id: number
): Product | undefined {
  return products.find((product) => product.id === id);
}

/*
 * getProductCategories
 *
 * Returns the unique categories currently available
 * in the product dataset.
 *
 * "All" is manually placed at the beginning because
 * it represents the complete catalogue.
 */
export function getProductCategories(): string[] {
  return [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];
}