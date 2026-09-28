function QuoteCard({ quote, onDelete }) {
  return (
    <article className="rounded-xl bg-white p-6 shadow-sm">
      <p className="font-serif text-xl leading-relaxed">
        {quote.text}
      </p>

      <div className="mt-6">
        <p className="font-medium">
          {quote.author}
        </p>

        <p className="text-sm text-stone-500">
          {quote.book}
        </p>
      </div>

      <button
        onClick={() => onDelete(quote._id)}
        className="mt-6 text-sm text-red-600 hover:text-red-800"
      >
        Delete
      </button>
    </article>
  )
}

export default QuoteCard