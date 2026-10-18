import type { Product } from "./products";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

const ADMIN_API_BASE = "/api/admin/products";

// Raw product structure returned by FastAPI.
export interface ApiProduct {
  id: number;
  catalogue_number: string;
  name: string;
  category: string;
  description: string;
  is_published: boolean;
  featured: boolean;
  is_archived: boolean;
  primary_image_url?: string | null;
}

// Raw image structure returned by FastAPI.
export interface ApiProductImage {
  id: number;
  product_id: number;
  is_primary: boolean;
  original_url: string;
  card_url: string;
  detail_url: string;
}

export interface ApiProductDetail extends ApiProduct {
  images: ApiProductImage[];
}

// Product structure used by the admin React components.
// These properties match the names used in admin/page.tsx.
export interface AdminProduct {
  id: number;
  catalogueNumber: string;
  name: string;
  category: string;
  description: string;
  isPublished: boolean;
  featured: boolean;
  isArchived: boolean;
  primaryImageUrl?: string | null;
}

export interface AdminProductImage {
  id: number;
  productId: number;
  isPrimary: boolean;
  originalUrl: string;
  cardUrl: string;
  detailUrl: string;
}

export interface AdminProductDetails extends AdminProduct {
  images: AdminProductImage[];
}

// Creation and update payloads use backend field names.
export interface AdminProductCreate {
  catalogue_number: string;
  name: string;
  category: string;
  description: string;
  is_published?: boolean;
  featured?: boolean;
}

export type AdminProductUpdates = Partial<AdminProductCreate> & {
  is_archived?: boolean;
};

// Convert API errors into useful messages.
async function readResponse<T>(response: Response): Promise<T> {
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "detail" in payload &&
      typeof payload.detail === "string"
        ? payload.detail
        : `Request failed (${response.status}).`;

    throw new Error(message);
  }

  return payload as T;
}

// Convert backend product fields into the existing frontend Product type.
function mapApiProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    catalogueNumber: product.catalogue_number,
    name: product.name,
    category: product.category,
    description: product.description,
    image: product.primary_image_url || "",
    material: "Commercial-Quality Melamine",
    featured: product.featured,
  };
}

// Convert the raw API product into the admin component structure.
function mapAdminProduct(product: ApiProduct): AdminProduct {
  return {
    id: product.id,
    catalogueNumber: product.catalogue_number,
    name: product.name,
    category: product.category,
    description: product.description,
    isPublished: product.is_published,
    featured: product.featured,
    isArchived: product.is_archived,
    primaryImageUrl: product.primary_image_url,
  };
}

// Convert raw image fields into the structure used by the image editor.
function mapAdminImage(image: ApiProductImage): AdminProductImage {
  return {
    id: image.id,
    productId: image.product_id,
    isPrimary: image.is_primary,
    originalUrl: image.original_url,
    cardUrl: image.card_url,
    detailUrl: image.detail_url,
  };
}

// --------------------
// Public catalogue API
// --------------------

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    cache: "no-store",
  });

  const products = await readResponse<ApiProduct[]>(response);
  return products.map(mapApiProduct);
}

export async function fetchProductById(
  id: string | number
): Promise<Product | null> {
  const response = await fetch(
    `${API_BASE_URL}/products/${encodeURIComponent(String(id))}`,
    { cache: "no-store" }
  );

  if (response.status === 404) {
    return null;
  }

  return mapApiProduct(await readResponse<ApiProduct>(response));
}

export async function fetchFeaturedProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/products/featured`, {
    cache: "no-store",
  });

  const products = await readResponse<ApiProduct[]>(response);
  return products.map(mapApiProduct);
}

// --------------------
// Product admin authentication
// --------------------

export async function loginProductAdmin(token: string): Promise<void> {
  const response = await fetch(`${ADMIN_API_BASE}/login`, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  await readResponse<{ authenticated: boolean }>(response);
}

export async function checkProductAdminSession(): Promise<boolean> {
  const response = await fetch(`${ADMIN_API_BASE}/login`, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });

  const result =
    await readResponse<{ authenticated: boolean }>(response);

  return result.authenticated;
}

export async function logoutProductAdmin(): Promise<void> {
  const response = await fetch(`${ADMIN_API_BASE}/login`, {
    method: "DELETE",
    credentials: "same-origin",
  });

  await readResponse<{ authenticated: boolean }>(response);
}

// --------------------
// Authenticated product admin API
// --------------------

export async function fetchAdminProducts(): Promise<AdminProduct[]> {
  const response = await fetch(`${ADMIN_API_BASE}/admin/all`, {
    credentials: "same-origin",
    cache: "no-store",
  });

  const products = await readResponse<ApiProduct[]>(response);
  return products.map(mapAdminProduct);
}

export async function fetchAdminProductDetails(
  productId: number
): Promise<AdminProductDetails> {
  const response = await fetch(
    `${ADMIN_API_BASE}/admin/${productId}`,
    {
      credentials: "same-origin",
      cache: "no-store",
    }
  );

  const product = await readResponse<ApiProductDetail>(response);

  return {
    ...mapAdminProduct(product),
    images: product.images.map(mapAdminImage),
  };
}

export async function createAdminProduct(
  product: AdminProductCreate
): Promise<AdminProduct> {
  const response = await fetch(ADMIN_API_BASE, {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

  return mapAdminProduct(await readResponse<ApiProduct>(response));
}

export async function updateAdminProduct(
  productId: number,
  updates: AdminProductUpdates
): Promise<AdminProduct> {
  const response = await fetch(`${ADMIN_API_BASE}/${productId}`, {
    method: "PATCH",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  return mapAdminProduct(await readResponse<ApiProduct>(response));
}

export async function uploadProductImage(
  productId: number,
  file: File
): Promise<AdminProductImage> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${ADMIN_API_BASE}/${productId}/images`,
    {
      method: "POST",
      credentials: "same-origin",
      body: formData,
    }
  );

  return mapAdminImage(
    await readResponse<ApiProductImage>(response)
  );
}

export async function setPrimaryProductImage(
  productId: number,
  imageId: number
): Promise<void> {
  const response = await fetch(
    `${ADMIN_API_BASE}/${productId}/images/${imageId}/primary`,
    {
      method: "PATCH",
      credentials: "same-origin",
    }
  );

  await readResponse<unknown>(response);
}

export async function deleteProductImage(
  productId: number,
  imageId: number
): Promise<void> {
  const response = await fetch(
    `${ADMIN_API_BASE}/${productId}/images/${imageId}`,
    {
      method: "DELETE",
      credentials: "same-origin",
    }
  );

  await readResponse<unknown>(response);
}

export async function deleteAdminProduct(
  productId: number
): Promise<void> {
  const response = await fetch(`${ADMIN_API_BASE}/${productId}`, {
    method: "DELETE",
    credentials: "same-origin",
  });

  await readResponse<unknown>(response);
}