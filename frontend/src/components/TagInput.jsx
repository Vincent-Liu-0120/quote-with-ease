function TagInput({ tags, onChange }) {
  function addTag(event) {
    if (event.key !== 'Enter') {
      return
    }

    event.preventDefault()

    const value = event.target.value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')

    if (!value) {
      return
    }

    // Avoid adding the same tag twice.
    if (tags.includes(value)) {
      event.target.value = ''
      return
    }

    // Create a new array instead of modifying the existing tags array.
    onChange([...tags, value])

    event.target.value = ''
  }

  function removeTag(tagToRemove) {
    // Keep every tag except the one the user wants to remove.
    onChange(
      tags.filter((tag) => tag !== tagToRemove)
    )
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-2 rounded-full bg-stone-200 px-3 py-1 text-sm"
          >
            {tag}

            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-stone-500 hover:text-stone-900"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type a tag and press Enter"
        onKeyDown={addTag}
        className="w-full rounded-lg border border-stone-300 p-3"
      />
    </div>
  )
}

export default TagInput