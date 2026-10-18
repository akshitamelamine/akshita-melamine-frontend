
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual, createHash } from "node:crypto";

export const runtime = "nodejs";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://127.0.0.1:8000";

interface RouteContext {
  params: Promise<{ path?: string[] }>;
}

function tokensMatch(supplied: string, expected: string): boolean {
  const suppliedHash = createHash("sha256").update(supplied).digest();
  const expectedHash = createHash("sha256").update(expected).digest();

  return timingSafeEqual(suppliedHash, expectedHash);
}

async function proxyRequest(
  request: NextRequest,
  context: RouteContext
) {
  const expectedToken = process.env.PRODUCT_ADMIN_TOKEN;
  const sessionToken = request.cookies.get(
    "product_admin_session"
  )?.value;

  if (!expectedToken) {
    return NextResponse.json(
      { detail: "Product administration is not configured." },
      { status: 503 }
    );
  }

  if (!sessionToken || !tokensMatch(sessionToken, expectedToken)) {
    return NextResponse.json(
      { detail: "Product admin login is required." },
      { status: 401 }
    );
  }

  // Optional catch-all routes have no path parameter at the base URL.
  const { path = [] } = await context.params;

  if (path.some((segment) => !/^[a-zA-Z0-9_-]+$/.test(segment))) {
    return NextResponse.json(
      { detail: "Invalid product API path." },
      { status: 400 }
    );
  }

  // An empty path maps to POST /products for product creation.
  const backendPath = path.length
    ? `/products/${path.map(encodeURIComponent).join("/")}`
    : "/products";

  const backendUrl = new URL(backendPath, BACKEND_API_URL);
  backendUrl.search = request.nextUrl.search;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  headers.set("Accept", "application/json");
  headers.set("X-Product-Admin-Token", expectedToken);

  try {
    const method = request.method;

    const body =
      method === "GET" || method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const backendResponse = await fetch(backendUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });

    const responseBody = await backendResponse.arrayBuffer();
    const responseHeaders = new Headers();

    const responseContentType =
      backendResponse.headers.get("content-type");

    if (responseContentType) {
      responseHeaders.set("Content-Type", responseContentType);
    }

    return new NextResponse(responseBody, {
      status: backendResponse.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Product admin proxy failed:", error);

    return NextResponse.json(
      { detail: "Unable to connect to the product backend." },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function POST(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  return proxyRequest(request, context);
}
