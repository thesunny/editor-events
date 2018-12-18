import routes from "next-routes"

export default routes()
  .add("scenario", "/scenario/:scenarioId?")
  .add("record-events", "/record-events/:scenarioId")
