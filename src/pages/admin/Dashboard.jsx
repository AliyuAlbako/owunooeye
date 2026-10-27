import { Link } from 'react-router-dom'
import { FileText, PlusCircle, LogOut } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-blue-700">OwunoEye</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Editor dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Manage your news and articles.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100"
          >
            <LogOut size={18} /> Sign out
          </button>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          <Link
            to="/admin/articles"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-300"
          >
            <FileText className="text-blue-700" size={28} />
            <h2 className="mt-4 text-xl font-semibold">Manage articles</h2>
            <p className="mt-2 text-sm text-slate-600">
              View drafts and published stories.
            </p>
          </Link>

          <Link
            to="/admin/articles/new"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-300"
          >
            <PlusCircle className="text-blue-700" size={28} />
            <h2 className="mt-4 text-xl font-semibold">Write an article</h2>
            <p className="mt-2 text-sm text-slate-600">
              Create a new story for OwunoEye.
            </p>
          </Link>
        </div>
      </div>
    </main>
  )
}