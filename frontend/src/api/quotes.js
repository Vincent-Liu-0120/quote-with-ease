const API_URL = `${import.meta.env.VITE_API_URL}/api/quotes`

export async function getQuotes() {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Failed to fetch quotes')
  }

  return response.json()
}

export async function createQuote(quoteData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteData),
  })

  if (!response.ok) {
    throw new Error('Failed to create quote')
  }

  return response.json()
}

export async function updateQuote(id, quoteData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteData),
  })

  if (!response.ok) {
    throw new Error('Failed to update quote')
  }

  return response.json()
}

export async function deleteQuote(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete quote')
  }

  return response.json()
}