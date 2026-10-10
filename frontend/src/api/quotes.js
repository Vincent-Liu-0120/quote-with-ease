const API_URL = import.meta.env.VITE_API_URL
const STORAGE_KEY = 'quote-with-ease:quotes'

function readLocalQuotes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch (error) {
    throw new Error(
      'Saved quotes could not be read from this browser.',
      { cause: error }
    )
  }
}

function writeLocalQuotes(quotes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes))
  } catch (error) {
    throw new Error(
      'This browser could not save your quotes locally.',
      { cause: error }
    )
  }
}

function sortByCreatedAt(quotes) {
  return [...quotes].sort(
    (first, second) =>
      new Date(second.createdAt) - new Date(first.createdAt)
  )
}

export async function getQuotes() {
  if (!API_URL) {
    return sortByCreatedAt(readLocalQuotes())
  }

  const response = await request(API_URL)
  return response.json()
}

export async function createQuote(quoteData) {
  if (!API_URL) {
    const quote = {
      ...quoteData,
      _id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    const quotes = readLocalQuotes()
    writeLocalQuotes([quote, ...quotes])
    return quote
  }

  const response = await request(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteData),
  })
  return response.json()
}

export async function updateQuote(id, quoteData) {
  if (!API_URL) {
    const quotes = readLocalQuotes()
    const quoteIndex = quotes.findIndex((quote) => quote._id === id)

    if (quoteIndex === -1) {
      throw new Error('Quote not found in this browser.')
    }

    const updatedQuote = {
      ...quotes[quoteIndex],
      ...quoteData,
      _id: id,
    }
    quotes[quoteIndex] = updatedQuote
    writeLocalQuotes(quotes)
    return updatedQuote
  }

  const response = await request(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteData),
  })
  return response.json()
}

export async function deleteQuote(id) {
  if (!API_URL) {
    const quotes = readLocalQuotes()
    const remainingQuotes = quotes.filter((quote) => quote._id !== id)

    if (remainingQuotes.length === quotes.length) {
      throw new Error('Quote not found in this browser.')
    }

    writeLocalQuotes(remainingQuotes)
    return
  }

  await request(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
}

async function request(url, options) {
  try {
    const response = await fetch(`${url}/api/quotes`, options)

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`)
    }

    return response
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'Cannot connect to the quote server. Check the configured API URL.',
        { cause: error }
      )
    }

    throw error
  }
}
