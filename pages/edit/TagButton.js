export default function TagButton({ context, children }) {
  const { tags } = context.state
  const set = new Set(tags)
  const isSelected = set.has(children)

  function onClick(e) {
    e.preventDefault()
    if (set.has(children)) {
      set.delete(children)
    } else {
      set.add(children)
    }
    context.setState({ tags: Array.from(set) })
  }

  const btnStyle = isSelected ? "btn-primary" : "btn-outline-primary"

  return (
    <button className={`btn ${btnStyle} btn-sm ml-1`} onClick={onClick}>
      {children}
    </button>
  )
}
