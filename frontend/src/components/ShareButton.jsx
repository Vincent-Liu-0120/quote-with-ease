import { useState } from 'react'

const CANVAS_WIDTH = 1080
const CANVAS_HEIGHT = 1920
const HORIZONTAL_PADDING = 96

const DEFAULT_STYLE = {
  quoteAlignment: 'left',
  fontFamily: 'Georgia',
  quoteSize: 58,
  authorSize: 40,
  referenceSize: 28,
  veilColor: '#f7f0df',
  veilOpacity: 84,
}

const FONT_SUGGESTIONS = [
  'Georgia',
  'Times New Roman',
  'Arial',
  'Helvetica',
  'Courier New',
  'Verdana',
  'Trebuchet MS',
  'Garamond',
  'Palatino Linotype',
]

function getFontStack(fontFamily) {
  const safeFontFamily = fontFamily.trim().replaceAll('"', '')
  return `"${safeFontFamily || 'Georgia'}", Georgia, serif`
}

function toRgba(hex, opacity) {
  const normalizedHex = hex.replace('#', '')
  const red = Number.parseInt(normalizedHex.slice(0, 2), 16)
  const green = Number.parseInt(normalizedHex.slice(2, 4), 16)
  const blue = Number.parseInt(normalizedHex.slice(4, 6), 16)

  return `rgba(${red}, ${green}, ${blue}, ${opacity / 100})`
}

function getReferenceLines(quote) {
  return [
    quote.book,
    quote.bookNumber,
    quote.part,
    quote.chapter && `Chapter ${quote.chapter}`,
    quote.section && `Section ${quote.section}`,
    quote.page && `p. ${quote.page}`,
  ]
    .filter(Boolean)
}

function getTextX(alignment) {
  if (alignment === 'center') {
    return CANVAS_WIDTH / 2
  }

  return alignment === 'right'
    ? CANVAS_WIDTH - HORIZONTAL_PADDING
    : HORIZONTAL_PADDING
}

function getPreviewPosition(alignment) {
  if (alignment === 'center') {
    return 'left-1/2 -translate-x-1/2 text-center'
  }

  return alignment === 'right'
    ? 'right-[8.9%] text-right'
    : 'left-[8.9%] text-left'
}

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
          'The author image could not be used in the shared image. Choose a different image or remove it before sharing.'
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

function drawLines(context, lines, x, startY, lineHeight) {
  lines.forEach((line, index) => {
    context.fillText(line, x, startY + index * lineHeight)
  })
}

function drawCenteredReferenceRows(context, rows, y, maxWidth, lineHeight) {
  const lines = rows.flatMap((row) => {
    const words = row.toUpperCase().split(/\s+/)
    const wrappedRows = []
    let currentRow = ''

    words.forEach((word) => {
      const nextRow = currentRow ? `${currentRow} ${word}` : word
      const spacingWidth = Math.max(nextRow.length - 1, 0) * 5

      if (context.measureText(nextRow).width + spacingWidth > maxWidth && currentRow) {
        wrappedRows.push(currentRow)
        currentRow = word
      } else {
        currentRow = nextRow
      }
    })

    if (currentRow) {
      wrappedRows.push(currentRow)
    }

    return wrappedRows
  })

  lines.forEach((line, lineIndex) => {
    const letterSpacing = 5
    const lineWidth =
      context.measureText(line).width + (line.length - 1) * letterSpacing
    let letterX = CANVAS_WIDTH / 2 - lineWidth / 2

    Array.from(line).forEach((letter) => {
      context.fillText(letter, letterX, y + lineIndex * lineHeight)
      letterX += context.measureText(letter).width + letterSpacing
    })
  })
}

