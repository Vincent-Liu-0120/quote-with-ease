import { useEffect, useState } from 'react'
import Header from './components/Header'
import QuoteList from './components/QuoteList'
import QuoteForm from './components/QuoteForm'

function App() {
  function handleQuoteCreated(newQuote) {
    // Add the newly created quote to the beginning of the current quote list.
    // `current` is the latest state value provided by React.
    // `[newQuote, ...current]` creates a new array instead of modifying
    // the existing array directly.
    setQuotes((current) => [newQuote, ...current])
  }

  async function handleDeleteQuote(id) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/quotes/${id}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete quote')
      }

      // Remove the deleted quote from React's local state.
      // `filter()` creates a new array containing every quote
      // except the one whose `_id` matches the deleted ID.
      setQuotes((current) =>
        current.filter((quote) => quote._id !== id)
      )
    } catch (error) {
      setError(error.message)
    }
  }
  const [quotes, setQuotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const response = await fetch('http://localhost:3000/api/quotes')

        if (!response.ok) {
          throw new Error('Failed to fetch quotes')
        }

        const data = await response.json()
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

        <QuoteForm onQuoteCreated={handleQuoteCreated} />

        {loading && <p>Loading quotes...</p>}

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {!loading && !error && (
          <QuoteList
            quotes={quotes}
            onDelete={handleDeleteQuote}
          />
        )}
      </div>
    </main>
  )
}

export default App