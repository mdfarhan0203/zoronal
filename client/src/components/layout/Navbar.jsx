import { useState } from "react"
import { Link } from "react-router-dom"

const Navbar = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <nav className="border-b bg-white text-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-sm text-white">★</span>
            <span>
              Review&<span className="font-bold">RATE</span>
            </span>
          </Link>

          <div className="relative hidden w-full max-w-sm md:block">
            <input
              placeholder="Search..."
              className="w-full rounded-md border border-border bg-background px-3 py-2 pr-9 text-sm"
            />
            <span className="pointer-events-none absolute right-3 top-2 text-violet-600">⌕</span>
          </div>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="navbar-menu"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-muted/10 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/20 md:hidden"
          >
            <span>{open ? "Close" : "Menu"}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              {open ? (
                <path
                  fillRule="evenodd"
                  d="M6.28 5.22a.75.75 0 011.06 0L12 9.94l4.66-4.72a.75.75 0 111.06 1.06L13.06 11l4.72 4.66a.75.75 0 11-1.06 1.06L12 12.06l-4.66 4.72a.75.75 0 01-1.06-1.06L10.94 11 6.22 6.28a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M4.5 6.75a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H5.25a.75.75 0 01-.75-.75zm.75 5.25a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H5.25z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>

          <div className="hidden gap-2 md:flex">
            <Link
              to="/signup"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/20"
            >
              SignUp
            </Link>

            <Link
              to="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/20"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left Side Drawer */}
      <div
        id="navbar-menu"
        className={`fixed left-0 top-0 z-40 h-screen w-64 transform border-r border-border bg-background transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col gap-4 p-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ml-auto inline-flex items-center gap-2 rounded-md border border-border bg-muted/10 px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path
                fillRule="evenodd"
                d="M6.28 5.22a.75.75 0 011.06 0L12 9.94l4.66-4.72a.75.75 0 111.06 1.06L13.06 11l4.72 4.66a.75.75 0 11-1.06 1.06L12 12.06l-4.66 4.72a.75.75 0 01-1.06-1.06L10.94 11 6.22 6.28a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/20"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            {/* <Link
              to="/dashboard"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/20"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link> */}
            <Link
              to="/signup"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/20"
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/20"
              onClick={() => setOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar