import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const path = request.nextUrl.searchParams.get("path");

    if (!path || !path.startsWith("/media/")) {
      return NextResponse.json(
        { message: "مسیر تصویر نامعتبر است." },
        { status: 400 },
      );
    }

    const apiBase =
      process.env.INTERNAL_API_URL ||
      "https://contino-bastan.bastantile.com/api/v1";

    const base = new URL(apiBase);
    const imageUrl = new URL(path, base.origin);

    if (
      imageUrl.origin !== base.origin ||
      !imageUrl.pathname.startsWith("/media/")
    ) {
      return NextResponse.json(
        { message: "مسیر تصویر نامعتبر است." },
        { status: 400 },
      );
    }

    const response = await axios.get(imageUrl.toString(), {
      adapter: "http",
      proxy: false,
      maxRedirects: 0,
      timeout: 15000,
      responseType: "arraybuffer",
      headers: {
        Host: "contino-bastan.bastantile.com",
      },
      validateStatus: () => true,
    });

    if (response.status !== 200) {
      console.error("Visualizer media upstream status:", response.status);

      return NextResponse.json(
        {
          message: "دریافت تصویر با خطا مواجه شد.",
          status: response.status,
        },
        { status: response.status >= 400 ? response.status : 502 },
      );
    }

    return new NextResponse(new Uint8Array(response.data), {
      status: 200,
      headers: {
        "Content-Type": String(
          response.headers["content-type"] || "image/jpeg",
        ),
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error(
      "Visualizer media proxy error:",
      axios.isAxiosError(error)
        ? { code: error.code, message: error.message }
        : error,
    );

    return NextResponse.json(
      { message: "ارتباط با سرور تصویر برقرار نشد." },
      { status: 502 },
    );
  }
}
