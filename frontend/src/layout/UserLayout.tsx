import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  );
}
