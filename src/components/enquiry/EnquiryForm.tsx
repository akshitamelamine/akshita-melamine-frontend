
"use client";

import { FormEvent, useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8000";

interface EnquiryResponse {
  id: number;
  customer_name: string;
  status: string;
}

export default function EnquiryForm() {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [enquiryId, setEnquiryId] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const product = params.get("product");

    if (product) {
      setSelectedProduct(product);
    }
  }, []);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      customer_name: String(formData.get("name") ?? "").trim(),
      company_name: String(formData.get("company") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      requested_product:
        String(formData.get("product") ?? "").trim() || null,
      quantity:
        String(formData.get("quantity") ?? "").trim() || null,
      variant:
        String(formData.get("variant") ?? "").trim() || null,
      message:
        String(formData.get("message") ?? "").trim() || null,

      // Legitimate visitors should leave this hidden field empty.
      website: String(formData.get("website") ?? "").trim(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let message =
          "We couldn't submit your enquiry. Please try again.";

        if (response.status === 429) {
          message =
            "Too many submission attempts. Please wait a minute and try again.";
        } else {
          try {
            const body = await response.json();

            if (typeof body.detail === "string") {
              message = body.detail;
            } else if (Array.isArray(body.detail)) {
              message =
                "Please check your details, including your email address, and try again.";
            }
          } catch {
            // Keep the default message if the response isn't JSON.
          }
        }

        throw new Error(message);
      }

      const result: EnquiryResponse = await response.json();

      setEnquiryId(result.id);
      setSubmitted(true);
      form.reset();
      setSelectedProduct("");
    } catch (error) {
      setErrorMessage(
        error instanceof TypeError
          ? "We couldn't connect to the server. Please try again in a moment."
          : error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="border-t border-black/10 pt-10">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-700">
          Enquiry Submitted
        </p>

        <h3 className="mt-6 max-w-2xl text-4xl leading-tight tracking-tight text-neutral-700 md:text-5xl">
          Thank you for your enquiry.
        </h3>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-neutral-700">
          Your enquiry has been saved successfully. Our team can
          review your requirements and follow up with you.
        </p>

        {enquiryId !== null && (
          <p className="mt-4 text-sm text-neutral-700">
            Reference number: #{enquiryId}
          </p>
        )}

        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setEnquiryId(null);
            setErrorMessage("");
          }}
          className="mt-8 border-b border-black pb-2 text-xs uppercase tracking-[0.2em] text-neutral-700"
        >
          Send Another Enquiry →
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative border-t border-black/10"
    >
      {/* Anti-spam honeypot: hidden from legitimate visitors. */}
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="website">
          Leave this field empty
        </label>

        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          maxLength={200}
        />
      </div>

      {/* Name */}
      <div className="border-b border-black/10 py-6 focus-within:border-black">
        <label
          htmlFor="name"
          className="mb-3 block text-xs uppercase tracking-[0.2em] text-neutral-700"
        >
          Name *
        </label>

        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={150}
          autoComplete="name"
          placeholder="Your name"
          className="w-full bg-transparent text-lg text-neutral-700 outline-none placeholder:text-neutral-700/60"
        />
      </div>

      {/* Company */}
      <div className="border-b border-black/10 py-6 focus-within:border-black">
        <label
          htmlFor="company"
          className="mb-3 block text-xs uppercase tracking-[0.2em] text-neutral-700"
        >
          Company / Organisation *
        </label>

        <input
          id="company"
          name="company"
          type="text"
          required
          maxLength={200}
          autoComplete="organization"
          placeholder="Company or organisation"
          className="w-full bg-transparent text-lg text-neutral-700 outline-none placeholder:text-neutral-700/60"
        />
      </div>

      {/* Phone and email */}
      <div className="grid gap-0 md:grid-cols-2 md:gap-8">
        <div className="border-b border-black/10 py-6 focus-within:border-black">
          <label
            htmlFor="phone"
            className="mb-3 block text-xs uppercase tracking-[0.2em] text-neutral-700"
          >
            Phone *
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            required
            maxLength={30}
            autoComplete="tel"
            placeholder="Phone number"
            className="w-full bg-transparent text-lg text-neutral-700 outline-none placeholder:text-neutral-700/60"
          />
        </div>

        <div className="border-b border-black/10 py-6 focus-within:border-black">
          <label
            htmlFor="email"
            className="mb-3 block text-xs uppercase tracking-[0.2em] text-neutral-700"
          >
            Email *
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder="Email address"
            className="w-full bg-transparent text-lg text-neutral-700 outline-none placeholder:text-neutral-700/60"
          />
        </div>
      </div>

      {/* City */}
      <div className="border-b border-black/10 py-6 focus-within:border-black">
        <label
          htmlFor="city"
          className="mb-3 block text-xs uppercase tracking-[0.2em] text-neutral-700"
        >
          City *
        </label>

        <input
          id="city"
          name="city"
          type="text"
          required
          maxLength={100}
          autoComplete="address-level2"
          placeholder="City"
          className="w-full bg-transparent text-lg text-neutral-700 outline-none placeholder:text-neutral-700/60"
        />
      </div>

      {/* Product */}
      <div className="border-b border-black/10 py-6 focus-within:border-black">
        <label
          htmlFor="product"
          className="mb-3 block text-xs uppercase tracking-[0.2em] text-neutral-700"
        >
          Product / Collection
        </label>

        <input
          id="product"
          name="product"
          type="text"
          maxLength={200}
          value={selectedProduct}
          onChange={(event) => setSelectedProduct(event.target.value)}
          placeholder="Product or collection you're interested in"
          className="w-full bg-transparent text-lg text-neutral-700 outline-none placeholder:text-neutral-700/60"
        />
      </div>

      {/* Quantity */}
      <div className="border-b border-black/10 py-6 focus-within:border-black">
        <label
          htmlFor="quantity"
          className="mb-3 block text-xs uppercase tracking-[0.2em] text-neutral-700"
        >
          Quantity
        </label>

        <input
          id="quantity"
          name="quantity"
          type="text"
          maxLength={100}
          placeholder="Approximate requirement"
          className="w-full bg-transparent text-lg text-neutral-700 outline-none placeholder:text-neutral-700/60"
        />
      </div>

      {/* Preferred size or variant */}
      <div className="border-b border-black/10 py-6 focus-within:border-black">
        <label
          htmlFor="variant"
          className="mb-3 block text-xs uppercase tracking-[0.2em] text-neutral-700"
        >
          Preferred Size / Variant
        </label>

        <input
          id="variant"
          name="variant"
          type="text"
          maxLength={150}
          placeholder="Size, colour, variant or other preference"
          className="w-full bg-transparent text-lg text-neutral-700 outline-none placeholder:text-neutral-700/60"
        />
      </div>

      {/* Message */}
      <div className="border-b border-black/10 py-6 focus-within:border-black">
        <label
          htmlFor="message"
          className="mb-3 block text-xs uppercase tracking-[0.2em] text-neutral-700"
        >
          Message
        </label>

        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={10000}
          placeholder="Tell us about your requirement..."
          className="w-full resize-none bg-transparent text-lg text-neutral-700 outline-none placeholder:text-neutral-700/60"
        />
      </div>

      {/* Error message */}
      {errorMessage && (
        <p
          role="alert"
          className="mt-6 text-sm leading-relaxed text-red-700"
        >
          {errorMessage}
        </p>
      )}

      {/* Submit */}
      <div className="pt-8">
        <button
          type="submit"
          disabled={submitting}
          className="bg-black px-8 py-4 text-xs uppercase tracking-[0.2em] text-white transition-opacity duration-300 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Sending Enquiry..." : "Send Enquiry →"}
        </button>
      </div>
    </form>
  );
}
