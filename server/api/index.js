import Random from "meteor-random"
import API from "./API"

export default function api(server) {
  const api = new API(server)

  api.method("scenarios", async (params, db, req) => {
    const collection = db.collection("scenarios")
    const scenarios = await (await collection.find(
      {},
      { projection: { title: 1, tags: 1 } }
    )).toArray()
    return { scenarios }
  })

  api.method("get-scenario", async ({ scenarioId }, db) => {
    const collection = db.collection("scenarios")
    const scenario = await await collection.findOne({ _id: scenarioId })
    return { scenario }
  })

  api.method(
    "scenario",
    async ({ _id = Random.id(), title, html, instructions, tags }, db, req) => {
      const collection = db.collection("scenarios")
      await collection.update(
        { _id },
        {
          title,
          html,
          instructions,
          tags,
          createdAt: new Date(),
        },
        { upsert: true }
      )
      return { _id, title, html, instructions }
    }
  )

  api.method("record", async ({ scenarioId, events }, db) => {
    const collection = db.collection("recordings")
    const { insertedId } = await collection.insert({
      scenarioId,
      events,
      createdAt: new Date(),
    })
    return { insertedId }
  })
}
