import Back from "./components/Back"
import client from "./util/client"

function Field({
  context,
  Tag = "textarea",
  name,
  caption,
  hint,
  rows = 3,
  placeholder,
}) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{caption}</label>
      <Tag
        id={`#${name}`}
        className="form-control"
        rows={rows}
        style={{ fontFamily: "monospace" }}
        placeholder={placeholder}
        onChange={e => context.setState({ [name]: e.target.value })}
        value={context.state[name]}
      />
      <small className="form-text text-muted">{hint}</small>
    </div>
  )
}

export default class Scenario extends React.Component {
  state = {
    title: "Insert word at start of existing word using the virtual keyboard",
    html: "<p>Hello big world.</p>",
    instructions: `# How to start the edit
Touch the start of the word "big" to start composing.

# How to make the edit
Enter the word "very" using the virtual keyboard.

# How to finish the edit
Hit space on the virtual keyboard to finish composing.`,
  }

  submit = async () => {
    const { title, html, instructions } = this.state
    const json = await client.post("/api/scenario", {
      title,
      html,
      instructions,
    })
    console.log("json", json)
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
          />
          <Field
            context={this}
            name="instructions"
            caption="Instructions"
            hint="Provide details instructions on how to complete the edit"
            rows={10}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.submit}
          >
            Submit Scenario
          </button>
        </form>
      </div>
    )
  }
}
