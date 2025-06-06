import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import ImageDetailsPage from "./pages/ImageDetailsPage";
import HomePage from "./pages/HomePage";

export const router = createBrowserRouter([
   {
    path: "/",
    element: <Navigate to="/images" replace />,
  },
  {
    path: "/images",
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: ":imageId",
        element: <ImageDetailsPage />,
      },
    ],
  },
]);
