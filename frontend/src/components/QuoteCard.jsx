function QuoteCard({ quote, onEdit, onDelete }) {
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

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => onEdit(quote)}
          className="text-sm text-stone-700 hover:text-stone-900"
        >
          Edit
        </button>

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