async function createQuoteImage(quote, style) {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_WIDTH
  canvas.height = CANVAS_HEIGHT
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Your browser cannot create quote images.')
  }

  context.fillStyle = style.veilColor
  context.fillRect(0, 0, canvas.width, canvas.height)

  if (quote.authorBackground) {
    const authorImage = await loadImage(quote.authorBackground)
    drawImageCover(context, authorImage, canvas.width, canvas.height)
    context.fillStyle = toRgba(style.veilColor, style.veilOpacity)
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  const textX = getTextX(style.quoteAlignment)
  const maxWidth = CANVAS_WIDTH - HORIZONTAL_PADDING * 2
  const textColor = quote.fontColor || '#292722'
  const fontStack = getFontStack(style.fontFamily)

  if (document.fonts) {
    await Promise.all([
      document.fonts.load(`700 ${style.quoteSize}px ${fontStack}`),
      document.fonts.load(`500 ${style.referenceSize}px ${fontStack}`),
    ])
  }

  context.textAlign = style.quoteAlignment
  context.fillStyle = '#b8871e'
  context.fillRect(
    CANVAS_WIDTH / 2 - 60,
    132,
    120,
    12
  )
  context.fillStyle = textColor
  context.fillStyle = textColor
  context.font = `700 ${style.quoteSize}px ${fontStack}`
  const quoteLines = wrapText(context, `“${quote.text}”`, maxWidth)
  const quoteLineHeight = Math.round(style.quoteSize * 1.34)
  const quoteY = 620 - (quoteLines.length - 1) * quoteLineHeight * 0.5
  drawLines(context, quoteLines, textX, quoteY, quoteLineHeight)

  context.textAlign = 'center'
  context.font = `700 ${style.authorSize}px ${fontStack}`
  context.fillText(quote.author, CANVAS_WIDTH / 2, 1290)

  const referenceLines = getReferenceLines(quote)
  if (referenceLines.length > 0) {
    context.fillStyle = '#b8871e'
    context.fillRect(CANVAS_WIDTH / 2 - 180, 1325, 360, 4)
    context.font = `500 ${style.referenceSize}px ${fontStack}`
    context.fillStyle = textColor
    drawCenteredReferenceRows(
      context,
      referenceLines,
      1385,
      maxWidth,
      Math.round(style.referenceSize * 1.5)
    )
  }

  context.font = `24px ${fontStack}`
  context.fillText('Vincent’s Quotes', CANVAS_WIDTH / 2, 1790)

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

function SizeControl({ label, name, value, onChange, min, max }) {
  return (
    <label className="block text-sm font-medium text-stone-700">
      <span className="flex justify-between">
        {label}
        <span className="font-mono text-xs text-stone-500">{value}px</span>
      </span>
      <input
        type="range"
        name={name}
        value={value}
        min={min}
        max={max}
        onChange={onChange}
        className="mt-2 w-full accent-[#a87516]"
      />
    </label>
  )
}

function SharePreview({ quote, style }) {
  const quotePosition = getPreviewPosition(style.quoteAlignment)
  const textColor = quote.fontColor || '#292722'
  const referenceLines = getReferenceLines(quote)

  return (
    <div
      className="relative mx-auto aspect-[9/16] w-full max-w-[342px] overflow-hidden rounded-xl bg-[#f7f0df] shadow-lg"
      style={{
        color: textColor,
        fontFamily: getFontStack(style.fontFamily),
        backgroundImage: quote.authorBackground
          ? `linear-gradient(${toRgba(style.veilColor, style.veilOpacity)}, ${toRgba(style.veilColor, style.veilOpacity)}), url("${quote.authorBackground}")`
          : undefined,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="absolute left-[8.9%] top-[6.9%] h-1 w-10 bg-[#b8871e]" />
      <p
        className={`absolute top-[29%] w-[82.2%] font-bold leading-[1.34] ${quotePosition}`}
        style={{
          fontSize: `${style.quoteSize / 3.05}px`,
        }}
      >
        “{quote.text}”
      </p>
      <div className="absolute left-[8.9%] top-[66.7%] w-[82.2%] text-center">
        <p
          className="font-bold leading-tight"
          style={{
            fontSize: `${style.authorSize / 3.05}px`,
          }}
        >
          {quote.author}
        </p>
        {referenceLines.length > 0 && (
          <>
            <div className="mx-auto mt-3 h-px w-1/2 bg-[#b8871e]" />
            <div className="mt-3 space-y-1 font-medium uppercase leading-snug tracking-[0.16em]">
              {referenceLines.map((line) => (
                <p
                  key={line}
                  style={{
                    fontSize: `${style.referenceSize / 3.05}px`,
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
      <p
        className="absolute bottom-[6.7%] left-[8.9%] w-[82.2%] text-center text-[8px]"
      >
        Vincent’s Quotes
      </p>
    </div>
  )
}

function ShareButton({ quote }) {
  const [isOpen, setIsOpen] = useState(false)
  const [style, setStyle] = useState(DEFAULT_STYLE)
  const [status, setStatus] = useState(null)
  const [sharing, setSharing] = useState(false)

  function handleStyleChange(event) {
    const { name, value } = event.target
    setStyle((current) => ({
      ...current,
      [name]: ['quoteSize', 'authorSize', 'referenceSize', 'veilOpacity'].includes(name)
        ? Number(value)
        : value,
    }))
  }

  function openPreview() {
    setStatus(null)
    setIsOpen(true)
  }

  async function handleShare() {
    setSharing(true)
    setStatus(null)

    try {
      const file = await createQuoteImage(quote, style)

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `Quote by ${quote.author}`,
          files: [file],
        })
        setStatus('Shared')
      } else {
        downloadImage(file)
        setStatus('Image saved to your device')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setStatus(error.message)
      }
    } finally {
      setSharing(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openPreview}
        className="text-sm text-stone-600 hover:text-stone-900"
        aria-label={`Customize and share quote by ${quote.author}`}
      >
        Share
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto bg-stone-950/55 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-preview-title"
        >
          <div className="mx-auto w-full max-w-5xl rounded-2xl bg-[#fffaf0] p-5 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a87516]">
                  Share preview
                </p>
                <h2 id="share-preview-title" className="mt-1 font-serif text-2xl font-bold text-[#292722]">
                  Make the quote your own
                </h2>
                <p className="mt-2 max-w-xl text-sm text-stone-600">
                  The image sent to your share sheet will use these settings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-xl leading-none text-stone-500 hover:bg-stone-200 hover:text-stone-900"
                aria-label="Close share preview"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
              <div className="order-2 space-y-6 lg:order-1">
                <fieldset>
                  <legend className="text-sm font-semibold text-[#292722]">Quote alignment</legend>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {['left', 'center', 'right'].map((alignment) => (
                      <button
                        key={alignment}
                        type="button"
                        onClick={() => setStyle((current) => ({ ...current, quoteAlignment: alignment }))}
                        className={`rounded-lg border px-3 py-2 text-sm capitalize ${
                          style.quoteAlignment === alignment
                            ? 'border-[#a87516] bg-[#f3e3bc] font-semibold text-[#5d4210]'
                            : 'border-stone-300 bg-white text-stone-700 hover:border-stone-500'
                        }`}
                      >
                        {alignment}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="block text-sm font-semibold text-[#292722]">
                  Font family
                  <input
                    list="share-font-suggestions"
                    name="fontFamily"
                    value={style.fontFamily}
                    onChange={handleStyleChange}
                    placeholder="e.g. Times New Roman"
                    className="mt-2 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 font-normal text-stone-800 outline-none focus:border-[#a87516] focus:ring-2 focus:ring-[#f3e3bc]"
                  />
                  <datalist id="share-font-suggestions">
                    {FONT_SUGGESTIONS.map((font) => (
                      <option key={font} value={font} />
                    ))}
                  </datalist>
                  <span className="mt-1 block text-xs font-normal text-stone-500">
                    Choose a suggested font or type a font installed on your device.
                  </span>
                </label>

                <div className="space-y-5 rounded-xl border border-[#e3d6b8] bg-white p-4">
                  <SizeControl label="Quote size" name="quoteSize" value={style.quoteSize} min="40" max="80" onChange={handleStyleChange} />
                  <SizeControl label="Author size" name="authorSize" value={style.authorSize} min="26" max="56" onChange={handleStyleChange} />
                  <SizeControl label="Reference size" name="referenceSize" value={style.referenceSize} min="18" max="42" onChange={handleStyleChange} />
                </div>

                <div className="rounded-xl border border-[#e3d6b8] bg-white p-4">
                  <label className="flex items-center justify-between gap-4 text-sm font-medium text-stone-700">
                    Background veil color
                    <input
                      type="color"
                      name="veilColor"
                      value={style.veilColor}
                      onChange={handleStyleChange}
                      className="h-10 w-14 cursor-pointer rounded border border-stone-300 bg-white p-1"
                    />
                  </label>
                  <label className="mt-4 block text-sm font-medium text-stone-700">
                    <span className="flex justify-between">
                      Veil strength
                      <span className="font-mono text-xs text-stone-500">{style.veilOpacity}%</span>
                    </span>
                    <input
                      type="range"
                      name="veilOpacity"
                      value={style.veilOpacity}
                      min="0"
                      max="100"
                      onChange={handleStyleChange}
                      className="mt-2 w-full accent-[#a87516]"
                    />
                  </label>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <SharePreview quote={quote} style={style} />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-end gap-3 border-t border-[#e3d6b8] pt-5">
              {status && <p className="mr-auto text-sm text-stone-600" aria-live="polite">{status}</p>}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-2 text-sm text-stone-700 hover:bg-stone-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleShare}
                disabled={sharing}
                className="rounded-lg bg-[#a87516] px-5 py-2 text-sm font-semibold text-white hover:bg-[#815910] disabled:cursor-wait disabled:opacity-60"
              >
                {sharing ? 'Preparing image...' : 'Share image'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default ShareButton
