import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Home from '../Pages/Home';
import PlaceDetail from '../Pages/PlaceDetail';
import Search from '../Pages/SearchPage';
import TourDetailsPage from '../Pages/TourDetailsPage';
import About from '../Pages/About';
import Contact from '../Pages/Contact';
import Trips from '../Pages/Trips';
import MainLayout from './MainLayout';
import AdminLayout from '../Pages/Admin/AdminLayout';
import AdminDashboard from '../Pages/Admin/AdminDashboard';
import ManageTours from '../Pages/Admin/ManageTours';
import ManageLocations from '../Pages/Admin/ManageLocations';
import ManageReviews from '../Pages/Admin/ManageReviews';
import ChatPage from '../Pages/ChatPage';
import AdminLoginPage from '../Pages/Admin/AdminLoginPage';
import EarlyBird from '../Pages/EarlyBird';
import ManageBookings from '../Pages/Admin/ManageBookings';
import ManageQueries from '../Pages/Admin/ManageQueries';

const Routing = () => {

  const router = createBrowserRouter([
    {
      element: <MainLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/tour/:slug",
          element: <TourDetailsPage />,
        },
        {
          path: "/search",
          element: <Search />,
        },
        {
          path: "/trips",
          element: <Trips />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },
        {
          path: "/early-bird",
          element: <EarlyBird />,
        },
      ]
    },
    {
      path: "/chat-ai",
      element: <ChatPage />,
    },
    {
      path: "/admin/login",
      element: <AdminLoginPage />,
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <AdminDashboard />,
        },
        {
          path: "tours",
          element: <ManageTours />,
        },
        {
          path: "locations",
          element: <ManageLocations />,
        },
        {
          path: "reviews",
          element: <ManageReviews />,
        },
        {
          path: "analytics-report",
          element: <ManageBookings />,
        },
        {
          path: "user-queries",
          element: <ManageQueries />,
        },
      ]
    },
  ]);



  return (
    <RouterProvider router={router} />
  )
}

export default Routing
