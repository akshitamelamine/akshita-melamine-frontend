import { NextRequest, NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";

function tokensMatch(supplied: string, expected: string): boolean {
  const suppliedHash = createHash("sha256").update(supplied).digest();
  const expectedHash = createHash("sha256").update(expected).digest();

  return timingSafeEqual(suppliedHash, expectedHash);
}

export async function POST(request: NextRequest) {
  const expectedToken = process.env.PRODUCT_ADMIN_TOKEN;

  if (!expectedToken) {
    return NextResponse.json(
      { detail: "Product administration is not configured." },
      { status: 503 }
    );
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { detail: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("token" in payload) ||
    typeof payload.token !== "string" ||
    !payload.token
  ) {
    return NextResponse.json(
      { detail: "Enter your product admin token." },
      { status: 401 }
    );
  }

  if (!tokensMatch(payload.token, expectedToken)) {
    return NextResponse.json(
      { detail: "Invalid product admin token." },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ authenticated: true });

  response.cookies.set("product_admin_session", payload.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/admin/products",
    maxAge: 60 * 60 * 8,
  });

  return response;
}

export async function GET(request: NextRequest) {
  const expectedToken = process.env.PRODUCT_ADMIN_TOKEN;
  const sessionToken = request.cookies.get("product_admin_session")?.value;

  if (!expectedToken || !sessionToken) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: tokensMatch(sessionToken, expectedToken),
  });
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });

  response.cookies.set("product_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/admin/products",
    maxAge: 0,
  });

  return response;
}