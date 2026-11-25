import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MegaScript Digital | Websites, Web Applications & Mobile Apps";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#090d16",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-150px",
            right: "-150px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(2, 132, 199, 0.35) 0%, rgba(9, 13, 22, 0) 70%)",
          }}
        />

        {/* Brand Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              backgroundColor: "#0284c7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              fontWeight: "900",
              color: "#ffffff",
            }}
          >
            M
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "800",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#38bdf8",
              }}
            >
              MEGASCRIPT DIGITAL
            </span>
            <span style={{ fontSize: "13px", color: "#94a3b8" }}>
              Nairobi, Kenya • megascriptdigital.co.ke
            </span>
          </div>
        </div>

        {/* Main Title & Value Proposition */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "900px" }}>
          <h1
            style={{
              fontSize: "52px",
              fontWeight: "900",
              lineHeight: 1.15,
              letterSpacing: "-1px",
              color: "#ffffff",
              margin: 0,
            }}
          >
            Websites, Custom Web Applications & Mobile Systems
          </h1>
          <p
            style={{
              fontSize: "22px",
              lineHeight: 1.4,
              color: "#cbd5e1",
              margin: 0,
            }}
          >
            Resilient digital engineering for East African enterprises, growing agencies, and ambitious brands.
          </p>
        </div>

        {/* Capabilities Tag Row */}
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          {["Full-Stack Web Apps", "iOS & Android", "High-Converting Websites", "Tony AI Assistant"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 18px",
                borderRadius: "30px",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                fontSize: "15px",
                fontWeight: "600",
                color: "#e2e8f0",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
