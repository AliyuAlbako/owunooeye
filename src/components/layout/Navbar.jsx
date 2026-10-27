
import { Link, NavLink } from 'react-router-dom'
import { Eye, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Latest News', path: '/search' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `transition hover:text-blue-700 ${
      isActive ? 'font-bold text-blue-800' : 'text-slate-700'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950 text-white">
            <Eye size={25} />
          </div>

          <div>
            <h1 className="text-xl font-black tracking-tight sm:text-2xl">
              Owuno<span className="text-blue-700">Eye</span>
            </h1>
            <p className="text-xs text-slate-500">
              The Eye of the People
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={linkClass}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/search"
            aria-label="Search articles"
            className="rounded-lg p-2.5 text-slate-700 transition hover:bg-slate-100"
          >
            <Search size={20} />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="rounded-lg p-2.5 text-slate-700 hover:bg-slate-100 lg:hidden"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col border-t border-slate-200 px-5 py-3 lg:hidden">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-3 text-sm ${
                  isActive
                    ? 'bg-blue-50 font-bold text-blue-800'
                    : 'text-slate-700 hover:bg-slate-50'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
