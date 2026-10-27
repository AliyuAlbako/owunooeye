
import { Link } from 'react-router-dom'
import { ArrowRight, Clock3 } from 'lucide-react'

export default function FeaturedStory({ article }) {
  if (!article) return null

  return (
    <article className="grid overflow-hidden rounded-2xl bg-slate-950 md:grid-cols-2">
      <Link
        to={`/article/${article.slug}`}
        className="block min-h-64 overflow-hidden"
        aria-label={`Read ${article.title}`}
      >
        <img
          src={article.cover_image_url|| '/images/news-placeholder.jpg'}
          alt=""
          className="h-full min-h-64 w-full object-cover transition duration-500 hover:scale-105"
        />
      </Link>

      <div className="flex flex-col justify-center p-6 text-white sm:p-9 lg:p-12">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
          {article.category || 'Top Story'}
        </span>

        <h2 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
          <Link
            to={`/article/${article.slug}`}
            className="hover:text-blue-200"
          >
            {article.title}
          </Link>
        </h2>

        <p className="mt-4 leading-7 text-slate-300">
          {article.excerpt}
        </p>

        {/* <div className="mt-5 flex items-center gap-2 text-sm text-slate-300">
          <Clock3 size={16} />
          <span>{article.readTime || 'Article'}</span>
        </div> */}

        <Link
          to={`/article/${article.slug}`}
          className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-blue-100"
        >
          Read full story <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  )
}
