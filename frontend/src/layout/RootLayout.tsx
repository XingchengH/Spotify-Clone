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
  const { currentSong } = useSelector((state: RootState) => state.playerSongs);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 834);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const CustomHandleE = ({ handleAxis: _a, ...rest }: { handleAxis?: string; [k: string]: unknown }) => (
    <div className="custom-handle custom-handle-e" {...rest} />
  );
  const CustomHandleW = ({ handleAxis: _a, ...rest }: { handleAxis?: string; [k: string]: unknown }) => (
    <div className="custom-handle custom-handle-w" {...rest} />
  );

  return (
    <div className="sp-root">
      <header>
        <MainNavigation />
      </header>

      <AudioPlayer />

      <div className="sp-body-area">
        {token && !isMobile && (
          <ResizableBox
            width={220}
            axis="x"
            minConstraints={[160, 0]}
            maxConstraints={[340, 0]}
            resizeHandles={["e"]}
            handle={<CustomHandleE />}
            style={{ height: "100%", flexShrink: 0 }}
          >
            <LeftSidebar />
          </ResizableBox>
        )}

        <main className="sp-main-content">
          <Outlet />
        </main>

        {!isMobile && currentSong && (
          <ResizableBox
            width={200}
            axis="x"
            minConstraints={[160, 0]}
            maxConstraints={[280, 0]}
            resizeHandles={["w"]}
            handle={<CustomHandleW />}
            style={{ height: "100%", flexShrink: 0 }}
          >
            <AudioInfo />
          </ResizableBox>
        )}
      </div>

      <PlaybackControls />
    </div>
  );
}
