const { MongoClient } = require("mongodb")

// import routes from "./routes"
import express from "express"
import api from "./api"

// const express = require("express")

// const { createServer } = require("http")
const { parse } = require("url")
const bodyParser = require("body-parser")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handleWithNext = app.getRequestHandler()

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/editor-events"
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 80

app.prepare().then(async () => {
  const mongoClient = await MongoClient.connect(MONGO_URL, {
    useNewUrlParser: true,
  })
  const db = mongoClient.db("editor-events")
  const server = express()
  server.use(bodyParser.json())
  server.use((req, res, next) => {
    req.db = db
    next()
  })
  api(server)
  server.get("*", (req, res) => {
    return handleWithNext(req, res)
  })
  server.listen(PORT)
})
