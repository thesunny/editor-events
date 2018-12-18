import fetch from "isomorphic-unfetch"

export default {
  async post(path, json) {
    const response = await fetch(`http://localhost:5000${path}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(json),
    })
    return response.json()
  },
  async call(path, json) {
    const response = await fetch(`http://localhost:5000${path}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(json),
    })
    return response.json()
  },
}
