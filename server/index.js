const { MongoClient } = require("mongodb")

import express from "express"

// const express = require("express")

// const { createServer } = require("http")
const { parse } = require("url")
const bodyParser = require("body-parser")
const next = require("next")

const dev = process.env.NODE_ENV !== "production"
const app = next({ dev })
const handleWithNext = app.getRequestHandler()

const MONGO_URL = "mongodb://localhost:27017/editor-events"
const PORT = 3000

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
  server.get("/api/scenarios", async (req, res, next) => {
    try {
      const { db } = req
      const collection = db.collection("scenarios")
      const scenarios = await (await collection.find({})).toArray()
      res.send({ scenarios })
    } catch (e) {
      next(e)
    }
  })
  server.post("/api/scenario", async (req, res, next) => {
    try {
      console.log("body", req.body)
      res.send(req.body)
    } catch (e) {
      next(e)
    }
  })
  server.get("*", (req, res) => {
    return handleWithNext(req, res)
  })
  server.listen(PORT)
  //   const db = await MongoClient.connect(MONGO_URL)
  //   createServer((req, res) => {
  //     // Be sure to pass `true` as the second argument to `url.parse`.
  //     // This tells it to parse the query portion of the URL.
  //     const parsedUrl = parse(req.url, true)
  //     const { pathname, query } = parsedUrl

  //     // if (pathname === '/a') {
  //     //   app.render(req, res, '/b', query)
  //     // } else if (pathname === '/b') {
  //     //   app.render(req, res, '/a', query)
  //     // } else {
  //     if (pathname.startsWith("/api/")) {
  //     } else {
  //       handleWithNext(req, res, parsedUrl)
  //     }
  //     // }
  //   }).listen(3000, err => {
  //     if (err) throw err
  //     console.log("> Ready on http://localhost:3000")
  //   })
})

// const api = require('./api')
// const body = require('body-parser')
// // const co = require('co')
// const express = require('express')
// const next = require('next')

// // const dev = process.env.NODE_ENV !== 'production'
// const app = next({ dev })
// const handle = app.getRequestHandler()
// const MONGO_URL = 'mongodb://localhost:27017/test'
// const PORT = 3000

// (async function () {
//   // await app.prepare()
//   // console.log(`Connection to ${MONGO_URL}`)
// })()

// co(function * () {
//   // Initialize the Next.js app
//   yield app.prepare()

//   console.log(`Connecting to ${MONGO_URL}`)
//   const db = yield MongoClient.connect(MONGO_URL)

//   // Configure express to expose a REST API
//   const server = express()
//   server.use(body.json())
//   server.use((req, res, next) => {
//     // Also expose the MongoDB database handle so Next.js can access it.
//     req.db = db
//     next()
//   })
//   server.use('/api', api(db))

//   // Everything that isn't '/api' gets passed along to Next.js
//   server.get('*', (req, res) => {
//     return handle(req, res)
//   })

//   server.listen(PORT)
//   console.log(`Listening on ${PORT}`)
// }).catch(error => console.error(error.stack))
