import { Outlet } from "react-router-dom";
import MainNavigation from "../components/navigations/MainNavigation";
import LeftSidebar from "../components/navigations/LeftSidebar";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

export default function RootLayout() {
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
      <header className="sticky-top bg-dark text-white">
        <MainNavigation />
      </header>

      <div className="flex-grow-1 d-flex" style={{ minHeight: 0 }}>
        <ResizableBox
          width={300}
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

        <ResizableBox
          width={200}
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
      </div>
    </div>
  );
}
