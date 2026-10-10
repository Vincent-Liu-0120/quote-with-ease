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

  context.fillStyle = '#665f52'
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
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState(null)

  async function handleSaveImage() {
    try {
      const file = await createQuoteImage(quote)
      downloadImage(file)
      setStatus('Image saved')
    } catch (error) {
      setStatus(error.message)
    }
  }

  async function handleInstagramStory() {
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
        setStatus('Share sheet opened')
      } else {
        downloadImage(file)
        setStatus('Image saved — open Instagram to share it')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setStatus(error.message)
      }
    }
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => {
          setIsOpen((current) => !current)
          setStatus(null)
        }}
        className="text-sm text-stone-600 hover:text-stone-900"
        aria-label={`Share quote by ${quote.author}`}
        aria-expanded={isOpen}
      >
        <span aria-live="polite">{status || 'Share'}</span>
      </button>

      {isOpen && (
        <span className="absolute bottom-full left-0 z-20 mb-2 flex w-56 flex-col gap-2 rounded-lg border border-[#d8c9a8] bg-[#fffaf0] p-3 shadow-lg">
          <button
            type="button"
            onClick={handleSaveImage}
            className="rounded-md px-3 py-2 text-left text-sm text-[#292722] hover:bg-[#f1e5c9]"
          >
            Save as image
          </button>
          <button
            type="button"
            onClick={handleInstagramStory}
            className="rounded-md px-3 py-2 text-left text-sm text-[#292722] hover:bg-[#f1e5c9]"
          >
            Share to Instagram Story
          </button>
        </span>
      )}
    </span>
  )
}

export default ShareButton
