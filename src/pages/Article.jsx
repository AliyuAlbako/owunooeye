
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CalendarDays, ArrowLeft } from 'lucide-react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { supabase } from '../lib/supabase'

function ArticleBody({ content }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: true,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image,
    ],
    content: content || { type: 'doc', content: [] },
    editable: false,
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content)
    }
  }, [editor, content])

  if (!editor) {
    return <p className="text-slate-500">Loading article content...</p>
  }

  return <EditorContent editor={editor} />
}

export default function Article() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true

    async function loadArticle() {
      setLoading(true)
      setError(false)
      setArticle(null)

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle()

      if (!active) return

      if (error) {
        setError(true)
      } else {
        setArticle(data)
      }

      setLoading(false)
    }

    loadArticle()

    return () => {
      active = false
    }
  }, [slug])

  if (loading) {
    return (
      <div className="px-5 py-20 text-center text-slate-600">
        Loading article...
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <h1 className="text-3xl font-black">Article not found</h1>
        <p className="mt-3 text-slate-600">
          This story may have been moved, is unpublished, or could not
          be loaded.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-800"
        >
          <ArrowLeft size={18} /> Back to homepage
        </Link>
      </div>
    )
  }

  const publicationDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null

  return (
    <article className="mx-auto max-w-4xl px-5 py-10 sm:py-16">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800"
      >
        <ArrowLeft size={17} /> Back to home
      </Link>

      <p className="mt-8 text-sm font-bold uppercase tracking-widest text-blue-800">
        {article.category}
      </p>

      <h1 className="mt-3 text-3xl font-black leading-tight sm:text-5xl">
        {article.title}
      </h1>

      {article.excerpt && (
        <p className="mt-5 text-lg leading-8 text-slate-600">
          {article.excerpt}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-500">
        {publicationDate && (
          <span className="flex items-center gap-2">
            <CalendarDays size={16} />
            {publicationDate}
          </span>
        )}

        <span>By {article.author_name || 'OwunoEye'}</span>
      </div>

      {article.cover_image_url && (
        <img
          src={article.cover_image_url}
          alt={article.title}
          className="mt-8 max-h-[480px] w-full rounded-2xl object-cover"
        />
      )}

      <div className="tiptap-content mt-10 max-w-none">
        <ArticleBody content={article.content} />
      </div>
    </article>
  )
}
