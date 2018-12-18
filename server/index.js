const { MongoClient } = require("mongodb")

import routes from "./routes"
import express from "express"
import api from "./api"

// const express = require("express")

// const { createServer } = require("http")
const { parse } = require("url")
const bodyParser = require("body-parser")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handleWithNext = routes.getRequestHandler(app)

const MONGO_URL = "mongodb://localhost:27017/editor-events"
const PORT = 5000

app.prepare().then(async () => {
  const mongoClient = await MongoClient.connect(MONGO_URL, {
    useNewUrlParser: true,
  })
  const db = mongoClient.db("editor-events")
  const collection = db.collection("editor-events")
  const server = express()
  server.use(bodyParser.json())
  server.use((req, res, next) => {
    req.db = db
    next()
  })
  api(server)
  server.get("/record-events/:path", async (req, res, next) => {
    const parsedUrl = parse(req.url, true)
    return handleWithNext(req, res, "/record-events")
  })
  server.get("*", (req, res) => {
    return handleWithNext(req, res)
  })
  server.listen(PORT)
})
