import client from "./util/client"
import Routes from "../server/routes"
const { Link } = Routes

export default class Index extends React.Component {
  static async getInitialProps({ req }) {
    const json = await client.post("/api/scenarios", {})
    return { scenarios: json.scenarios }
  }

  render() {
    const { scenarios } = this.props
    return (
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
        <ul className="list-group my-4">
          {scenarios.map(scenario => {
            return (
              <Link
                key={scenario._id}
                route="record-events"
                params={{ scenarioId: scenario._id }}
              >
                <a className="list-group-item list-group-item-action">
                  {scenario.title}
                  <Link
                    key={scenario._id}
                    route="scenario"
                    params={{ scenarioId: scenario._id }}
                  >
                    <a className="btn btn-primary float-right">Edit</a>
                  </Link>
                </a>
              </Link>
            )
          })}
        </ul>
      </div>
    )
  }
}
