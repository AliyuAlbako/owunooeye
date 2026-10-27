
import { useEffect, useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import NewsCard from '../components/news/NewsCard'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    const timer = setTimeout(async () => {
      setLoading(true)
      setError(false)

      const term = query.trim()

      if (!term) {
        const { data, error } = await supabase
          .from('articles')
          .select(
            'id, title, slug, excerpt, category, cover_image_url, author_name, published_at, created_at'
          )
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(30)

        if (!active) return

        if (error) {
          setError(true)
          setResults([])
        } else {
          setResults(data || [])
        }

        setLoading(false)
        return
      }

      const pattern = `%${term}%`

      const [titleResult, excerptResult, categoryResult] =
        await Promise.all([
          supabase
            .from('articles')
            .select(
              'id, title, slug, excerpt, category, cover_image_url, author_name, published_at, created_at'
            )
            .eq('status', 'published')
            .ilike('title', pattern)
            .limit(50),

          supabase
            .from('articles')
            .select(
              'id, title, slug, excerpt, category, cover_image_url, author_name, published_at, created_at'
            )
            .eq('status', 'published')
            .ilike('excerpt', pattern)
            .limit(50),

          supabase
            .from('articles')
            .select(
              'id, title, slug, excerpt, category, cover_image_url, author_name, published_at, created_at'
            )
            .eq('status', 'published')
            .ilike('category', pattern)
            .limit(50),
        ])

      if (!active) return

      if (titleResult.error || excerptResult.error || categoryResult.error) {
        setError(true)
        setResults([])
      } else {
        const uniqueArticles = new Map()

        for (const article of [
          ...(titleResult.data || []),
          ...(excerptResult.data || []),
          ...(categoryResult.data || []),
        ]) {
          uniqueArticles.set(article.id, article)
        }

        setResults(
          [...uniqueArticles.values()].sort(
            (a, b) =>
              new Date(b.published_at || b.created_at) -
              new Date(a.published_at || a.created_at)
          )
        )
      }

      setLoading(false)
    }, 300)

    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [query])

  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <h1 className="text-4xl font-black">Explore stories</h1>

      <p className="mt-3 text-slate-600">
        Search OwunoEye news and articles.
      </p>

      <div className="mt-7 flex max-w-2xl items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 focus-within:border-blue-800">
        <SearchIcon size={20} className="text-slate-400" />

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by headline, topic or keyword..."
          aria-label="Search articles"
          className="w-full bg-transparent outline-none"
        />
      </div>

      <p className="mt-6 text-sm text-slate-500" aria-live="polite">
        {loading
          ? 'Searching stories...'
          : `${results.length} ${results.length === 1 ? 'story' : 'stories'} found`}
      </p>

      {error ? (
        <p className="mt-6 rounded-xl bg-red-50 p-6 text-red-700" role="alert">
          We couldn't search articles. Please try again later.
        </p>
      ) : loading ? (
        <p className="mt-6 text-slate-500">Loading stories...</p>
      ) : results.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-slate-50 p-6 text-slate-600">
          {query.trim()
            ? 'No published stories match your search.'
            : 'No published stories are available yet.'}
        </p>
      )}
    </section>
  )
}
