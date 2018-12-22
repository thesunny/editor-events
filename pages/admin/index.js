import Back from "../components/Back"

function getIsAdmin() {
  if (!process.browser) return null
  if (localStorage.getItem("isAdmin")) {
    return true
  } else {
    return false
  }
}

export default class Admin extends React.Component {
  enable = () => {
    localStorage.setItem("isAdmin", "true")
    this.setState({})
  }

  disable = () => {
    localStorage.removeItem("isAdmin")
    this.setState({})
  }

  render() {
    const isAdmin = getIsAdmin()
    return (
      <div className="container">
        <Back />
        <p>
          Hey, this is an incredibly weak security mechanism to stop people from
          accidentally editing scenarios.
        </p>
        {isAdmin ? (
          <p>Your admin features are enabled!</p>
        ) : (
          <p>Boo... Your admin features are disabled</p>
        )}
        {isAdmin ? (
          <button className="btn btn-danger" onClick={this.disable}>
            Disable Admin Features
          </button>
        ) : (
          <button className="btn btn-primary mr-1" onClick={this.enable}>
            Enable Admin Features
          </button>
        )}
      </div>
    )
  }
}
