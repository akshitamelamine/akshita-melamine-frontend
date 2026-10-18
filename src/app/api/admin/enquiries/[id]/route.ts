
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://127.0.0.1:8000";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  const token = request.headers.get("X-Admin-Token");

  if (!token) {
    return NextResponse.json(
      { detail: "Admin token is required." },
      { status: 401 }
    );
  }

  const { id } = await context.params;

  if (!/^\d+$/.test(id) || Number(id) < 1) {
    return NextResponse.json(
      { detail: "Invalid enquiry ID." },
      { status: 400 }
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

  try {
    const response = await fetch(
      `${BACKEND_API_URL}/enquiries/admin/${id}`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Admin-Token": token,
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    );

    const body = await response.json();

    return NextResponse.json(body, { status: response.status });
  } catch {
    return NextResponse.json(
      { detail: "Unable to connect to the enquiry backend." },
      { status: 502 }
    );
  }
}
