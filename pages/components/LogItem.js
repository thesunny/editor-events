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
    case "MUTATION":
      return {
        icon: "Mutation",
        className: "",
        output: event.mutations
          ? event.mutations.map(mutation => `${mutation.type} ${mutation.target}`).join("\n")
          : null,
        style: { backgroundColor: "#FFFFF0" },
      }
    default:
      throw new Error(`no match for ${source}`)
  }
}

export default ({ index, event }) => {
  const { icon, className, output, style } = getStyling(event)
  return (
    <tr className={className} style={style} onClick={() => console.log(event)} title="Click to console.log this event">
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
          <td style={{whiteSpace: 'pre-wrap'}}>
            {event.type ? `${event.type} ` : null}
            {output ? output : event.key ? ` (${event.key})` : null}
          </td>
        </React.Fragment>
      )}
    </tr>
  )
}
