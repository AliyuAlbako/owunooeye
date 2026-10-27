
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, LockKeyhole, Mail } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signedIn, setSignedIn] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // The dashboard route will be protected separately.
    setSignedIn(Boolean(data.session))
    if (data.session) navigate('/admin/dashboard', { replace: true })
  }

  if (signedIn) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return (
    <main className="min-h-[75vh] bg-slate-50 px-4 py-16">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <Link to="/" className="mb-8 flex items-center gap-2 text-2xl font-bold text-slate-950">
          <Eye className="text-blue-700" />
          Owuno<span className="text-blue-700">Eye</span>
        </Link>

        <h1 className="text-2xl font-bold text-slate-900">Editor sign in</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sign in to manage OwunoEye articles.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email address
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-3">
              <Mail size={18} className="text-slate-400" />
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full py-3 outline-none"
                placeholder="editor@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="flex items-center gap-3 rounded-lg border border-slate-300 px-3">
              <LockKeyhole size={18} className="text-slate-400" />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full py-3 outline-none"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-xs text-slate-500">
          Authorized OwunoEye editors only.
        </p>
      </div>
    </main>
  )
}
