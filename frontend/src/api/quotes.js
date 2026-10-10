const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/quotes`

export async function getQuotes() {
  const response = await request(API_URL)

  return response.json()
}

export async function createQuote(quoteData) {
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
  const response = await request(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  return response.json()
}

async function request(url, options) {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`)
    }

    return response
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'Cannot connect to the quote server. Start the backend and try again.',
        { cause: error }
      )
    }

    throw error
  }
}