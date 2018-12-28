import EJSON from "ejson"
import Random from "meteor-random"
import API from "./API"
import getAgentInfo from "../get-agent-info"

function getIpFromReq(req) {
  const ipString =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress
  const matchData = ipString.match(/[0-9]+[.][0-9]+[.][0-9]+[.][0-9]+/)
  if (matchData) return matchData[0]
  return "unknown"
}

export default function api(server) {
  const api = new API(server)

  api.method("scenarios", async (params, db, req) => {
    const ip = getIpFromReq(req)
    const collection = db.collection("scenarios")
    const scenarios = await await db
      .collection("scenarios")
      .aggregate([
        {
          $lookup: {
            from: "recordings",
            localField: "_id",
            foreignField: "scenarioId",
            as: "recordings",
          },
        },
        {
          $project: {
            title: 1,
            html: 1,
            instructions: 1,
            starred: 1,
            tags: 1,
            createdAt: 1,
            "recordings.userAgent": 1,
          },
        },
        {
          $sort: {
            starred: -1,
            createdAt: 1,
          },
        },
      ])
      .toArray()
    const tags = new Set()
    scenarios.forEach(scenario => {
      const apis = new Set()
      scenario.recordingCount = scenario.recordings.length
      scenario.recordings.forEach(recording => {
        const { userAgent } = recording
        const { api } = getAgentInfo(userAgent)
        apis.add(api)
        // recording.tags.forEach(tag => {
        //   if (tag.match(/^api\-/)) {
        //     apis.add(tag)
        //   }
        // })
      })
      scenario.apis = Array.from(apis)
      delete scenario.recordings
    })
    return { scenarios }
  })

  api.method("view-scenario", async ({ scenarioId }, db, req) => {
    const Scenarios = db.collection("scenarios")
    const Recordings = db.collection("recordings")
    const scenario = await Scenarios.findOne({ _id: scenarioId })
    const recordings = await Recordings.find({ scenarioId }).toArray()
    return { scenario, recordings }
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

  api.method(
    "record",
    async ({ scenarioId, events, comments, userAgent, tags }, db, req) => {
      const ip = getIpFromReq(req)
      console.log("ip", ip)
      const collection = db.collection("recordings")
      const { insertedId } = await collection.insertOne({
        _id: Random.id(),
        scenarioId,
        events,
        comments,
        userAgent,
        ip,
        tags,
        createdAt: new Date(),
      })
      return { insertedId }
    }
  )
}
