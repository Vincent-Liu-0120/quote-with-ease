import { useEffect, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import ShareButton from './ShareButton'

function ReadingQuote({ quote, onEdit }) {
  const quoteStyle = {
    color: quote.fontColor || '#292722',
    ...(quote.authorBackground && {
      backgroundImage: `linear-gradient(135deg, rgba(245,245,244,.94), rgba(245,245,244,.78)), url("${quote.authorBackground}")`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }),
  }

  return (
    <article
      className="flex min-h-screen snap-start items-center px-5 py-16 sm:px-8"
      style={quoteStyle}
    >
      <div className="mx-auto w-full max-w-4xl">

        <p className="font-serif text-2xl leading-relaxed sm:text-3xl md:text-5xl">
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
              {quote.chapter &&
                ` · Chapter ${quote.chapter}`}
              {quote.section &&
                ` · Section ${quote.section}`}
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

          <span className="ml-4">
            <ShareButton quote={quote} />
          </span>
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

  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  /*
   * Instead of rendering three copies of every quote,
   * we create a very large virtual list.
   *
   * For example:
   *
   *   Virtual position:
   *
   *   0   1   2   3   4   5   6   7   ...
   *   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓
   *   Q1  Q2  Q3  Q4  Q1  Q2  Q3  Q4 ...
   *
   * The browser only renders the items near the
   * current viewport.
   *
   * So even if we eventually have 100,000 quotes,
   * we don't render 100,000 DOM elements.
   */
  const VIRTUAL_COUNT = 100000

  const virtualizer = useVirtualizer({
    count: VIRTUAL_COUNT,

    getScrollElement: () => containerRef.current,

    // Every quote occupies exactly one screen.
    estimateSize: () =>
      containerRef.current?.clientHeight ||
      window.innerHeight,

    // Render a few extra items above/below the viewport.
    overscan: 3,

    /*
     * Use the actual quote ID as the React key
     * for each logical quote position.
     *
     * We include the virtual index because the same
     * quote can appear at many different positions.
     */
    getItemKey: (index) => {
      const quote = quotes[index % quotes.length]

      return `${quote._id}-${index}`
    },
  })

  /*
   * Move to the requested quote when Reading Mode opens.
   *
   * We start somewhere near the middle of the virtual list.
   *
   * This gives us a huge amount of room to scroll
   * both upward and downward.
   */
  useEffect(() => {
    if (
      initialIndex === null ||
      !containerRef.current ||
      quotes.length === 0
    ) {
      return
    }

    const middle = Math.floor(VIRTUAL_COUNT / 2)

    /*
     * Adjust the middle position so that it represents
     * the quote that the user originally selected.
     *
     * Example:
     *
     * middle = 50000
     * initialIndex = 2
     *
     * We find the nearest virtual position to 50000
     * whose logical quote is #2.
     */
    const remainder = middle % quotes.length

    const startingIndex =
      middle - remainder + initialIndex

    virtualizer.scrollToIndex(startingIndex, {
      align: 'start',
    })

    setCurrentIndex(initialIndex)
  }, [initialIndex, quotes.length])

  function handleScroll(event) {
    if (quotes.length === 0) {
      return
    }

    const container = event.currentTarget

    const screenHeight = container.clientHeight

    if (screenHeight === 0) {
      return
    }

    /*
     * Determine which virtual item is currently
     * closest to the top of the screen.
     */
    const virtualIndex = Math.round(
      container.scrollTop / screenHeight
    )

    /*
     * Convert the virtual position into the actual
     * quote position.
     *
     * Example with 4 quotes:
     *
     * virtual index:
     *
     * 0  1  2  3  4  5  6  7
     *
     * logical index:
     *
     * 0  1  2  3  0  1  2  3
     */
    const logicalIndex =
      virtualIndex % quotes.length

    setCurrentIndex(logicalIndex)
  }

  if (
    initialIndex === null ||
    !quotes ||
    quotes.length === 0
  ) {
    return null
  }

  const virtualItems =
    virtualizer.getVirtualItems()

  return (
    <div className="fixed inset-0 z-50 bg-[#f7f0df]">

      {/* Back button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute left-6 top-6 z-10 text-sm text-stone-500 hover:text-stone-900"
      >
        ← Back
      </button>

      {/* Current quote position */}
      <div className="absolute right-6 top-6 z-10 text-sm text-stone-500">
        {currentIndex + 1} / {quotes.length}
      </div>

      {/* Virtualized scroll container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="h-screen snap-y snap-mandatory overflow-y-auto"
      >

        {/* 
         * This element represents the entire virtual list.
         *
         * It can be extremely tall without containing
         * thousands of actual DOM elements.
         */}
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >

          {virtualItems.map((virtualItem) => {
            /*
             * Convert the virtual position into the
             * real quote position.
             */
            const quoteIndex =
              virtualItem.index % quotes.length

            const quote = quotes[quoteIndex]

            return (
              <div
                key={virtualItem.key}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                className="absolute left-0 top-0 w-full snap-start"
                style={{
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <ReadingQuote
                  quote={quote}
                  onEdit={onEdit}
                />
              </div>
            )
          })}

        </div>
      </div>
    </div>
  )
}

export default ReadingView