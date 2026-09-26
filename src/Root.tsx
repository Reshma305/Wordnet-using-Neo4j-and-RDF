import { Outlet } from "react-router";
import Nav from "./components/Nav";

export default function Root() {
  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <Nav />
      <Outlet />
    </div>
  );
}
