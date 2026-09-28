import QuoteCard from './QuoteCard'

function QuoteList({ quotes, onEdit, onDelete }) {
  if (quotes.length === 0) {
    return (
      <p className="py-12 text-center text-stone-500">
        No quotes found.
      </p>
    )
  }

  return (
    <section className="grid gap-6 md:grid-cols-2">
      {quotes.map((quote) => (
        <QuoteCard
          key={quote._id}
          quote={quote}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </section>
  )
}

export default QuoteList