import client from "./util/client"
import Link from "next/link"

export default class Index extends React.Component {
  static async getInitialProps({ req }) {
    const json = await client.call("scenarios", {})
    return { scenarios: json.scenarios }
  }

  render() {
    const { scenarios } = this.props
    return (
      <div className="container">
        <h1>Record ContentEditable Events</h1>
        <p>
          This web app allows us to create edit scenarios for use in a
          ContentEditable div that is controlled by React. We can then record
          the events for each scenario across multiple browsers in order to get
          a better understanding of how each browser works.
        </p>
        <p>
          Created to help me fix the Slate issue{" "}
          <a href="https://github.com/ianstormtaylor/slate/issues/2062">
            fix editing with "soft keyboard" (e.g. Android, IMEs)
          </a>
        </p>
        <Link href="/edit">
          <a className="btn btn-primary">+ New Scenario</a>
        </Link>
        <ul className="list-group my-4">
          {scenarios.map(scenario => {
            return (
              <div key={scenario._id} className="list-group-item">
                <div className="float-md-right">
                  <Link
                    href={{
                      pathname: "/record",
                      query: { scenarioId: scenario._id },
                    }}
                  >
                    <a className="btn btn-primary btn-sm">Record</a>
                  </Link>
                  <Link
                    href={{
                      pathname: "/edit",
                      query: { scenarioId: scenario._id },
                    }}
                  >
                    <a className="btn btn-primary btn-sm ml-1">Edit</a>
                  </Link>
                  <Link
                    href={{
                      pathname: "/view",
                      query: { scenarioId: scenario._id },
                    }}
                  >
                    <a className="btn btn-primary btn-sm ml-1">
                      View Recordings
                    </a>
                  </Link>
                </div>
                <div>{scenario.title}</div>
                <div>
                  {scenario.tags.map(tag => (
                    <span key={tag} className="badge badge-info mr-1">
                      {tag}
                    </span>
                  ))}
                  {scenario.apis.map(tag => (
                    <span key={tag} className="badge badge-success mr-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </ul>
      </div>
    )
  }
}
