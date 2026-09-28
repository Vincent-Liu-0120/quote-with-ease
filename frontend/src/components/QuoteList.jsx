import QuoteCard from './QuoteCard'

function QuoteList({ quotes, onEdit, onDelete }) {
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