import typeOf from "type-of"

export default class API {
  constructor(server) {
    this.server = server
  }

  method(path, fn) {
    if (typeOf(path) !== "string") throw new Error("path must be a String")
    if (typeOf(fn) !== "function") throw new Error("fn must be a function")
    this.server.post(path, async (req, res, next) => {
      try {
        const result = await fn(req.body, req.db, req)
        if (typeOf(result) !== "object")
          throw new Error("result must be an Object")
        res.send(result)
      } catch (e) {
        next(e)
      }
    })
  }
}

