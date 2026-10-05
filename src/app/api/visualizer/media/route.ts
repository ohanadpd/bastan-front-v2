import { NextRequest, NextResponse } from "next/server";

const MEDIA_BASE_URL =
  "https://contino-bastan.bastantile.com";

export async function GET(request: NextRequest) {
  try {
    const path =
      request.nextUrl.searchParams.get("path");

    if (!path) {
      return NextResponse.json(
        {
          message: "مسیر تصویر مشخص نشده است.",
        },
        {
          status: 400,
        }
      );
    }

    if (!path.startsWith("/media/")) {
      return NextResponse.json(
        {
          message: "مسیر تصویر نامعتبر است.",
        },
        {
          status: 400,
        }
      );
    }

    const imageUrl =
      `${MEDIA_BASE_URL}${path}`;

    const response = await fetch(
      imageUrl,
      {
        method: "GET",
        cache: "force-cache",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          message: "دریافت تصویر با خطا مواجه شد.",
          status: response.status,
        },
        {
          status: response.status,
        }
      );
    }

    const contentType =
      response.headers.get("content-type") ||
      "image/jpeg";

    const imageBuffer =
      await response.arrayBuffer();

    return new NextResponse(
      imageBuffer,
      {
        status: 200,

        headers: {
          "Content-Type": contentType,

          "Cache-Control":
            "public, max-age=86400, s-maxage=86400",
        },
      }
    );
  } catch (error) {
    console.error(
      "Visualizer media proxy error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "ارتباط با سرور تصویر برقرار نشد.",
      },
      {
        status: 500,
      }
    );
  }
}