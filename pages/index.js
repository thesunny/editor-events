import Link from "next/link"

export default () => (
  <div className="container">
    <h1>Record ContentEditable Events</h1>
    <Link href="/scenario">
      <a className="btn btn-primary" href="/scenario">
        + New Scenario
      </a>
    </Link>{" "}
    <Link href="/record-events">
      <a className="btn btn-primary" href="/record-events">
        Record Events
      </a>
    </Link>
  </div>
)
