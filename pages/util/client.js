// import EJSON from "ejson"
import fetch from "isomorphic-unfetch"

function getBeforePath() {
  let protocol, hostname, port
  if (process.browser) {
    protocol = location.protocol
    hostname = location.hostname
    port = location.port
  } else {
    protocol = process.env.PROTOCOL || "http:"
    hostname = process.env.HOST || "localhost"
    port = process.env.PORT || 80
  }
  return `${protocol}//${hostname}${port ? `:${port}` : ""}`
}

export default {
  async call(name, json) {
    const beforePath = getBeforePath()
    const response = await fetch(`${beforePath}/api/${name}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(json),
    })
    return await response.json()
  },
}
