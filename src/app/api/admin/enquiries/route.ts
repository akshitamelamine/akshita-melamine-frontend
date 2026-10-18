
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://127.0.0.1:8000";

function getAdminToken(request: NextRequest): string | null {
  return request.headers.get("X-Admin-Token");
}

export async function GET(request: NextRequest) {
  const token = getAdminToken(request);

  if (!token) {
    return NextResponse.json(
      { detail: "Enter your admin token to view enquiries." },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${BACKEND_API_URL}/enquiries/admin/all?offset=0&limit=100`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "X-Admin-Token": token,
        },
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
