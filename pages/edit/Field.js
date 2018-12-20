export default function Field({
  context,
  Tag = "textarea",
  name,
  caption,
  hint,
  rows = 3,
  placeholder,
  monospace = false,
}) {
  const style = {}
  if (monospace) style.fontFamily = "monospace"
  return (
    <div className="form-group">
      <label htmlFor={name}>{caption}</label>
      <Tag
        id={`${name}`}
        className="form-control"
        rows={rows}
        style={style}
        placeholder={placeholder}
        onChange={e => context.setState({ [name]: e.target.value })}
        value={context.state[name]}
      />
      <small className="form-text text-muted">{hint}</small>
    </div>
  )
}
