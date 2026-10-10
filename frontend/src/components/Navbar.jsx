function Navbar({
  onAddQuote,
}) {
  return (
    <header className="border-b border-[#d8c9a8] bg-[#fffaf0]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

        <div>
          <h1 className="font-serif text-2xl">
            Vincent's Quotes
          </h1>

          <p className="text-sm text-stone-500">
            Thoughts worth remembering
          </p>
        </div>

        <nav className="flex w-full gap-3 sm:w-auto">
          <button
            className="flex-1 text-stone-600 hover:text-black sm:flex-none"
          >
            Quotes
          </button>

          <button
            onClick={onAddQuote}
            className="flex-1 rounded-lg bg-[#292722] px-4 py-2 text-[#fffaf0] hover:bg-[#4a463d] sm:flex-none"
          >
            Add Quote
          </button>
        </nav>

      </div>
    </header>
  )
}

export default Navbar