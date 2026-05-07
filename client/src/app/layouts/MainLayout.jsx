
import { Outlet } from "react-router-dom"
import Navbar from "@/components/layout/Navbar.jsx"

const MainLayout = () => {
  return (
    <div>
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout