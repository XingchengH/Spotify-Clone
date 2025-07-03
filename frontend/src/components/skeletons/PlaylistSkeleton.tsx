export default function PlaylistSkeleton() {
  return (
    <div className="p-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="d-flex align-items-center gap-3 mb-3">
          <span
            className="placeholder"
            style={{
              width: 60,
              height: 60,
              borderRadius: 4,
              flexShrink: 0,
            }}
          ></span>

          <div className="flex-grow-1 placeholder-glow">
            <span
              className="placeholder col-8"
              style={{ height: 16, display: "block", borderRadius: 4 }}
            ></span>
            <span
              className="placeholder col-6 mt-2"
              style={{ height: 12, display: "block", borderRadius: 4 }}
            ></span>
          </div>
        </div>
      ))}
    </div>
  );
}
