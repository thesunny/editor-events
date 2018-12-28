import client from "./util/client"
import Link from "next/link"
import UAParser from "ua-parser-js"
import getAgentInfo from "./util/get-agent-info"
import getIsAdmin from "./util/get-is-admin"

function ScenarioTag({ tag }) {
  return (
    <span key={tag} className="badge badge-info mr-1">
      {tag}
    </span>
  )
}

function RecordingTag({ tag }) {
  return (
    <span key={tag} className="badge badge-success mr-1">
      {tag}
    </span>
  )
}

export default class Index extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
    const { api } = getAgentInfo(userAgent)
    const json = await client.call("scenarios", {})
    const isAdmin = getIsAdmin()
    return { isAdmin, api, scenarios: json.scenarios }
  }

  render() {
    const { isAdmin, api, scenarios } = this.props
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
        <p>
          {api ? (
            <div>
              <p>
                You are using an Android browser with this API version:{" "}
                <RecordingTag tag={api} />
              </p>
              <p>
                Look for scenarios below that say "Please Contribute" which
                don't have recordings for this version.
              </p>
            </div>
          ) : (
            "Note: You are not using an Android browser"
          )}
        </p>
        {isAdmin ? (
          <Link href="/edit">
            <a className="btn btn-primary">+ New Scenario</a>
          </Link>
        ) : null}
        <ul className="list-group my-4">
          {scenarios.map(scenario => (
            <Scenario
              isAdmin={isAdmin}
              key={scenario._id}
              api={api}
              scenario={scenario}
            />
          ))}
        </ul>
      </div>
    )
  }
}

function Scenario({ isAdmin, api, scenario }) {
  const canContribute = api && !scenario.apis.includes(api)
  return (
    <div className="list-group-item">
      {" "}
      <div className="float-md-right">
        {" "}
        <Link
          href={{
            pathname: "/record",
            query: { scenarioId: scenario._id },
          }}
        >
          <a className="btn btn-primary btn-sm">Record</a>
        </Link>
        {isAdmin ? (
          <Link
            href={{
              pathname: "/edit",
              query: { scenarioId: scenario._id },
            }}
          >
            <a className="btn btn-primary btn-sm ml-1">Edit</a>
          </Link>
        ) : null}
        <Link
          href={{
            pathname: "/view",
            query: { scenarioId: scenario._id },
          }}
        >
          <a className="btn btn-primary btn-sm ml-1">View Recordings</a>
        </Link>
        <div>
          <small>
            {scenario.recordingCount} recording{scenario.recordingCount !== 1
              ? "s"
              : ""}
          </small>
        </div>
      </div>
      {canContribute ? (
        <div className="alert alert-warning">
          Please "Record" for this scenario! There are no recordings yet for
          your API version.
        </div>
      ) : null}
      <div>{scenario.title} </div>
      <div>
        {scenario.tags.map(tag => <ScenarioTag key={tag} tag={tag} />)}
        {scenario.apis.map(tag => <RecordingTag key={tag} tag={tag} />)}
      </div>
    </div>
  )
}
