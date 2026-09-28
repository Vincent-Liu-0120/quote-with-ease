function SearchBar({ value, onChange }) {
  return (
    <div className="mb-8">
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search quotes, authors, or books..."
        className="w-full rounded-xl border border-stone-300 bg-white px-5 py-4 outline-none transition focus:border-stone-500"
      />
    </div>
  )
}

export default SearchBar