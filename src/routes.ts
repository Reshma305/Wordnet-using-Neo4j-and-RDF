import { createBrowserRouter } from "react-router";
import Root from "./Root";
import Home from "./pages/Home";
import WordAnalytics from "./pages/WordAnalytics";
import Texts from "./pages/Texts";
import WordMap from "./pages/WordMap";
import Eras from "./pages/Eras";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "word/:word", Component: WordAnalytics },
      { path: "texts", Component: Texts },
      { path: "map", Component: WordMap },
      { path: "eras", Component: Eras },
    ],
  },
]);
