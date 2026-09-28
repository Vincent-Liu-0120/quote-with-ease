function QuotePreview({ quote, onClose, onEdit }) {
  if (!quote) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-stone-100/95 px-6 py-10">
      <div className="mx-auto flex min-h-full max-w-3xl flex-col">

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-stone-500 hover:text-stone-900"
          >
            ← Back
          </button>

          <button
            type="button"
            onClick={() => onEdit(quote)}
            className="text-sm text-stone-500 hover:text-stone-900"
          >
            Edit
          </button>
        </div>

        <div className="my-auto py-16">
          <p className="font-serif text-3xl leading-relaxed md:text-5xl">
            “{quote.text}”
          </p>

          <div className="mt-10">
            <p className="text-lg font-medium">
              {quote.author}
            </p>

            {quote.book && (
              <p className="mt-2 text-stone-500">
                {quote.book}

                {quote.part && ` · ${quote.part}`}
                {quote.section && ` · ${quote.section}`}
                {quote.chapter && ` · ${quote.chapter}`}
                {quote.page && ` · p. ${quote.page}`}
              </p>
            )}

            {quote.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {quote.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-stone-200 px-3 py-1 text-sm text-stone-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default QuotePreview