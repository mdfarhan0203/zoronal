import { createBrowserRouter } from "react-router-dom"
import { lazy, Suspense } from "react"

import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"
import ProtectedRoute from "../routes/ProtectedRoute.jsx"
const Home = lazy(() => import("../pages/Home/Home.jsx"))
const Login = lazy(() => import("../pages/Login/Login.jsx"))
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard.jsx"))
const Signup = lazy(() => import("../pages/Signup/Signup.jsx"))
const AddCompany = lazy(() => import("../pages/AddCompany/AddCompany.jsx"))
const CompanyDetails = lazy(() => import("../pages/CompanyDetails/CompanyDetails.jsx"))
const NotFound = lazy(() => import("../pages/NotFound/NotFound.jsx"))

const Loader = () => <div>Loading...</div>

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "addCompany",
        element: (
          <Suspense fallback={<Loader />}>
            <AddCompany />
          </Suspense>
        ),
      },
      {
        path: "company/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <CompanyDetails />
          </Suspense>
        ),
      },
    ],
  },

  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        ),
      },
    ],
  },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<Loader />}>
          <Dashboard />
        </Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: "/signup",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Signup />
          </Suspense>
        ),
      },
    ],
  },

  {
    path: "*",
    element: (
      <Suspense fallback={<Loader />}>
        <NotFound />
      </Suspense>
    ),
  },
])

export default router