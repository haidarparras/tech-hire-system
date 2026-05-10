export default function LoadingSpinner() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
      }}>
      {/* Spinner Container */}
      <div
        style={{
          position: "relative",
          width: 60,
          height: 60,
          marginBottom: 24,
        }}>
        {/* Outer Ring */}
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            animation: "spin 1s linear infinite",
          }}>
          <circle
            cx="30"
            cy="30"
            r="25"
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            strokeDasharray="40 80"
            opacity="0.8"
          />
        </svg>

        {/* Center Dot */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#22c55e",
          }}
        />
      </div>

      {/* Loading Text */}
      <div
        style={{
          color: "#22c55e",
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: "0.05em",
          textAlign: "center",
        }}>
        Memuat kandidat...
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
