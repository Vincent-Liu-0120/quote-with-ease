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

    authorBackground: {
      type: String,
      trim: true,
    },

    fontColor: {
      type: String,
      trim: true,
    },

    book: {
      type: String,
      trim: true,
    },

    bookNumber: {
      type: String,
      trim: true,
    },

    part: {
      type: String,
      trim: true,
    },

    section: {
      type: String,
      trim: true,
    },

    chapter: {
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