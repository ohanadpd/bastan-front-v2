import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const baseUrl =
      process.env.INTERNAL_API_URL ||
      "https://contino-bastan.bastantile.com/api/v1";

    const url = `${baseUrl.replace(/\/+$/, "")}/products/search/`;

    const response = await axios.get(url, {
      adapter: "http",
      proxy: false,
      maxRedirects: 0,
      timeout: 15000,
      headers: {
        Accept: "application/json",
        Host: "contino-bastan.bastantile.com",
      },
      params: {
        page: request.nextUrl.searchParams.get("page") || "1",
        limit: request.nextUrl.searchParams.get("limit") || "12",
      },
      validateStatus: () => true,
    });

    if (response.status < 200 || response.status >= 300) {
      console.error("Visualizer products upstream status:", response.status);

      return NextResponse.json(
        {
          message: "خطا در دریافت محصولات",
          status: response.status,
        },
        { status: response.status >= 400 ? response.status : 502 },
      );
    }

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(
      "Visualizer products proxy error:",
      axios.isAxiosError(error)
        ? { code: error.code, message: error.message }
        : error,
    );

    return NextResponse.json(
      { message: "ارتباط با سرور محصولات برقرار نشد." },
      { status: 502 },
    );
  }
}