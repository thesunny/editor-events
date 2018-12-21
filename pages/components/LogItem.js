function getStyling(event) {
  let className
  switch (event.type) {
    case "compositionstart":
      className = "text-white bg-success"
      break
    case "compositionend":
      className = "text-white bg-danger"
      break
  }
  switch (event.source) {
    case "REACT":
      return { icon: "React ", className: className || "table-primary" }
    case "NATIVE":
      return { icon: "Native", className: className || "table-success" }
    case "TRANSACTION":
      return { icon: "Trans", className: "table-dark" }
    case "HTML":
      return { icon: "HTML", className: "table-default" }
    default:
      throw new Error(`no match for ${source}`)
  }
}

export default ({ index, event }) => {
  const { icon, className } = getStyling(event)
  return (
    <tr className={className}>
      {event.source === "HTML" ? (
        <td
          className="text-monospace py-2 px-3"
          style={{ fontSize: 14 }}
          colSpan={3}
        >
          {event.html}
        </td>
      ) : (
        <React.Fragment>
          <td style={{ textAlign: "right" }}>
            {Math.round(event.ms / 10) / 100}
          </td>
          <td style={{ textAlign: "left" }}>{icon}</td>
          <td>
            {event.type} {event.key ? ` (${event.key})` : null}
          </td>
        </React.Fragment>
      )}
    </tr>
  )
}
