import mongoose from 'mongoose'

const quoteSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    author: {
      type: String,
      required: true,
      trim: true,
    },

    book: {
      type: String,
      trim: true,
    },

    page: {
      type: Number,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Quote', quoteSchema)