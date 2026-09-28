import {
  createQuote,
  updateQuote,
} from '../api/quotes'
import { useEffect, useState } from 'react'

function QuoteForm({
  editingQuote,
  onQuoteCreated,
  onQuoteUpdated,
  onCancelEdit,
}) {
  const [form, setForm] = useState({
    text: '',
    author: '',
    book: '',
    page: '',
    tags: '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // When editingQuote changes, copy its data into the form.
    if (editingQuote) {
      setForm({
        text: editingQuote.text,
        author: editingQuote.author,
        book: editingQuote.book || '',
        page: editingQuote.page || '',
        tags: editingQuote.tags?.join(', ') || '',
      })
    }
  }, [editingQuote])

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
      book: form.book,
      page: form.page ? Number(form.page) : undefined,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
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
            book: '',
            page: '',
            tags: '',
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
      <h2 className="mb-6 text-2xl font-serif font-bold">
        {editingQuote ? 'Edit Quote' : 'Add a Quote'}
      </h2>

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
          name="book"
          value={form.book}
          onChange={handleChange}
          placeholder="Book"
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

        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (e.g. philosophy, nature)"
          className="w-full rounded-lg border border-stone-300 p-3"
        />

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