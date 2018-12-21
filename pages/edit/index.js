import Back from "../components/Back"
import client from "../util/client"
import Router from "next/router"
import DEFAULT_STATE from "./DEFAULT_STATE"
import Field from "./Field"
import TagButton from "./TagButton"

export default class Scenario extends React.Component {
  static async getInitialProps({ query }) {
    const { scenarioId } = query
    if (scenarioId == null) return {}
    const json = await client.call("get-scenario", { scenarioId })
    return { scenario: json.scenario }
  }

  constructor(props) {
    super(props)
    this.state = props.scenario ? props.scenario : DEFAULT_STATE
  }

  submit = async () => {
    const { _id, title, html, instructions, tags } = this.state
    const json = await client.call("scenario", {
      _id,
      title,
      html,
      instructions,
      tags,
    })
    Router.push("/")
  }

  handleTagsChange = tags => {
    this.setState({ tags })
  }

  render() {
    return (
      <div className="container">
        <form>
          <Back />
          <h1>Scenario</h1>
          <Field
            context={this}
            Tag="input"
            name="title"
            caption="Title of Scenario"
            hint="Describe what we are testing"
          />
          <Field
            context={this}
            name="html"
            caption="Initial HTML"
            hint="Enter valid HTML to populate the ContentEditable div"
            monospace={true}
          />
          <Field
            context={this}
            name="instructions"
            caption="Instructions"
            hint="Provide details instructions on how to complete the edit"
            rows={8}
          />
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <div>
              <TagButton context={this}>virtual-keyboard</TagButton>
              <TagButton context={this}>hardware-keyboard</TagButton>
              <TagButton context={this}>gesture</TagButton>
              <TagButton context={this}>ime</TagButton>
              <TagButton context={this}>auto-suggest</TagButton>
              <TagButton context={this}>auto-correct</TagButton>
              <TagButton context={this}>delete</TagButton>
              <TagButton context={this}>enter</TagButton>
              <TagButton context={this}>special</TagButton>
            </div>
            <small className="form-text text-muted">
              Add tags to classify the scenario
            </small>
          </div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={this.submit}
          >
            Submit Scenario
          </button>
        </form>
      </div>
    )
  }
}
