import { Spinner } from "react-bootstrap";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  centered?: boolean;
  fullscreen?: boolean;
  text?: string;
};

const LoadingSpinner = ({
  size = "md",
  centered = true,
  fullscreen = false,
  text,
}: LoadingSpinnerProps) => {
  const spinnerSize = size === "sm" ? "sm" : undefined;

  const containerStyles: React.CSSProperties = fullscreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 9999,
      }
    : centered
    ? { minHeight: "200px" }
    : {};

  return (
    <div
      className={`d-flex ${
        centered ? "justify-content-center align-items-center" : ""
      }`}
      style={containerStyles}
    >
      <div className="text-center">
        <Spinner animation="border" variant="primary" size={spinnerSize} />
        {text && <div className="mt-2">{text}</div>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
