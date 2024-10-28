import { siteConfig } from "@/config/site";
import { ImageResponse } from "next/og";

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                fontSize: "60px",
                color: "#ffffff",
                marginRight: "12px",
              }}
            >
              🚀
            </div>
            <h1
              style={{
                fontSize: "60px",
                fontWeight: "bold",
                color: "#ffffff",
                fontFamily: "Inter Bold",
              }}
            >
              {siteConfig.name}
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: "32px",
              color: "#94a3b8",
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: 1.4,
              fontFamily: "Inter Bold",
            }}
          >
            {siteConfig.description}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "40px",
              display: "flex",
              alignItems: "center",
              color: "#64748b",
              fontSize: "24px",
              fontFamily: "Inter Bold",
            }}
          >
            {siteConfig.url}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(`${error.message}`);
    } else {
      console.log("An unknown error occurred");
    }
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
