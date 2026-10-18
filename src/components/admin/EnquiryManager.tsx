
"use client";

import { useCallback, useState } from "react";

type EnquiryStatus =
  | "new"
  | "in_progress"
  | "contacted"
  | "resolved"
  | "closed";

interface Enquiry {
  id: number;
  customer_name: string;
  company_name: string;
  phone: string;
  email: string;
  city: string;
  requested_product: string | null;
  quantity: string | null;
  variant: string | null;
  message: string | null;
  status: EnquiryStatus;
  created_at: string;
}

const STATUS_OPTIONS: { value: EnquiryStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "contacted", label: "Contacted" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function EnquiryManager() {
  const [token, setToken] = useState("");
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [hasLoaded, setHasLoaded] = useState(false);

  const loadEnquiries = useCallback(async () => {
    if (!token.trim()) {
      setError("Enter your enquiry admin token first.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/enquiries", {
        method: "GET",
        headers: {
          "X-Admin-Token": token.trim(),
        },
        cache: "no-store",
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body.detail || "Unable to retrieve enquiries."
        );
      }

      setEnquiries(body as Enquiry[]);
      setHasLoaded(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve enquiries."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  async function updateStatus(
    enquiry: Enquiry,
    nextStatus: EnquiryStatus
  ) {
    if (!token.trim()) {
      setError("Enter your admin token first.");
      return;
    }

    setUpdatingIds((current) =>
      current.includes(enquiry.id)
        ? current
        : [...current, enquiry.id]
    );
    setError("");
    setNotice("");

    try {
      const response = await fetch(
        `/api/admin/enquiries/${enquiry.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Token": token.trim(),
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );

      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.detail || "Unable to update status.");
      }

      setEnquiries((current) =>
        current.map((item) =>
          item.id === enquiry.id ? (body as Enquiry) : item
        )
      );

      setNotice(`Enquiry #${enquiry.id} status updated.`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update enquiry status."
      );
    } finally {
      setUpdatingIds((current) =>
        current.filter((id) => id !== enquiry.id)
      );
    }
  }

  const newCount = enquiries.filter(
    (item) => item.status === "new"
  ).length;

  const activeCount = enquiries.filter(
    (item) =>
      item.status === "in_progress" || item.status === "contacted"
  ).length;

  const resolvedCount = enquiries.filter(
    (item) =>
      item.status === "resolved" || item.status === "closed"
  ).length;

  return (
    <section className="mt-12 border-t border-black/15 pt-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-700">
            Customer Relations
          </p>
          <h2 className="mt-3 text-3xl tracking-tight md:text-4xl">
            Customer Enquiries
          </h2>
          <p className="mt-3 text-sm text-neutral-700">
            Review customer requirements and manage follow-ups.
          </p>
        </div>
      </div>

      <div className="mt-6 border border-black/15 p-5">
        <label
          htmlFor="enquiry-admin-token"
          className="block text-xs uppercase tracking-widest text-neutral-700"
        >
          Enquiry admin token
        </label>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            id="enquiry-admin-token"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            autoComplete="off"
            placeholder="Enter your backend admin token"
            className="min-w-0 flex-1 border border-black/20 bg-white px-4 py-3 text-sm text-neutral-800 outline-none focus:border-black"
          />

          <button
            type="button"
            disabled={loading || !token.trim()}
            onClick={() => void loadEnquiries()}
            className="bg-neutral-900 px-5 py-3 text-xs uppercase tracking-widest text-white disabled:opacity-50"
          >
            {loading
              ? "Loading..."
              : hasLoaded
                ? "Refresh Enquiries"
                : "Load Enquiries"}
          </button>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-neutral-700">
          The token is held in memory only and is cleared when this page
          is refreshed. Do not share it or put it in frontend environment
          variables.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 border border-red-800/30 p-4 text-sm text-red-900"
        >
          {error}
        </p>
      )}

      {notice && (
        <p role="status" className="mt-5 text-sm text-neutral-700">
          {notice}
        </p>
      )}

      {hasLoaded && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="border border-black/10 p-5">
              <p className="text-xs uppercase tracking-widest text-neutral-700">
                New
              </p>
              <p className="mt-3 text-3xl">{newCount}</p>
            </div>

            <div className="border border-black/10 p-5">
              <p className="text-xs uppercase tracking-widest text-neutral-700">
                In Progress / Contacted
              </p>
              <p className="mt-3 text-3xl">{activeCount}</p>
            </div>

            <div className="border border-black/10 p-5">
              <p className="text-xs uppercase tracking-widest text-neutral-700">
                Resolved / Closed
              </p>
              <p className="mt-3 text-3xl">{resolvedCount}</p>
            </div>
          </div>

          <div className="mt-8 space-y-5">
            {enquiries.length === 0 ? (
              <p className="border border-black/10 p-8 text-sm text-neutral-700">
                No enquiries have been submitted yet.
              </p>
            ) : (
              enquiries.map((enquiry) => (
                <article
                  key={enquiry.id}
                  className="border border-black/15 bg-white/40 p-5 md:p-7"
                >
                  <div className="flex flex-col justify-between gap-4 border-b border-black/10 pb-5 sm:flex-row">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-neutral-700">
                        Enquiry #{enquiry.id}
                      </p>
                      <h3 className="mt-2 text-xl">
                        {enquiry.customer_name}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-700">
                        {enquiry.company_name}
                      </p>
                      <p className="mt-2 text-xs text-neutral-700">
                        Submitted {formatDate(enquiry.created_at)}
                      </p>
                    </div>

                    <div className="sm:min-w-48">
                      <label
                        htmlFor={`status-${enquiry.id}`}
                        className="block text-xs uppercase tracking-widest text-neutral-700"
                      >
                        Status
                      </label>

                      <select
                        id={`status-${enquiry.id}`}
                        value={enquiry.status}
                        disabled={updatingIds.includes(enquiry.id)}
                        onChange={(event) =>
                          void updateStatus(
                            enquiry,
                            event.target.value as EnquiryStatus
                          )
                        }
                        className="mt-2 w-full border border-black/20 bg-white px-3 py-3 text-sm text-neutral-800 disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>

                      {updatingIds.includes(enquiry.id) && (
                        <p className="mt-2 text-xs text-neutral-700">
                          Saving status...
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-neutral-700">
                        Phone
                      </p>
                      <a
                        href={`tel:${enquiry.phone}`}
                        className="mt-2 inline-block break-all text-sm underline underline-offset-4"
                      >
                        {enquiry.phone}
                      </a>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-neutral-700">
                        Email
                      </p>
                      <a
                        href={`mailto:${enquiry.email}`}
                        className="mt-2 inline-block break-all text-sm underline underline-offset-4"
                      >
                        {enquiry.email}
                      </a>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-neutral-700">
                        City
                      </p>
                      <p className="mt-2 text-sm">{enquiry.city}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-neutral-700">
                        Requested Product
                      </p>
                      <p className="mt-2 text-sm">
                        {enquiry.requested_product || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-neutral-700">
                        Quantity
                      </p>
                      <p className="mt-2 text-sm">
                        {enquiry.quantity || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-widest text-neutral-700">
                        Size / Variant
                      </p>
                      <p className="mt-2 text-sm">
                        {enquiry.variant || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-black/10 pt-5">
                    <p className="text-xs uppercase tracking-widest text-neutral-700">
                      Message
                    </p>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-neutral-800">
                      {enquiry.message || "No additional message."}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </>
      )}
    </section>
  );
}
