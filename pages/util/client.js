export default {
  async post(path, json) {
    const response = await fetch(path, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(json),
    })
    return response.json()
  },
}
