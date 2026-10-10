import { useState } from 'react'
import {
  createQuote,
  updateQuote,
} from '../api/quotes'
import TagInput from './TagInput'

function getInitialForm(editingQuote) {
  return {
    text: editingQuote?.text || '',
    author: editingQuote?.author || '',
    authorBackground: editingQuote?.authorBackground || '',
    fontColor: editingQuote?.fontColor || '#292722',
    book: editingQuote?.book || '',
    bookNumber: editingQuote?.bookNumber || '',
    part: editingQuote?.part || '',
    section: editingQuote?.section || '',
    chapter: editingQuote?.chapter || '',
    page: editingQuote?.page || '',
    tags: editingQuote?.tags || [],
  }
}

function QuoteForm({
  editingQuote,
  onQuoteCreated,
  onQuoteUpdated,
  onCancelEdit,
  suggestedTags,
}) {
    const [form, setForm] = useState(() =>
      getInitialForm(editingQuote)
    )

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [wikiLoading, setWikiLoading] = useState(false)
    const [previewError, setPreviewError] = useState(false)

    async function fetchWikipediaImage(author) {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          author.replaceAll(' ', '_')
        )}`
      )

      if (response.ok) {
        const page = await response.json()
        const imageUrl =
          page.originalimage?.source || page.thumbnail?.source

        if (imageUrl) {
          return imageUrl
        }
      }

      const params = new URLSearchParams({
        action: 'query',
        format: 'json',
        generator: 'search',
        gsrnamespace: '0',
        gsrsearch: author,
        gsrlimit: '5',
        prop: 'pageimages',
        piprop: 'thumbnail|original',
        pithumbsize: '1200',
        origin: '*',
      })
      const searchResponse = await fetch(
        `https://en.wikipedia.org/w/api.php?${params}`
      )

      if (!searchResponse.ok) {
        throw new Error('Wikipedia could not be reached.')
      }

      const data = await searchResponse.json()
      const pages = Object.values(data.query?.pages || {})
      const imagePage = pages.find(
        (page) => page.original?.source || page.thumbnail?.source
      )

      return imagePage?.original?.source || imagePage?.thumbnail?.source
    }

    async function handleWikipediaImage() {
      const author = form.author.trim()

      if (!author) {
        setError('Enter an author before looking up a Wikipedia image.')
        return
      }

      setWikiLoading(true)
      setError(null)

      try {
        const imageUrl = await fetchWikipediaImage(author)

        if (!imageUrl) {
          throw new Error('No Wikipedia image was found for this author.')
        }

        setForm((current) => ({
          ...current,
          authorBackground: imageUrl,
        }))
        setPreviewError(false)
      } catch (error) {
        setError(
          error instanceof TypeError
            ? 'Wikipedia could not be reached. Paste an image URL or choose a local image instead.'
            : error.message
        )
      } finally {
        setWikiLoading(false)
      }
    }

    function handleBackgroundFile(event) {
      const file = event.target.files?.[0]

      if (!file) {
        return
      }

      if (!file.type.startsWith('image/')) {
        setError('Choose an image file for the author background.')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('Choose an image smaller than 5 MB.')
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        setForm((current) => ({
          ...current,
          authorBackground: reader.result,
        }))
        setPreviewError(false)
        setError(null)
      }
      reader.onerror = () => {
        setError('The selected image could not be read.')
      }
      reader.readAsDataURL(file)
    }

    function handleChange(event) {
        const { name, value } = event.target

        setForm((current) => ({
            ...current,
            [name]: value,
        }))
    }

    async function handleSubmit(event) {
        event.preventDefault()

        setSaving(true)
        setError(null)

        const quoteData = {
            text: form.text,
            author: form.author,
            authorBackground: form.authorBackground,
            fontColor: form.fontColor,
            book: form.book,
            bookNumber: form.bookNumber,
            part: form.part,
            section: form.section,
            chapter: form.chapter,
            page: form.page ? Number(form.page) : undefined,
            tags: form.tags,
        }

        try {
            let savedQuote

            if (editingQuote) {
                // Update an existing quote.
                savedQuote = await updateQuote(
                editingQuote._id,
                quoteData
                )
            } else {
                // Create a new quote.
                savedQuote = await createQuote(quoteData)
            }

            if (editingQuote) {
                onQuoteUpdated(savedQuote)
            } else {
                onQuoteCreated(savedQuote)
            }

                setForm({
                text: '',
                author: '',
                authorBackground: '',
                fontColor: '#292722',
                book: '',
                bookNumber: '',
                part: '',
                section: '',
                chapter: '',
                page: '',
                tags: [],
            })
        } catch (error) {
            setError(error.message)
        } finally {
            setSaving(false)
        }
    }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-12 rounded-xl bg-white p-6 shadow-sm"
    >
        <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold">
                {editingQuote ? 'Edit Quote' : 'Add a Quote'}
            </h2>

            <button
                type="button"
                onClick={onCancelEdit}
                className="text-2xl text-stone-400 hover:text-stone-900"
                aria-label="Close"
            >
                ×
            </button>
        </div>

      <div className="space-y-4">
        <textarea
          name="text"
          value={form.text}
          onChange={handleChange}
          placeholder="Quote"
          required
          rows="4"
          className="w-full rounded-lg border border-stone-300 p-3"
        />

        <input
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="Author"
            required
            className="w-full rounded-lg border border-stone-300 p-3"
        />

        <input
            name="authorBackground"
            type="url"
            value={form.authorBackground}
            onChange={(event) => {
              handleChange(event)
              setPreviewError(false)
            }}
            placeholder="Author image URL (optional)"
            className="w-full rounded-lg border border-stone-300 p-3"
        />

        <div className="rounded-lg border border-[#d8c9a8] bg-[#fffaf0] p-4">
          <p className="text-sm font-medium text-[#292722]">
            Author image
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleWikipediaImage}
              disabled={wikiLoading}
              className="rounded-lg bg-[#b8871e] px-4 py-2 text-sm text-white hover:bg-[#946c13] disabled:opacity-50"
            >
              {wikiLoading ? 'Looking up...' : 'Use Wikipedia image'}
            </button>
            <label className="cursor-pointer rounded-lg border border-[#292722] px-4 py-2 text-sm text-[#292722] hover:bg-[#f1e5c9]">
              Choose an image
              <input
                type="file"
                accept="image/*"
                onChange={handleBackgroundFile}
                className="sr-only"
              />
            </label>
          </div>
          {form.authorBackground && !previewError && (
            <img
              src={form.authorBackground}
              alt={`${form.author || 'Author'} preview`}
              onError={() => setPreviewError(true)}
              className="mt-4 h-20 w-20 rounded-lg object-cover"
            />
          )}
          {form.authorBackground && previewError && (
            <p className="mt-3 text-sm text-red-700">
              This image could not be previewed. Try another source.
            </p>
          )}
        </div>

        <label className="flex items-center gap-3 text-sm font-medium text-[#292722]">
          Font color
          <input
            name="fontColor"
            type="color"
            value={form.fontColor}
            onChange={handleChange}
            className="h-10 w-14 cursor-pointer rounded border border-stone-300 bg-white p-1"
          />
          <span className="font-mono text-xs text-stone-500">
            {form.fontColor}
          </span>
        </label>

        <input
            name="book"
            value={form.book}
            onChange={handleChange}
            placeholder="Book"
            className="w-full rounded-lg border border-stone-300 p-3"
        />

        <input
            name="bookNumber"
            value={form.bookNumber}
            onChange={handleChange}
            placeholder="Book One / Volume One"
            className="w-full rounded-lg border border-stone-300 p-3"
        />

        <input
            name="part"
            value={form.part}
            onChange={handleChange}
            placeholder="Part (e.g. Part Three)"
            className="w-full rounded-lg border border-stone-300 p-3"
        />

        <input
            name="chapter"
            value={form.chapter}
            onChange={handleChange}
            placeholder="Chapter"
            className="w-full rounded-lg border border-stone-300 p-3"
        />

        <input
            name="section"
            value={form.section}
            onChange={handleChange}
            placeholder="Section (e.g. Section Five)"
            className="w-full rounded-lg border border-stone-300 p-3"
        />

        <input
            name="page"
            type="number"
            value={form.page}
            onChange={handleChange}
            placeholder="Page"
            className="w-full rounded-lg border border-stone-300 p-3"
        />

        <div>
            <label className="mb-2 block text-sm font-medium text-stone-700">
                Tags
            </label>

            <TagInput
                tags={form.tags}
                suggestions={suggestedTags}
                onChange={(tags) =>
                setForm((current) => ({
                    ...current,
                    tags,
                }))
                }
            />
        </div>

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-stone-900 px-5 py-3 text-white hover:bg-stone-700 disabled:opacity-50"
          >
            {saving
              ? 'Saving...'
              : editingQuote
                ? 'Save Changes'
                : 'Save Quote'}
          </button>

          {editingQuote && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-lg border border-stone-300 px-5 py-3 hover:bg-stone-100"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  )
}

export default QuoteForm