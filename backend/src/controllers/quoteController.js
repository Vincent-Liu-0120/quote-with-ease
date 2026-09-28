import Quote from '../models/Quote.js'

export async function getQuotes(req, res) {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 })

    res.json(quotes)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch quotes',
    })
  }
}

export async function createQuote(req, res) {
  try {
    const quote = await Quote.create(req.body)

    res.status(201).json(quote)
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create quote',
    })
  }
}

export async function deleteQuote(req, res) {
  try {
    const quote = await Quote.findByIdAndDelete(req.params.id)

    // If MongoDB couldn't find a quote with this ID,
    // return 404 instead of pretending the deletion succeeded.
    if (!quote) {
      return res.status(404).json({
        message: 'Quote not found',
      })
    }

    res.json({
      message: 'Quote deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete quote',
    })
  }
}

export async function updateQuote(req, res) {
  try {
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    // If the ID doesn't exist, tell the client.
    if (!quote) {
      return res.status(404).json({
        message: 'Quote not found',
      })
    }

    res.json(quote)
  } catch (error) {
    res.status(400).json({
      message: 'Failed to update quote',
    })
  }
}