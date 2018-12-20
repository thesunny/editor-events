import routes from "next-routes"

export default routes()
  .add("view", "/view/:scenarioId", "view")
  .add("scenario", "/scenario/:scenarioId?", "scenario")
  .add("record", "/record/:scenarioId", "record")
