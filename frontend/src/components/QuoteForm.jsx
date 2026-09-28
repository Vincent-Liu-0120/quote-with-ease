import { useState } from 'react'

function QuoteForm({ onQuoteCreated }) {
  const [form, setForm] = useState({
    text: '',
    author: '',
    book: '',
    page: '',
    tags: '',
  })

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

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

    try {
      const response = await fetch('http://localhost:3000/api/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: form.text,
          author: form.author,
          book: form.book,
          page: form.page ? Number(form.page) : undefined,
          tags: form.tags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create quote')
      }

      const newQuote = await response.json()

      onQuoteCreated(newQuote)

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
        Add a Quote
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

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-stone-900 px-5 py-3 text-white hover:bg-stone-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Quote'}
        </button>
      </div>
    </form>
  )
}

export default QuoteForm