
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Pencil, Trash2, RefreshCw } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadArticles() {
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setArticles(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadArticles()
  }, [])

  async function deleteArticle(article) {
    const confirmed = window.confirm(
      `Delete "${article.title}"? This cannot be undone.`
    )

    if (!confirmed) return

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', article.id)

    if (error) {
      setError(error.message)
      return
    }

    setArticles((current) =>
      current.filter((item) => item.id !== article.id)
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} /> Dashboard
        </Link>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manage articles
            </h1>
            <p className="mt-2 text-slate-600">
              Review drafts and published stories.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadArticles}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2"
            >
              <RefreshCw size={16} /> Refresh
            </button>

            <Link
              to="/admin/articles/new"
              className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800"
            >
              <Plus size={18} /> New article
            </Link>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          {loading ? (
            <p className="p-8 text-center text-slate-500">Loading articles...</p>
          ) : articles.length === 0 ? (
            <div className="p-12 text-center">
              <h2 className="font-semibold text-slate-800">No articles yet</h2>
              <p className="mt-2 text-sm text-slate-500">
                Your articles will appear here after you create them.
              </p>
            </div>
          ) : (
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-100 text-slate-600">
                <tr>
                  <th className="px-5 py-4 font-semibold">Title</th>
                  <th className="px-5 py-4 font-semibold">Category</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Date created</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {article.title}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {article.category}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={
                          article.status === 'published'
                            ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700'
                            : 'rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700'
                        }
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {new Date(article.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-3">
                        <Link
                          to={`/admin/articles/${article.id}/edit`}
                          aria-label={`Edit ${article.title}`}
                          className="text-blue-700 hover:text-blue-900"
                        >
                          <Pencil size={18} />
                        </Link>
                        <button
                          onClick={() => deleteArticle(article)}
                          aria-label={`Delete ${article.title}`}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  )
}
