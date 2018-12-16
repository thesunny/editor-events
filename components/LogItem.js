function getStyling(source) {
  switch (source) {
    case "REACT":
      return { icon: "React ", className: "table-primary" }
    case "NATIVE":
      return { icon: "Native", className: "table-success" }
    case "TRANSACTION":
      return { icon: "⏰", className: "table-danger" }
    case "HTML":
      return { icon: "HTML", className: "table-secondary" }
    default:
      throw new Error(`no match for ${source}`)
  }
}

export default React.memo(({ index, event }) => {
  const { icon, className } = getStyling(event.source)
  return (
    <tr className={className}>
      <td style={{ width: 50 }}>{index}</td>
      <td style={{ width: 150 }}>{icon}</td>
      {event.source === "HTML" ? (
        <td colSpan={2}>{event.html}</td>
      ) : (
        <React.Fragment>
          <td style={{ width: "40%" }}>
            {event.type}{" "}
            {event.constructorName ? `(${event.constructorName})` : null}
          </td>
          <td style={{ width: "60%" }}>
            {event.key ? `"${event.key}"` : null}{" "}
          </td>
        </React.Fragment>
      )}
    </tr>
  )
})
