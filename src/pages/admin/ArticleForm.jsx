
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import LinkExtension from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { ArrowLeft, Bold, Italic, List, ListOrdered, Link as LinkIcon } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const emptyContent = {
  type: 'doc',
  content: [{ type: 'paragraph' }],
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function ArticleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('News')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [status, setStatus] = useState('draft')
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
        protocols: ['http', 'https', 'mailto'],
      }),
      Image,
    ],
    content: emptyContent,
    editorProps: {
      attributes: {
        class: 'min-h-72 p-4 outline-none prose max-w-none',
      },
    },
  })

  useEffect(() => {
    if (!id || !editor) return

    async function loadArticle() {
      setLoading(true)
      setError('')

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        setError(error.message)
      } else {
        setTitle(data.title)
        setSlug(data.slug)
        setSlugEdited(true)
        setExcerpt(data.excerpt || '')
        setCategory(data.category)
        setCoverImageUrl(data.cover_image_url || '')
        setStatus(data.status)
        editor.commands.setContent(data.content || emptyContent)
      }

      setLoading(false)
    }

    loadArticle()
  }, [id, editor])

  function updateTitle(value) {
    setTitle(value)
    if (!slugEdited) setSlug(slugify(value))
  }

  function addLink() {
    const url = window.prompt('Enter the link URL (include https://):')
    if (!url || !editor) return

    try {
      const parsed = new URL(url)
      if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
        throw new Error('Unsupported link protocol')
      }

      editor.chain().focus().extendMarkRange('link')
        .setLink({ href: url }).run()
    } catch {
      setError('Enter a valid link URL.')
    }
  }

  function addImage() {
    const url = window.prompt('Enter an image URL:')
    if (!url || !editor) return

    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Enter a valid HTTP or HTTPS image URL.')
      }

      editor.chain().focus().setImage({ src: url }).run()
    } catch {
      setError('Enter a valid HTTP or HTTPS image URL.')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!editor) return

    setSaving(true)
    setError('')

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setError('Your session has expired. Please sign in again.')
      setSaving(false)
      return
    }

    const cleanTitle = title.trim()
    const cleanSlug = slugify(slug)

    if (!cleanTitle || !cleanSlug || !category.trim()) {
      setError('Please provide a title, URL slug, and category.')
      setSaving(false)
      return
    }

    const payload = {
      title: cleanTitle,
      slug: cleanSlug,
      excerpt: excerpt.trim(),
      content: editor.getJSON(),
      cover_image_url: coverImageUrl.trim() || null,
      category: category.trim(),
      status,
      published_at:
        status === 'published'
          ? new Date().toISOString()
          : null,
    }

    let result

    if (isEditing) {
      result = await supabase
        .from('articles')
        .update(payload)
        .eq('id', id)
        .select('id')
        .single()
    } else {
      result = await supabase
        .from('articles')
        .insert({
          ...payload,
          created_by: user.id,
        })
        .select('id')
        .single()
    }

    setSaving(false)

    if (result.error) {
      setError(
        result.error.code === '23505'
          ? 'This URL slug is already in use. Choose another one.'
          : result.error.message
      )
      return
    }

    navigate('/admin/articles')
  }

  if (loading) {
    return <p className="p-10 text-center">Loading article...</p>
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/admin/articles"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-700"
        >
          <ArrowLeft size={16} /> Back to articles
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          {isEditing ? 'Edit article' : 'Write an article'}
        </h1>
        <p className="mt-2 text-slate-600">
          Create a story for The Eye of the People.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <section className="space-y-5 rounded-xl border border-slate-200 bg-white p-6">
            <div>
              <label htmlFor="title" className="mb-2 block font-medium">
                Article title *
              </label>
              <input
                id="title"
                required
                value={title}
                onChange={(event) => updateTitle(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                placeholder="Write a clear, engaging headline"
              />
            </div>

            <div>
              <label htmlFor="slug" className="mb-2 block font-medium">
                URL slug *
              </label>
              <input
                id="slug"
                required
                value={slug}
                onChange={(event) => {
                  setSlug(event.target.value)
                  setSlugEdited(true)
                }}
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                placeholder="article-url-slug"
              />
              <p className="mt-1 text-xs text-slate-500">
                Used in the article URL. Use lowercase letters, numbers, and hyphens.
              </p>
            </div>

            <div>
              <label htmlFor="excerpt" className="mb-2 block font-medium">
                Short summary
              </label>
              <textarea
                id="excerpt"
                rows={3}
                value={excerpt}
                onChange={(event) => setExcerpt(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                placeholder="Summarize the story in a few sentences"
              />
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block font-medium">
                Category *
              </label>
              <select
                id="category"
                required
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
              >
                <option>News</option>
                <option>Politics</option>
                <option>Education</option>
                <option>Technology</option>
                <option>Business</option>
                <option>Health</option>
                <option>Media</option>
                <option>Society</option>
                <option>Opinion</option>
              </select>
            </div>

            <div>
              <label htmlFor="cover" className="mb-2 block font-medium">
                Cover image URL
              </label>
              <input
                id="cover"
                type="url"
                value={coverImageUrl}
                onChange={(event) => setCoverImageUrl(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3"
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-1 text-xs text-slate-500">
                For this first version, use a publicly accessible image URL. We'll add image uploads next.
              </p>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-3">
              <p className="mb-3 font-medium">Article body *</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className="rounded border p-2 hover:bg-slate-100"
                  aria-label="Bold"
                >
                  <Bold size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className="rounded border p-2 hover:bg-slate-100"
                  aria-label="Italic"
                >
                  <Italic size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className="rounded border p-2 hover:bg-slate-100"
                  aria-label="Bullet list"
                >
                  <List size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className="rounded border p-2 hover:bg-slate-100"
                  aria-label="Numbered list"
                >
                  <ListOrdered size={18} />
                </button>
                <button
                  type="button"
                  onClick={addLink}
                  className="flex items-center gap-1 rounded border px-2 hover:bg-slate-100"
                >
                  <LinkIcon size={18} /> Link
                </button>
                <button
                  type="button"
                  onClick={addImage}
                  className="rounded border px-3 py-2 text-sm hover:bg-slate-100"
                >
                  Insert image URL
                </button>
              </div>
            </div>

            <EditorContent editor={editor} />
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <label htmlFor="status" className="mb-2 block font-medium">
              Publication status
            </label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
            >
              <option value="draft">Save as draft</option>
              <option value="published">Publish article</option>
            </select>
          </section>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving || !editor}
              className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {saving
                ? 'Saving...'
                : status === 'published'
                  ? 'Publish article'
                  : 'Save draft'}
            </button>

            <Link
              to="/admin/articles"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
