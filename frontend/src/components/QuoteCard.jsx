import ShareButton from './ShareButton'

function QuoteCard({ 
    quote,
    onEdit,
    onDelete,
    onPreview
}) {
  const cardStyle = {
    color: quote.fontColor || '#292722',
    ...(quote.authorBackground && {
      backgroundImage: `linear-gradient(135deg, rgba(255,255,255,.96), rgba(255,255,255,.78)), url("${quote.authorBackground}")`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
    }),
  }

  return (
    <article
      className="rounded-xl bg-[#fffaf0] p-6 shadow-sm"
      style={cardStyle}
    >
        
        <button
            type="button"
            onClick={() => onPreview(quote)}
            className="text-left"
        >
            <p className="font-serif text-xl leading-relaxed hover:text-stone-600">
                {quote.text}
            </p>
        </button>

        <div className="mt-6">
            <p className="font-medium">
                {quote.author}
            </p>

            {quote.book && (
                <p className="mt-1 text-sm text-stone-500">
                {quote.book}

                {quote.part && ` · ${quote.part}`}
                {quote.chapter && ` · Chapter ${quote.chapter}`}
                {quote.section && ` · Section ${quote.section}`}
                {quote.page && ` · p. ${quote.page}`}
                </p>
            )}
        </div>

        <div className="mt-6 flex gap-4">
            <button
                onClick={() => onEdit(quote)}
                className="text-sm text-stone-700 hover:text-stone-900"
            >
            Edit
            </button>

            <ShareButton quote={quote} />

            <button
                onClick={() => onDelete(quote._id)}
                className="text-sm text-red-600 hover:text-red-800"
            >
            Delete
            </button>
        </div>
    </article>
  )
}

export default QuoteCard