
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import NewsCard from '../components/news/NewsCard'

export default function Category() {
  const { name } = useParams()
  const categoryName = decodeURIComponent(name || '')

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    async function loadArticles() {
      setLoading(true)
      setError(false)

      const { data, error } = await supabase
        .from('articles')
        .select(
          'id, title, slug, excerpt, category, cover_image_url, author_name, published_at, created_at'
        )
        .ilike('category', categoryName)
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (!active) return

      if (error) {
        setError(true)
        setArticles([])
      } else {
        setArticles(data || [])
      }

      setLoading(false)
    }

    loadArticles()

    return () => {
      active = false
    }
  }, [categoryName])

  return (
    <section className="mx-auto max-w-7xl px-5 py-12">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-800">
        Browse topics
      </p>

      <h1 className="mt-2 text-4xl font-black capitalize">
        {categoryName}
      </h1>

      <p className="mt-3 text-slate-600">
        Explore stories published under this topic.
      </p>

      {loading ? (
        <p className="mt-8 text-slate-500" role="status">
          Loading stories...
        </p>
      ) : error ? (
        <p className="mt-8 rounded-xl bg-red-50 p-6 text-red-700" role="alert">
          We couldn't load stories for this category. Please try again later.
        </p>
      ) : articles.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-xl bg-slate-50 p-6 text-slate-600">
          No published stories in this category yet.
        </p>
      )}

      <Link
        to="/"
        className="mt-8 inline-block font-semibold text-blue-800"
      >
        ← Back to homepage
      </Link>
    </section>
  )
}
