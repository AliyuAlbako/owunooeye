
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Newspaper } from 'lucide-react'
import { supabase } from '../lib/supabase'
import NewsCard from '../components/news/NewsCard'
import FeaturedStory from '../components/news/FeaturedStory'

export default function Home() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadArticles() {
      const { data, error } = await supabase
        .from('articles')
        .select(
          'id, title, slug, excerpt, category, cover_image_url, author_name, published_at, created_at'
        )
        .eq('status', 'published')
        .order('published_at', { ascending: false })

      if (!active) return

      if (error) {
        setError('We could not load the latest stories. Please try again later.')
      } else {
        setArticles(data || [])
      }

      setLoading(false)
    }

    loadArticles()

    return () => {
      active = false
    }
  }, [])

  const featured = articles[0]
  const latest = articles.slice(featured ? 1 : 0)

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-slate-950 px-4 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-300">
            The Eye of the People
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Stories that inform.
            <span className="block text-blue-300">Voices that matter.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Explore news, ideas, and perspectives on the issues shaping our
            communities and our world.
          </p>

          <Link
            to="/category/News"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-500"
          >
            Explore the stories <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
        {loading ? (
          <p className="py-12 text-center text-slate-500">
            Loading the latest stories...
          </p>
        ) : error ? (
          <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </p>
        ) : articles.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
            <Newspaper className="mx-auto text-slate-400" size={36} />
            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Our newsroom is getting ready
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-slate-600">
              No stories have been published yet. Please check back soon.
            </p>
          </div>
        ) : (
          <>
            {featured && (
              <section>
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Top story
                  </h2>
                </div>
                <FeaturedStory article={featured} />
              </section>
            )}

            {latest.length > 0 && (
              <section className="mt-14">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Latest stories
                  </h2>
                  <Link
                    to="/search"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900"
                  >
                    Find a story <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {latest.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  )
}
