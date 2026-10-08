import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.INTERNAL_API_URL ||
  "https://contino-bastan.bastantile.com/api/v1";

const PRODUCTS_URL =
  `${API_BASE_URL.replace(/\/+$/, "")}/products/search/`;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "12";

    const url = new URL(PRODUCTS_URL);

    url.searchParams.set("page", page);
    url.searchParams.set("limit", limit);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          message: "خطا در دریافت محصولات",
          status: response.status,
        },
        {
          status: response.status,
        }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "Visualizer products proxy error:",
      error
    );

    return NextResponse.json(
      {
        message: "ارتباط با سرور محصولات برقرار نشد.",
      },
      {
        status: 500,
      }
    );
  }
}