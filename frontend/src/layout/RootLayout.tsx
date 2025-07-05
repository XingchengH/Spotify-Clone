import { Outlet } from "react-router-dom";
import MainNavigation from "../components/navigations/MainNavigation";
import LeftSidebar from "../components/navigations/LeftSidebar";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import AudioPlayer from "./components/AudioPlayer";
import PlaybackControls from "./components/PlaybackControls";
import { useEffect, useState } from "react";
import AudioInfo from "./components/AudioInfo";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export default function RootLayout() {
  const [isMobile, setIsMobile] = useState(false);
  const currentSong = useSelector(
    (state: RootState) => state.playerSongs.currentSong
  );

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
            {currentSong && (
              <ResizableBox
                width={125}
                axis="x"
                minConstraints={[125, 0]}
                maxConstraints={[250, 0]}
                resizeHandles={["w"]}
                handle={<CustomHandleW />}
                className="p-2"
                style={{ height: "100%" }}
              >
                <AudioInfo />
              </ResizableBox>
            )}
          </>
        )}
      </div>

      <PlaybackControls />
    </div>
  );
}
