import typeOf from "type-of"
import fecha from "fecha"
import styled from "styled-components"
import Back from "../components/Back"
import client from "../util/client"
import Events from "../components/Events"

const ScenarioDiv = styled.div`
  float: left;
  width: 480px;
`
const RecordingsDiv = styled.div`
  position: absolute;
  left: 480px;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: scroll;
`
const RecordingTd = styled.td`
  vertical-align: top;
  width: 400px;
`

function Tags({ tags }) {
  return tags.map(tag => (
    <span key={tag} className="badge badge-success mr-1">
      {tag}
    </span>
  ))
}

function FormattedDate({ date }) {
  return (
    <span className="badge badge-light text-monospace">
      {fecha.format(date, "YY-MM-DD HH:mm:ss")}
    </span>
  )
}

export default class ViewRecordings extends React.Component {
  static async getInitialProps({ req, query }) {
    const { scenarioId } = query
    const json = await client.call("view-scenario", { scenarioId })
    return { scenario: json.scenario, recordings: json.recordings }
  }

  state = {
    checked: {},
  }

  check = id => {
    const { checked } = this.state
    if (checked[id]) {
      delete checked[id]
    } else {
      checked[id] = true
    }
    this.setState({ checked })
  }

  getFilteredRecordings() {
    const { recordings } = this.props
    const { checked } = this.state
    return recordings.filter(recording => checked[recording._id])
  }

  render() {
    const { scenario, recordings } = this.props
    const { checked } = this.state
    const filteredRecordings = this.getFilteredRecordings()
    return (
      <div>
        <ScenarioDiv className="container">
          <Back />
          <div className="card card-body">
            <h2>{scenario.title}</h2>
            <p>{scenario.instructions}</p>
            <pre
              className="bg-light"
              dangerouslySetInnerHTML={{ __html: scenario.html }}
            />
          </div>
          <div className="mt-4">
            <h4>Recordings</h4>
            <p>Check the recordings you wish to view</p>
            {recordings.map(recording => (
              <div key={recording._id}>
                <input
                  id={`checkbox_${recording._id}`}
                  className="mr-1"
                  type="checkbox"
                  checked={!!checked[recording._id]}
                  onChange={() => {
                    this.check(recording._id)
                  }}
                />
                <label htmlFor={`checkbox_${recording._id}`}>
                  <FormattedDate date={new Date(recording.createdAt.$date)} />
                  <Tags tags={recording.tags} />
                </label>
              </div>
            ))}
          </div>
        </ScenarioDiv>
        <RecordingsDiv>
          <table>
            <tbody>
              <tr>
                {filteredRecordings.map(recording => {
                  return (
                    <RecordingTd>
                      <FormattedDate
                        date={new Date(recording.createdAt.$date)}
                      />
                      <Tags tags={recording.tags} />
                      <Events events={recording.events} />
                    </RecordingTd>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </RecordingsDiv>
      </div>
    )
  }
}
