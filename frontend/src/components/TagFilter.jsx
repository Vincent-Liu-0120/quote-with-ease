function TagFilter({ tags, selectedTag, onSelectTag }) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelectTag(null)}
        className={
          selectedTag === null
            ? 'rounded-full bg-stone-900 px-4 py-2 text-sm text-white'
            : 'rounded-full bg-stone-200 px-4 py-2 text-sm text-stone-700 hover:bg-stone-300'
        }
      >
        All
      </button>

      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onSelectTag(tag)}
          className={
            selectedTag === tag
              ? 'rounded-full bg-stone-900 px-4 py-2 text-sm text-white'
              : 'rounded-full bg-stone-200 px-4 py-2 text-sm text-stone-700 hover:bg-stone-300'
          }
        >
          {tag}
        </button>
      ))}
    </div>
  )
}

export default TagFilter