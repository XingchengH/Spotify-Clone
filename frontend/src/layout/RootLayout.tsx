import { Outlet } from "react-router-dom";
import MainNavigation from "../components/navigations/MainNavigation";
import LeftSidebar from "../components/navigations/LeftSidebar";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import AudioPlayer from "./components/AudioPlayer";
import PlaybackControls from "./components/PlaybackControls";
import { useEffect, useState } from "react";

export default function RootLayout() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const CustomHandleE = ({ ...restProps }) => (
    <div className="custom-handle custom-handle-e" {...restProps} />
  );
  const CustomHandleW = ({ ...restProps }) => (
    <div className="custom-handle custom-handle-w" {...restProps} />
  );

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{ background: "#000" }}
    >
      {/* Top Nav */}
      <header className="sticky-top bg-dark text-white">
        <MainNavigation />
      </header>

      <AudioPlayer />

      {/* Left side */}
      <div className="flex-grow-1 d-flex" style={{ minHeight: 0 }}>
        <ResizableBox
          width={100}
          axis="x"
          minConstraints={[125, 0]}
          maxConstraints={[400, 0]}
          resizeHandles={["e"]}
          handle={<CustomHandleE />}
          className="p-2"
          style={{ height: "100%" }} // ensure fills height
        >
          <LeftSidebar />
        </ResizableBox>

        <div
          className="flex-grow-1 p-2"
          style={{
            overflowY: "auto",
            minHeight: "100%",
          }}
        >
          <Outlet />
        </div>

        {!isMobile && (
          <>
            <ResizableBox
              width={100}
              axis="x"
              minConstraints={[100, 0]}
              maxConstraints={[400, 0]}
              resizeHandles={["w"]}
              handle={<CustomHandleW />}
              className="p-2"
              style={{ height: "100%" }} // ensure fills height
            >
              <div
                className="h-100 bg-dark text-white"
                style={{ minHeight: "100%" }}
              ></div>
            </ResizableBox>
          </>
        )}
      </div>

      <PlaybackControls />
    </div>
  );
}
