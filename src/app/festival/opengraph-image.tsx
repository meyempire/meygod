import { ImageResponse } from "next/og";

export const alt = "The Festival — MeyGOD";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #0d0303 0%, #1a0505 60%, #250303 100%)",
          fontFamily: "Chakra Petch",
          color: "#ffe2e2",
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: "#ff0606",
            letterSpacing: "12px",
            marginBottom: "32px",
            textTransform: "uppercase",
          }}
        >
          MeyGOD Festival
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            lineHeight: 1.1,
            textTransform: "uppercase",
            textShadow: "0 0 30px rgba(255,6,6,0.5), 0 0 60px rgba(255,6,6,0.25)",
          }}
        >
          The Coming of Jesus Christ
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "44px",
            fontSize: 30,
            color: "#ff0606",
            letterSpacing: "6px",
            textShadow: "0 0 20px rgba(255,6,6,0.5)",
          }}
        >
          SUNDAY 30 AUGUST 2026
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "40px",
            fontSize: 24,
            opacity: 0.75,
          }}
        >
          <span style={{ color: "#ffffff" }}>Mey</span>
          <span style={{ color: "#ff0606" }}>GOD</span>
          <span style={{ marginLeft: "16px", fontSize: 20 }}>— meygod.com/festival</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
