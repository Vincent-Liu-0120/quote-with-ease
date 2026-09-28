function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-stone-200 pb-6">
      <a
        href="/"
        className="font-serif text-xl font-bold"
      >
        Vincent's Quotes
      </a>

      <div className="flex gap-6 text-sm">
        <a
          href="/"
          className="text-stone-900"
        >
          Quotes
        </a>

        <a
          href="#about"
          className="text-stone-500 hover:text-stone-900"
        >
          About
        </a>
      </div>
    </nav>
  )
}

export default Navbar