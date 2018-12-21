import LogItem from "./LogItem"

export default function({ events }) {
  function logAll() {
    console.log(events)
  }

  function logEach() {
    events.forEach(event => console.log(event))
  }

  return (
    <div>
      <table className="table table-sm">
        <tbody>
          {events.map((event, index) => {
            return <LogItem key={index} index={index} event={event} />
          })}
        </tbody>
      </table>
      <h5>Log events to console as JSON</h5>
      <button className="btn btn-info" onClick={logEach}>
        Log once per event
      </button>
      <button className="btn btn-info ml-1" onClick={logAll}>
        Log all at once
      </button>
    </div>
  )
}
