import Random from "meteor-random"
import API from "./API"

export default function api(server) {
  const api = new API(server)

  api.method("/api/scenarios", async (params, db, req) => {
    const collection = db.collection("scenarios")
    const scenarios = await (await collection.find({})).toArray()
    return { scenarios }
  })

  api.method("/api/get-scenario", async ({ scenarioId }, db) => {
    const collection = db.collection("scenarios")
    const scenario = await await collection.findOne({ _id: scenarioId })
    return { scenario }
  })

  api.method(
    "/api/scenario",
    async ({ _id = Random.id(), title, html, instructions }, db, req) => {
      const collection = db.collection("scenarios")
      await collection.update(
        { _id },
        {
          title,
          html,
          instructions,
          createdAt: new Date(),
        },
        { upsert: true }
      )
      return { _id, title, html, instructions }
    }
  )
}
