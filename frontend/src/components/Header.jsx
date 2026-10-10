function Header() {
  return (
    <header className="py-8 sm:py-12">
      <p className="mb-3 text-sm uppercase tracking-widest text-stone-500">
        Personal Collection
      </p>

      <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">
        Thoughts worth remembering.
      </h1>

      <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
        A collection of quotes, ideas, and passages
        gathered from books I have read.
      </p>
    </header>
  )
}

export default Header