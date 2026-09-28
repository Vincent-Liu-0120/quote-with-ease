function Navbar({
  onAddQuote,
}) {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        <div>
          <h1 className="font-serif text-2xl">
            Vincent's Quotes
          </h1>

          <p className="text-sm text-stone-500">
            Thoughts worth remembering
          </p>
        </div>

        <nav className="flex gap-4">
          <button
            className="text-stone-600 hover:text-black"
          >
            Quotes
          </button>

          <button
            onClick={onAddQuote}
            className="rounded-lg bg-stone-900 px-4 py-2 text-white"
          >
            Add Quote
          </button>
        </nav>

      </div>
    </header>
  )
}

export default Navbar