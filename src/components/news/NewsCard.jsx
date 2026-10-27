
import { Link } from 'react-router-dom'
import { CalendarDays, ArrowUpRight } from 'lucide-react'

export default function NewsCard({ article }) {
  const {
    slug,
    title,
    excerpt,
    category,
    image,
    publishedAt,
    readTime,
  } = article

  return (
    <article className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link
        to={`/article/${slug}`}
        aria-label={`Read ${title}`}
        className="block overflow-hidden"
      >
        <img
          src={article.cover_image_url|| '/images/news-placeholder.jpg'}
          alt=""
          loading="lazy"
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="p-5">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-800">
          {category}
        </span>

        <h2 className="mt-3 text-xl font-bold leading-snug text-slate-900 transition group-hover:text-blue-800">
          <Link to={`/article/${slug}`}>{title}</Link>
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {excerpt}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            {publishedAt}
          </span>

                 </div>

        <Link
          to={`/article/${slug}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-800 hover:text-blue-950"
        >
          Read story <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  )
}
