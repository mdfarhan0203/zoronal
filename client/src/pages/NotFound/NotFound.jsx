import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404</h1>

      <p>Page not found</p>

      <Link to="/" className="text-blue-500">
        Go Home
      </Link>
    </div>
  )
}

export default NotFound