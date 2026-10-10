import { useState } from 'react'

function wrapText(context, text, maxWidth) {
  const words = text.split(/\s+/)
  const lines = []
  let line = ''

  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word

    if (context.measureText(nextLine).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = nextLine
    }
  })

  if (line) {
    lines.push(line)
  }

  return lines
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () =>
      reject(
        new Error(
          'The author image could not be used in the shared image.'
        )
      )
    image.src = url
  })
}

function drawImageCover(context, image, width, height) {
  const scale = Math.max(width / image.width, height / image.height)
  const renderedWidth = image.width * scale
  const renderedHeight = image.height * scale

  context.drawImage(
    image,
    (width - renderedWidth) / 2,
    (height - renderedHeight) / 2,
    renderedWidth,
    renderedHeight
  )
}

async function createQuoteImage(quote) {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Your browser cannot create quote images.')
  }

  context.fillStyle = '#f7f0df'
  context.fillRect(0, 0, canvas.width, canvas.height)

  if (quote.authorBackground) {
    const authorImage = await loadImage(quote.authorBackground)
    drawImageCover(context, authorImage, canvas.width, canvas.height)
    context.fillStyle = 'rgba(247, 240, 223, 0.84)'
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  context.fillStyle = '#b8871e'
  context.fillRect(96, 132, 120, 12)

  context.fillStyle = quote.fontColor || '#292722'
  context.font = 'bold 56px Georgia, serif'
  const quoteLines = wrapText(context, `“${quote.text}”`, 888)
  let y = 620 - (quoteLines.length * 76) / 2

  quoteLines.forEach((line) => {
    context.fillText(line, 96, y)
    y += 76
  })

  context.font = 'bold 36px Arial, sans-serif'
  context.fillText(quote.author, 96, 1290)
  context.font = '28px Arial, sans-serif'
  context.fillStyle = '#665f52'

  const source = [
    quote.book,
    quote.chapter && `Chapter ${quote.chapter}`,
    quote.section && `Section ${quote.section}`,
    quote.page && `p. ${quote.page}`,
  ].filter(Boolean).join(' · ')

  if (source) {
    context.fillText(source, 96, 1350)
  }

  context.font = '24px Arial, sans-serif'
  context.fillText('Vincent’s Quotes', 96, 1790)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('The quote image could not be created.'))
        return
      }

      resolve(new File([blob], 'quote.png', { type: 'image/png' }))
    }, 'image/png')
  })
}

function downloadImage(file) {
  const url = URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  link.click()
  URL.revokeObjectURL(url)
}

function ShareButton({ quote }) {
  const [status, setStatus] = useState(null)

  async function handleShare() {
    try {
      const file = await createQuoteImage(quote)

      if (
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({
          title: `Quote by ${quote.author}`,
          files: [file],
        })
        setStatus('Shared')
      } else {
        downloadImage(file)
        setStatus('Image saved')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setStatus(error.message)
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className="text-sm text-stone-600 hover:text-stone-900"
      aria-label={`Share quote by ${quote.author}`}
    >
      <span aria-live="polite">{status || 'Share'}</span>
    </button>
  )
}

export default ShareButton
