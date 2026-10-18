
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
    checkProductAdminSession,
    loginProductAdmin,
    logoutProductAdmin,
    createAdminProduct,
    deleteAdminProduct,
    deleteProductImage,
    fetchAdminProducts,
    fetchAdminProductDetails,
    setPrimaryProductImage,
    updateAdminProduct,
    uploadProductImage,
    type AdminProduct,
    type AdminProductCreate,
    type AdminProductDetails,
} from "@/lib/product-api";

import EnquiryManager from "@/components/admin/EnquiryManager";

const EMPTY_PRODUCT_FORM: AdminProductCreate = {
    name: "",
    catalogue_number: "",
    category: "",
    description: "",
    is_published: false,
    featured: false,
};

export default function AdminPage() {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [savingIds, setSavingIds] = useState<number[]>([]);
    const [notice, setNotice] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminToken, setAdminToken] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [creatingProduct, setCreatingProduct] = useState(false);
    const [createForm, setCreateForm] =
        useState<AdminProductCreate>({ ...EMPTY_PRODUCT_FORM });

    const [selectedImages, setSelectedImages] = useState<
        Record<number, File | null>
    >({});

    const [productDetails, setProductDetails] = useState<
        Record<number, AdminProductDetails>
    >({});

    const [loadingImageIds, setLoadingImageIds] = useState<number[]>([]);

    const [form, setForm] = useState({
        name: "",
        catalogue_number: "",
        category: "",
        description: "",
    });

    const loadProducts = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const data = await fetchAdminProducts();
            setProducts(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to load products."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function checkSession() {
            try {
                const authenticated = await checkProductAdminSession();

                if (cancelled) return;

                setIsAuthenticated(authenticated);

                if (authenticated) {
                    await loadProducts();
                }
            } catch {
                if (!cancelled) {
                    setIsAuthenticated(false);
                }
            } finally {
                if (!cancelled) {
                    setIsCheckingSession(false);
                }
            }
        }

        void checkSession();

        return () => {
            cancelled = true;
        };
    }, [loadProducts]);


    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!adminToken.trim()) {
            setError("Enter your product admin token.");
            return;
        }

        setLoginLoading(true);
        setError("");

        try {
            await loginProductAdmin(adminToken);
            setAdminToken("");
            setIsAuthenticated(true);

            await loadProducts();
        } catch (err) {
            setIsAuthenticated(false);
            setError(
                err instanceof Error ? err.message : "Unable to log in."
            );
        } finally {
            setLoginLoading(false);
        }
    }

    async function handleLogout() {
        setError("");
        setNotice("");

        try {
            await logoutProductAdmin();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to log out."
            );
            return;
        }

        setIsAuthenticated(false);
        setProducts([]);
        setProductDetails({});
        setSelectedImages({});
        setEditingId(null);
        setShowCreateForm(false);
        setSearch("");
        setLoading(false);
    }

    async function refreshProductDetails(productId: number) {
        setLoadingImageIds((ids) =>
            ids.includes(productId) ? ids : [...ids, productId]
        );

        try {
            const details = await fetchAdminProductDetails(productId);

            setProductDetails((current) => ({
                ...current,
                [productId]: details,
            }));

            return details;
        } finally {
            setLoadingImageIds((ids) => ids.filter((id) => id !== productId));
        }
    }

    function openCreateForm() {
        setCreateForm({ ...EMPTY_PRODUCT_FORM });
        setShowCreateForm(true);
        setError("");
        setNotice("");
    }

    async function handleCreateProduct() {
        const payload: AdminProductCreate = {
            name: createForm.name.trim(),
            catalogue_number: createForm.catalogue_number.trim(),
            category: createForm.category.trim(),
            description: createForm.description.trim(),
            is_published: createForm.is_published,
            featured: createForm.is_published && createForm.featured,
        };

        if (
            !payload.name ||
            !payload.catalogue_number ||
            !payload.category ||
            !payload.description
        ) {
            setError(
                "Please fill in the product name, catalogue number, category and description."
            );
            return;
        }

        setCreatingProduct(true);
        setError("");
        setNotice("");

        try {
            const created = await createAdminProduct(payload);

            // Refresh the table so the new database record appears.
            await loadProducts();

            // Open the newly created product in the existing image editor.
            setEditingId(created.id);
            setForm({
                name: created.name,
                catalogue_number: created.catalogueNumber,
                category: created.category,
                description: created.description,
            });

            setShowCreateForm(false);
            setCreateForm({ ...EMPTY_PRODUCT_FORM });

            try {
                await refreshProductDetails(created.id);
            } catch {
                // The product was created successfully even if image details
                // cannot be loaded immediately. The editor can be refreshed later.
            }

            setNotice(
                `Product "${created.name}" created successfully. You can now upload its images below.`
            );
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to create product."
            );
        } finally {
            setCreatingProduct(false);
        }
    }

    async function startEditing(product: AdminProduct) {
        setEditingId(product.id);
        setForm({
            name: product.name,
            catalogue_number: product.catalogueNumber,
            category: product.category,
            description: product.description,
        });
        setError("");
        setNotice("");

        try {
            await refreshProductDetails(product.id);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load the product's images."
            );
        }
    }

    async function saveDetails(product: AdminProduct) {
        if (
            !form.name.trim() ||
            !form.catalogue_number.trim() ||
            !form.category.trim() ||
            !form.description.trim()
        ) {
            setError(
                "Product name, catalogue number, category and description are required."
            );
            return;
        }

        setSavingIds((ids) =>
            ids.includes(product.id) ? ids : [...ids, product.id]
        );
        setError("");
        setNotice("");

        try {
            const updated = await updateAdminProduct(product.id, {
                name: form.name.trim(),
                catalogue_number: form.catalogue_number.trim(),
                category: form.category.trim(),
                description: form.description.trim(),
            });

            setProducts((current) =>
                current.map((item) => (item.id === product.id ? updated : item))
            );

            setEditingId(null);
            setNotice(`Saved changes to "${updated.name}".`);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to save product details."
            );
        } finally {
            setSavingIds((ids) => ids.filter((id) => id !== product.id));
        }
    }

    async function handleImageUpload(product: AdminProduct) {
        const file = selectedImages[product.id];

        if (!file) {
            setError("Please select an image first.");
            return;
        }

        setSavingIds((ids) =>
            ids.includes(product.id) ? ids : [...ids, product.id]
        );
        setError("");
        setNotice("");

        try {
            await uploadProductImage(product.id, file);

            setSelectedImages((current) => ({
                ...current,
                [product.id]: null,
            }));

            const input = document.getElementById(
                `image-upload-${product.id}`
            ) as HTMLInputElement | null;

            if (input) input.value = "";

            await Promise.all([
                refreshProductDetails(product.id),
                loadProducts(),
            ]);

            setNotice(
                `Image uploaded successfully for "${product.name}". It is now the primary image.`
            );
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to upload product image."
            );
        } finally {
            setSavingIds((ids) => ids.filter((id) => id !== product.id));
        }
    }

    async function handleSetPrimaryImage(
        product: AdminProduct,
        imageId: number
    ) {
        setSavingIds((ids) =>
            ids.includes(product.id) ? ids : [...ids, product.id]
        );
        setError("");
        setNotice("");

        try {
            await setPrimaryProductImage(product.id, imageId);

            await Promise.all([
                refreshProductDetails(product.id),
                loadProducts(),
            ]);

            setNotice(`Primary image updated for "${product.name}".`);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to change the primary image."
            );
        } finally {
            setSavingIds((ids) => ids.filter((id) => id !== product.id));
        }
    }

    async function handleDeleteImage(
        product: AdminProduct,
        imageId: number
    ) {
        const details = productDetails[product.id];
        const image = details?.images.find((item) => item.id === imageId);

        if (!image) {
            setError("Could not find that image. Refresh the product images.");
            return;
        }

        const confirmed = window.confirm(
            image.isPrimary
                ? `Delete the primary image for "${product.name}"?\n\nIf other images exist, the backend may promote another image automatically.`
                : `Delete this image from "${product.name}"?\n\nThis action cannot be undone.`
        );

        if (!confirmed) return;

        setSavingIds((ids) =>
            ids.includes(product.id) ? ids : [...ids, product.id]
        );
        setError("");
        setNotice("");

        try {
            await deleteProductImage(product.id, imageId);

            await Promise.all([
                refreshProductDetails(product.id),
                loadProducts(),
            ]);

            setNotice(`Image deleted from "${product.name}".`);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to delete product image."
            );
        } finally {
            setSavingIds((ids) => ids.filter((id) => id !== product.id));
        }
    }

    async function toggleStatus(
        product: AdminProduct,
        field: "featured" | "is_published"
    ) {
        const nextValue = !(
            field === "featured" ? product.featured : product.isPublished
        );

        setSavingIds((ids) =>
            ids.includes(product.id) ? ids : [...ids, product.id]
        );
        setError("");
        setNotice("");

        try {
            const updated = await updateAdminProduct(product.id, {
                [field]: nextValue,
            });

            setProducts((current) =>
                current.map((item) => (item.id === product.id ? updated : item))
            );

            setNotice(
                `${updated.name}: ${field === "featured"
                    ? nextValue
                        ? "marked as featured"
                        : "removed from featured"
                    : nextValue
                        ? "published"
                        : "unpublished"
                }.`
            );
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to update product."
            );
        } finally {
            setSavingIds((ids) => ids.filter((id) => id !== product.id));
        }
    }

    async function toggleArchive(product: AdminProduct) {
        const archive = !product.isArchived;

        const confirmed = window.confirm(
            archive
                ? `Archive "${product.name}"? It will disappear from the public catalogue.`
                : `Restore "${product.name}"? It will remain unpublished until you publish it.`
        );

        if (!confirmed) return;

        setSavingIds((ids) =>
            ids.includes(product.id) ? ids : [...ids, product.id]
        );
        setError("");
        setNotice("");

        try {
            const updated = await updateAdminProduct(product.id, {
                is_archived: archive,
            });

            setProducts((current) =>
                current.map((item) => (item.id === product.id ? updated : item))
            );

            setNotice(
                archive
                    ? `"${product.name}" has been archived.`
                    : `"${product.name}" has been restored.`
            );
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to update archive status."
            );
        } finally {
            setSavingIds((ids) => ids.filter((id) => id !== product.id));
        }
    }

    async function permanentlyDeleteProduct(product: AdminProduct) {
        const confirmed = window.confirm(
            `PERMANENTLY DELETE "${product.name}" (${product.catalogueNumber})?\n\nThis cannot be undone. Product records and associated image records will be deleted.`
        );

        if (!confirmed) return;

        setSavingIds((ids) =>
            ids.includes(product.id) ? ids : [...ids, product.id]
        );
        setError("");
        setNotice("");

        try {
            await deleteAdminProduct(product.id);

            setProducts((current) =>
                current.filter((item) => item.id !== product.id)
            );

            setSelectedImages((current) => {
                const next = { ...current };
                delete next[product.id];
                return next;
            });

            setProductDetails((current) => {
                const next = { ...current };
                delete next[product.id];
                return next;
            });

            if (editingId === product.id) {
                setEditingId(null);
            }

            setNotice(`"${product.name}" was permanently deleted.`);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Unable to delete product."
            );
        } finally {
            setSavingIds((ids) => ids.filter((id) => id !== product.id));
        }
    }

    const filteredProducts = products.filter((product) => {
        const term = search.trim().toLowerCase();

        return (
            product.name.toLowerCase().includes(term) ||
            product.catalogueNumber.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term)
        );
    });

    const featuredCount = products.filter(
        (product) =>
            product.featured && product.isPublished && !product.isArchived
    ).length;

    const publishedCount = products.filter(
        (product) => product.isPublished && !product.isArchived
    ).length;

    const archivedCount = products.filter(
        (product) => product.isArchived
    ).length;

    if (isCheckingSession) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-5 text-neutral-800">
                <p className="text-sm">Checking admin session...</p>
            </main>
        );
    }

    if (!isAuthenticated) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#f5f1e8] px-5 py-10 text-neutral-800">
                <section className="w-full max-w-md border border-black/15 p-7 sm:p-10">
                    <p className="text-xs uppercase tracking-[0.3em] text-neutral-700">
                        Akshita Melamine
                    </p>

                    <h1 className="mt-4 text-3xl tracking-tight">
                        Admin Login
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-neutral-700">
                        Sign in to manage products, images and catalogue visibility.
                    </p>

                    <form onSubmit={handleLogin} className="mt-8 space-y-5">
                        <label className="block text-sm text-neutral-700">
                            Product admin token

                            <input
                                type="password"
                                autoComplete="current-password"
                                value={adminToken}
                                onChange={(event) => setAdminToken(event.target.value)}
                                required
                                className="mt-2 w-full border border-black/20 bg-white px-4 py-3 text-neutral-800 outline-none focus:border-black"
                                placeholder="Enter your admin token"
                            />
                        </label>

                        {error && (
                            <p role="alert" className="text-sm text-red-900">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loginLoading}
                            className="w-full bg-neutral-900 px-5 py-3 text-xs uppercase tracking-widest text-white disabled:opacity-50"
                        >
                            {loginLoading ? "Signing In..." : "Sign In"}
                        </button>

                        <Link
                            href="/"
                            className="block text-center text-xs uppercase tracking-widest text-neutral-700"
                        >
                            Return to Website
                        </Link>
                    </form>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f5f1e8] px-5 py-10 text-neutral-800 md:px-10">
            <div className="mx-auto max-w-7xl">
                <header className="flex flex-col justify-between gap-5 border-b border-black/15 pb-8 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-neutral-700">
                            Akshita Melamine
                        </p>
                        <h1 className="mt-3 text-4xl tracking-tight md:text-5xl">
                            Product Administration
                        </h1>
                        <p className="mt-3 text-sm text-neutral-700">
                            Manage product details, images, visibility and availability.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-5">
                        <Link
                            href="/"
                            className="w-fit border-b border-black pb-2 text-xs uppercase tracking-[0.2em]"
                        >
                            View Website →
                        </Link>

                        <button
                            type="button"
                            onClick={() => void handleLogout()}
                            className="border border-black/30 px-4 py-3 text-xs uppercase tracking-widest hover:bg-black hover:text-white"
                        >
                            Log Out
                        </button>
                    </div>
                </header>

                <section className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="border border-black/10 p-5">
                        <p className="text-xs uppercase tracking-widest text-neutral-700">
                            Total Products
                        </p>
                        <p className="mt-3 text-3xl">{products.length}</p>
                    </div>

                    <div className="border border-black/10 p-5">
                        <p className="text-xs uppercase tracking-widest text-neutral-700">
                            Published
                        </p>
                        <p className="mt-3 text-3xl">{publishedCount}</p>
                    </div>

                    <div className="border border-black/10 p-5">
                        <p className="text-xs uppercase tracking-widest text-neutral-700">
                            Featured
                        </p>
                        <p className="mt-3 text-3xl">{featuredCount}</p>
                    </div>

                    <div className="border border-black/10 p-5">
                        <p className="text-xs uppercase tracking-widest text-neutral-700">
                            Archived
                        </p>
                        <p className="mt-3 text-3xl">{archivedCount}</p>
                    </div>
                </section>

                {/* Add Product */}
                <section className="mb-8 border border-black/15">
                    <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-lg">Add a Product</h2>
                            <p className="mt-1 text-sm text-neutral-700">
                                Create a catalogue entry, then upload its product images.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                if (showCreateForm) {
                                    setShowCreateForm(false);
                                    setError("");
                                } else {
                                    openCreateForm();
                                }
                            }}
                            disabled={creatingProduct}
                            className="w-fit bg-neutral-900 px-5 py-3 text-xs uppercase tracking-widest text-white disabled:opacity-50"
                        >
                            {showCreateForm ? "Cancel" : "+ Add Product"}
                        </button>
                    </div>

                    {showCreateForm && (
                        <div className="border-t border-black/15 p-5">
                            <form
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    void handleCreateProduct();
                                }}
                                className="grid gap-5 sm:grid-cols-2"
                            >
                                <label className="text-sm text-neutral-700">
                                    Product name *
                                    <input
                                        value={createForm.name}
                                        onChange={(event) =>
                                            setCreateForm((current) => ({
                                                ...current,
                                                name: event.target.value,
                                            }))
                                        }
                                        maxLength={200}
                                        required
                                        placeholder="Enter product name"
                                        className="mt-2 w-full border border-black/20 bg-white px-3 py-3 text-neutral-800 outline-none focus:border-black"
                                    />
                                </label>

                                <label className="text-sm text-neutral-700">
                                    Catalogue number *
                                    <input
                                        value={createForm.catalogue_number}
                                        onChange={(event) =>
                                            setCreateForm((current) => ({
                                                ...current,
                                                catalogue_number: event.target.value,
                                            }))
                                        }
                                        maxLength={100}
                                        required
                                        placeholder="e.g. AK-001"
                                        className="mt-2 w-full border border-black/20 bg-white px-3 py-3 text-neutral-800 outline-none focus:border-black"
                                    />
                                </label>

                                <label className="text-sm text-neutral-700 sm:col-span-2">
                                    Category *
                                    <input
                                        value={createForm.category}
                                        onChange={(event) =>
                                            setCreateForm((current) => ({
                                                ...current,
                                                category: event.target.value,
                                            }))
                                        }
                                        maxLength={100}
                                        required
                                        placeholder="e.g. Dinner Plates"
                                        className="mt-2 w-full border border-black/20 bg-white px-3 py-3 text-neutral-800 outline-none focus:border-black sm:max-w-xl"
                                    />
                                </label>

                                <label className="text-sm text-neutral-700 sm:col-span-2">
                                    Description *
                                    <textarea
                                        value={createForm.description}
                                        onChange={(event) =>
                                            setCreateForm((current) => ({
                                                ...current,
                                                description: event.target.value,
                                            }))
                                        }
                                        maxLength={10000}
                                        rows={4}
                                        required
                                        placeholder="Enter an accurate product description."
                                        className="mt-2 w-full border border-black/20 bg-white px-3 py-3 text-neutral-800 outline-none focus:border-black"
                                    />
                                </label>

                                <div className="flex flex-wrap gap-x-8 gap-y-4 sm:col-span-2">
                                    <label className="flex items-center gap-3 text-sm text-neutral-800">
                                        <input
                                            type="checkbox"
                                            checked={createForm.is_published}
                                            onChange={(event) =>
                                                setCreateForm((current) => ({
                                                    ...current,
                                                    is_published: event.target.checked,
                                                    featured: event.target.checked
                                                        ? current.featured
                                                        : false,
                                                }))
                                            }
                                            className="h-4 w-4 accent-neutral-800"
                                        />
                                        Publish immediately
                                    </label>

                                    <label className="flex items-center gap-3 text-sm text-neutral-800">
                                        <input
                                            type="checkbox"
                                            checked={createForm.featured}
                                            disabled={!createForm.is_published}
                                            onChange={(event) =>
                                                setCreateForm((current) => ({
                                                    ...current,
                                                    featured: event.target.checked,
                                                }))
                                            }
                                            className="h-4 w-4 accent-neutral-800"
                                        />
                                        Mark as featured
                                    </label>
                                </div>

                                <p className="text-xs leading-5 text-neutral-700 sm:col-span-2">
                                    Products are created as drafts by default. You can upload
                                    images after creation. Only publish a product when its
                                    details and imagery are ready.
                                </p>

                                <div className="flex flex-wrap gap-3 sm:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={creatingProduct}
                                        className="bg-neutral-900 px-6 py-3 text-xs uppercase tracking-widest text-white disabled:opacity-50"
                                    >
                                        {creatingProduct ? "Creating Product..." : "Create Product"}
                                    </button>

                                    <button
                                        type="button"
                                        disabled={creatingProduct}
                                        onClick={() => {
                                            setShowCreateForm(false);
                                            setError("");
                                        }}
                                        className="border border-black/30 px-6 py-3 text-xs uppercase tracking-widest disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </section>

                <section className="py-4">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row">
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search name, catalogue number or category..."
                            className="w-full border border-black/20 bg-transparent px-4 py-3 text-sm text-neutral-800 outline-none placeholder:text-neutral-600 focus:border-black sm:max-w-lg"
                        />

                        <button
                            type="button"
                            onClick={() => void loadProducts()}
                            disabled={loading}
                            className="border border-black px-5 py-3 text-xs uppercase tracking-widest disabled:opacity-50"
                        >
                            {loading ? "Loading..." : "Refresh Products"}
                        </button>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mt-5 border border-red-800/30 p-4 text-sm text-red-900"
                        >
                            {error}
                        </div>
                    )}

                    {notice && (
                        <p role="status" className="mt-5 text-sm text-neutral-700">
                            {notice}
                        </p>
                    )}

                    {loading ? (
                        <p className="py-12 text-sm text-neutral-700">
                            Loading products...
                        </p>
                    ) : filteredProducts.length === 0 ? (
                        <p className="py-12 text-sm text-neutral-700">
                            No products found.
                        </p>
                    ) : (
                        <div className="mt-8 overflow-x-auto border-t border-black/15">
                            <table className="w-full min-w-[1050px] border-collapse text-left">
                                <thead>
                                    <tr className="border-b border-black/15 text-xs uppercase tracking-widest text-neutral-700">
                                        <th className="py-4 pr-4 font-normal">Product</th>
                                        <th className="px-4 py-4 font-normal">Category</th>
                                        <th className="px-4 py-4 font-normal">Published</th>
                                        <th className="px-4 py-4 font-normal">Featured</th>
                                        <th className="px-4 py-4 font-normal">Availability</th>
                                        <th className="px-4 py-4 font-normal">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredProducts.map((product) => {
                                        const saving = savingIds.includes(product.id);
                                        const editing = editingId === product.id;
                                        const details = productDetails[product.id];
                                        const loadingImages = loadingImageIds.includes(product.id);

                                        return (
                                            <tr
                                                key={product.id}
                                                className="border-b border-black/10"
                                            >
                                                {editing ? (
                                                    <td colSpan={6} className="p-5">
                                                        <div className="grid gap-4 sm:grid-cols-2">
                                                            <label className="text-sm text-neutral-700">
                                                                Product name
                                                                <input
                                                                    value={form.name}
                                                                    onChange={(event) =>
                                                                        setForm({
                                                                            ...form,
                                                                            name: event.target.value,
                                                                        })
                                                                    }
                                                                    className="mt-1 w-full border border-black/20 bg-white px-3 py-2 text-neutral-800"
                                                                    required
                                                                />
                                                            </label>

                                                            <label className="text-sm text-neutral-700">
                                                                Catalogue number
                                                                <input
                                                                    value={form.catalogue_number}
                                                                    onChange={(event) =>
                                                                        setForm({
                                                                            ...form,
                                                                            catalogue_number: event.target.value,
                                                                        })
                                                                    }
                                                                    className="mt-1 w-full border border-black/20 bg-white px-3 py-2 text-neutral-800"
                                                                    required
                                                                />
                                                            </label>

                                                            <label className="text-sm text-neutral-700">
                                                                Category
                                                                <input
                                                                    value={form.category}
                                                                    onChange={(event) =>
                                                                        setForm({
                                                                            ...form,
                                                                            category: event.target.value,
                                                                        })
                                                                    }
                                                                    className="mt-1 w-full border border-black/20 bg-white px-3 py-2 text-neutral-800"
                                                                    required
                                                                />
                                                            </label>

                                                            <label className="text-sm text-neutral-700 sm:col-span-2">
                                                                Description
                                                                <textarea
                                                                    value={form.description}
                                                                    onChange={(event) =>
                                                                        setForm({
                                                                            ...form,
                                                                            description: event.target.value,
                                                                        })
                                                                    }
                                                                    rows={3}
                                                                    className="mt-1 w-full border border-black/20 bg-white px-3 py-2 text-neutral-800"
                                                                    required
                                                                />
                                                            </label>

                                                            <div className="border-t border-black/10 pt-5 sm:col-span-2">
                                                                <h3 className="mb-3 text-sm font-medium text-neutral-800">
                                                                    Product Images
                                                                </h3>

                                                                {loadingImages ? (
                                                                    <p className="text-sm text-neutral-700">
                                                                        Loading product images...
                                                                    </p>
                                                                ) : details ? (
                                                                    details.images.length === 0 ? (
                                                                        <p className="text-sm text-neutral-700">
                                                                            No images uploaded for this product yet.
                                                                        </p>
                                                                    ) : (
                                                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                                                                            {details.images.map((image) => (
                                                                                <div
                                                                                    key={image.id}
                                                                                    className="border border-black/15 bg-white p-3"
                                                                                >
                                                                                    <img
                                                                                        src={image.cardUrl}
                                                                                        alt={`${product.name} image ${image.id}`}
                                                                                        className="aspect-square w-full object-cover"
                                                                                    />

                                                                                    <p className="mt-3 text-xs text-neutral-700">
                                                                                        Image #{image.id}
                                                                                    </p>

                                                                                    {image.isPrimary && (
                                                                                        <p className="mt-1 text-xs font-medium text-green-900">
                                                                                            Primary image
                                                                                        </p>
                                                                                    )}

                                                                                    <div className="mt-3 flex flex-col gap-2">
                                                                                        {!image.isPrimary && (
                                                                                            <button
                                                                                                type="button"
                                                                                                disabled={saving}
                                                                                                onClick={() =>
                                                                                                    void handleSetPrimaryImage(
                                                                                                        product,
                                                                                                        image.id
                                                                                                    )
                                                                                                }
                                                                                                className="border border-black/40 px-2 py-2 text-xs uppercase tracking-wide disabled:opacity-50"
                                                                                            >
                                                                                                Set as Primary
                                                                                            </button>
                                                                                        )}

                                                                                        <button
                                                                                            type="button"
                                                                                            disabled={saving}
                                                                                            onClick={() =>
                                                                                                void handleDeleteImage(
                                                                                                    product,
                                                                                                    image.id
                                                                                                )
                                                                                            }
                                                                                            className="border border-red-800/40 px-2 py-2 text-xs uppercase tracking-wide text-red-900 disabled:opacity-50"
                                                                                        >
                                                                                            Delete Image
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )
                                                                ) : (
                                                                    <p className="text-sm text-neutral-700">
                                                                        Product image details are not available.
                                                                    </p>
                                                                )}

                                                                <div className="mt-6 border-t border-black/10 pt-5">
                                                                    <p className="mb-3 text-sm font-medium text-neutral-800">
                                                                        Upload a New Image
                                                                    </p>

                                                                    <p className="mb-3 text-xs text-neutral-700">
                                                                        JPEG, PNG or WebP. Maximum size: 10 MB.
                                                                        Uploading makes the new image primary.
                                                                    </p>

                                                                    <input
                                                                        id={`image-upload-${product.id}`}
                                                                        type="file"
                                                                        accept="image/jpeg,image/png,image/webp"
                                                                        disabled={saving}
                                                                        onChange={(event) => {
                                                                            const file =
                                                                                event.target.files?.[0] ?? null;

                                                                            setSelectedImages((current) => ({
                                                                                ...current,
                                                                                [product.id]: file,
                                                                            }));
                                                                        }}
                                                                        className="block w-full text-sm text-neutral-700"
                                                                    />

                                                                    {selectedImages[product.id] && (
                                                                        <p className="mt-2 text-xs text-neutral-700">
                                                                            Selected:{" "}
                                                                            {selectedImages[product.id]?.name}
                                                                        </p>
                                                                    )}

                                                                    <button
                                                                        type="button"
                                                                        disabled={
                                                                            saving || !selectedImages[product.id]
                                                                        }
                                                                        onClick={() =>
                                                                            void handleImageUpload(product)
                                                                        }
                                                                        className="mt-3 border border-black px-4 py-3 text-xs uppercase tracking-widest disabled:opacity-50"
                                                                    >
                                                                        {saving ? "Uploading..." : "Upload Image"}
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-wrap gap-3 sm:col-span-2">
                                                                <button
                                                                    type="button"
                                                                    disabled={saving}
                                                                    onClick={() => void saveDetails(product)}
                                                                    className="bg-neutral-900 px-5 py-3 text-xs uppercase tracking-widest text-white disabled:opacity-50"
                                                                >
                                                                    {saving ? "Saving..." : "Save Changes"}
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={saving}
                                                                    onClick={() => setEditingId(null)}
                                                                    className="border border-black/30 px-5 py-3 text-xs uppercase tracking-widest disabled:opacity-50"
                                                                >
                                                                    Close Editor
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                ) : (
                                                    <>
                                                        <td className="py-5 pr-4">
                                                            <p className="text-sm font-medium">
                                                                {product.name}
                                                            </p>
                                                            <p className="mt-1 text-xs text-neutral-700">
                                                                {product.catalogueNumber}
                                                            </p>
                                                        </td>

                                                        <td className="px-4 py-5 text-sm text-neutral-700">
                                                            {product.category}
                                                        </td>

                                                        <td className="px-4 py-5">
                                                            <label className="inline-flex items-center gap-2 text-sm">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={product.isPublished}
                                                                    disabled={saving || product.isArchived}
                                                                    onChange={() =>
                                                                        void toggleStatus(product, "is_published")
                                                                    }
                                                                    className="h-4 w-4 accent-neutral-800"
                                                                />
                                                                {product.isPublished ? "Yes" : "No"}
                                                            </label>
                                                        </td>

                                                        <td className="px-4 py-5">
                                                            <label className="inline-flex items-center gap-2 text-sm">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={product.featured}
                                                                    disabled={
                                                                        saving ||
                                                                        !product.isPublished ||
                                                                        product.isArchived
                                                                    }
                                                                    onChange={() =>
                                                                        void toggleStatus(product, "featured")
                                                                    }
                                                                    className="h-4 w-4 accent-neutral-800"
                                                                />
                                                                {product.featured ? "Yes" : "No"}
                                                            </label>
                                                        </td>

                                                        <td className="px-4 py-5 text-sm">
                                                            <span
                                                                className={
                                                                    product.isArchived
                                                                        ? "text-amber-900"
                                                                        : product.isPublished
                                                                            ? "text-green-900"
                                                                            : "text-neutral-700"
                                                                }
                                                            >
                                                                {product.isArchived
                                                                    ? "Archived"
                                                                    : product.isPublished
                                                                        ? "Published"
                                                                        : "Draft"}
                                                            </span>
                                                        </td>

                                                        <td className="px-4 py-5">
                                                            <div className="flex flex-wrap gap-2">
                                                                <button
                                                                    type="button"
                                                                    disabled={saving}
                                                                    onClick={() => void startEditing(product)}
                                                                    className="border border-black/40 px-3 py-2 text-xs uppercase tracking-widest hover:bg-black hover:text-white disabled:opacity-50"
                                                                >
                                                                    Edit & Images
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={saving}
                                                                    onClick={() => void toggleArchive(product)}
                                                                    className="border border-black/40 px-3 py-2 text-xs uppercase tracking-widest disabled:opacity-50"
                                                                >
                                                                    {product.isArchived ? "Restore" : "Archive"}
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={saving}
                                                                    onClick={() =>
                                                                        void permanentlyDeleteProduct(product)
                                                                    }
                                                                    className="border border-red-800/50 px-3 py-2 text-xs uppercase tracking-widest text-red-900 disabled:opacity-50"
                                                                >
                                                                    {saving ? "Working..." : "Delete Product"}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
                <EnquiryManager />
            </div>
        </main>
    );
}
