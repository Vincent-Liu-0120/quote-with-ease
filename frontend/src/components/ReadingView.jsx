import { useEffect, useRef } from 'react'

function ReadingQuote({ quote, onEdit }) {
  return (
    <article className="flex min-h-screen snap-start items-center px-8 py-16">
      <div className="mx-auto w-full max-w-4xl">

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
              {quote.bookNumber &&
                ` · ${quote.bookNumber}`}
              {quote.part &&
                ` · ${quote.part}`}
              {quote.section &&
                ` · ${quote.section}`}
              {quote.chapter &&
                ` · ${quote.chapter}`}
              {quote.page &&
                ` · p. ${quote.page}`}
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

          <button
            type="button"
            onClick={() => onEdit(quote)}
            className="mt-8 text-sm text-stone-500 hover:text-stone-900"
          >
            Edit
          </button>
        </div>

      </div>
    </article>
  )
}

function ReadingView({
  quotes,
  initialIndex,
  onClose,
  onEdit,
}) {
  const containerRef = useRef(null)

  useEffect(() => {
    if (
      initialIndex === null ||
      !containerRef.current
    ) {
      return
    }

    const container = containerRef.current
    const quoteHeight = container.clientHeight

    container.scrollTo({
      top: initialIndex * quoteHeight,
      behavior: 'instant',
    })
  }, [initialIndex])

  function handleScroll(event) {
    const container = event.currentTarget

    const scrollPosition = container.scrollTop
    const screenHeight = container.clientHeight

    const currentIndex = Math.round(
      scrollPosition / screenHeight
    )

    // The last screen is a copy of the first quote.
    // When we reach it, jump back to the real first quote.
    if (currentIndex === quotes.length) {
      container.scrollTo({
        top: 0,
        behavior: 'instant',
      })
    }
  }

  if (
    initialIndex === null ||
    !quotes ||
    quotes.length === 0
  ) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 bg-stone-100">

      <button
        type="button"
        onClick={onClose}
        className="absolute left-6 top-6 z-10 text-sm text-stone-500 hover:text-stone-900"
      >
        ← Back
      </button>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-screen snap-y snap-mandatory overflow-y-auto"
      >
        {quotes.map((quote) => (
          <ReadingQuote
            key={quote._id}
            quote={quote}
            onEdit={onEdit}
          />
        ))}

        {quotes.length > 1 && (
          <ReadingQuote
            key="loop-first"
            quote={quotes[0]}
            onEdit={onEdit}
          />
        )}
      </div>
    </div>
  )
}

export default ReadingView