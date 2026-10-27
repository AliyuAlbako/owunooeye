
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-950">
              <Eye size={23} />
            </div>

            <div>
              <p className="text-xl font-black text-white">
                OwunoEye
              </p>
              <p className="text-xs text-slate-400">
                The Eye of the People
              </p>
            </div>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-7">
            Informing the public through news, ideas and perspectives
            that matter.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-white">Explore</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/" className="hover:text-white">Home</Link>
            <Link to="/search" className="hover:text-white">Latest News</Link>
            <Link to="/about" className="hover:text-white">About Us</Link>
            <Link to="/contact" className="hover:text-white">Contact</Link>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-white">Our commitment</h2>
          <p className="mt-4 text-sm leading-7">
            We aim to promote responsible reporting, accuracy,
            transparency and informed public conversation.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} OwunoEye. All rights reserved.
          </p>
          <p>The Eye of the People.</p>
        </div>
      </div>
    </footer>
  )
}
