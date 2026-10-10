function TagInput({ tags, onChange, suggestions = [] }) {
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

  function addSuggestedTag(tag) {
    if (!tags.includes(tag)) {
      onChange([...tags, tag])
    }
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

      {suggestions.length > 0 && (
        <div className="mb-3">
          <p className="mb-2 text-xs text-stone-500">
            Suggestions
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions
              .filter((suggestion) => !tags.includes(suggestion))
              .map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => addSuggestedTag(suggestion)}
                  className="rounded-full border border-[#d8c9a8] px-3 py-1 text-sm text-[#5d4613] hover:bg-[#f1e5c9]"
                >
                  + {suggestion}
                </button>
              ))}
          </div>
        </div>
      )}

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