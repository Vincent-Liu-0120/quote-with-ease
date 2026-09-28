import {
  getQuotes,
  deleteQuote,
} from './api/quotes'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import QuoteList from './components/QuoteList'
import QuoteForm from './components/QuoteForm'

function App() {

  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingQuote, setEditingQuote] = useState(null)

  function handleQuoteCreated(newQuote) {
    // Add the newly created quote to the beginning of the current quote list.
    // `current` is the latest state value provided by React.
    // `[newQuote, ...current]` creates a new array instead of modifying
    // the existing array directly.
    setQuotes((current) => [newQuote, ...current])
  }

  async function handleDeleteQuote(id) {
    try {
      // The API layer handles DELETE /api/quotes/:id.
      await deleteQuote(id)

      // Remove the deleted quote from React state.
      setQuotes((current) =>
        current.filter((quote) => quote._id !== id)
      )
    } catch (error) {
      setError(error.message)
    }
  }

  function handleEditQuote(quote) {
    // Store the quote we're currently editing.
    // QuoteForm will use this object to populate its fields.
    setEditingQuote(quote)

    // Scroll back to the form so the user can edit it.
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  function handleQuoteUpdated(updatedQuote) {
    // Replace the old quote with the updated quote.
    setQuotes((current) =>
      current.map((quote) =>
        quote._id === updatedQuote._id
          ? updatedQuote
          : quote
      )
    )

    // Exit edit mode.
    setEditingQuote(null)
  }

  useEffect(() => {
    async function fetchQuotes() {
      try {
        // The API layer handles the actual HTTP request.
        const data = await getQuotes()

        setQuotes(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuotes()
  }, [])

  return (
    <main className="min-h-screen bg-stone-100 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Header />

        <QuoteForm
          editingQuote={editingQuote}
          onQuoteCreated={handleQuoteCreated}
          onQuoteUpdated={handleQuoteUpdated}
          onCancelEdit={() => setEditingQuote(null)}
        />

        {loading && <p>Loading quotes...</p>}

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && (
          <QuoteList
            quotes={quotes}
            onEdit={handleEditQuote}
            onDelete={handleDeleteQuote}
          />
        )}
      </div>
    </main>
  )
}

export default App