import styled from "styled-components"
import pick from "lodash/pick"
import Link from "next/link"
import UAParser from "ua-parser-js"
import Events from "../components/Events"

import client from "../util/client"
import {
  captureNativeEvent,
  captureReactEvent,
  captureHTMLEvent,
} from "./captureEvent"
import { NATIVE_EVENTS, REACT_EVENTS } from "./events"
import Back from "../components/Back"
import getAgentTags from "../util/get-agent-tags"

const __html = `<p>Hello little world</p>`

function getHTML() {
  const el = document.getElementById("content")
  return el.innerHTML
}

// const ContentsDiv = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 60%;
//   bottom: 0;
//   padding: 10px;
// `

// const EventsDiv = styled.div`
//   position: absolute;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   left: 40%;
//   overflow-y: scroll;
// `

function Tag({ children }) {
  return <span className={`badge badge-success mr-1`}>{children}</span>
}

export default class RecordEvents extends React.Component {
  startedAt = null
  isFrame = false
  isTimeout = false
  lastHTML = ""
  state = {
    events: [],
  }

  static async getInitialProps({ req, query }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
    const ua = UAParser(userAgent)
    const { scenarioId } = query
    const json = await client.call("get-scenario", { scenarioId })
    const tags = getAgentTags(ua)
    return { scenario: json.scenario, userAgent, ua, tags }
  }

  constructor(props) {
    super(props)
    this.setupReactEventProps()
  }

  submit = async () => {
    const { scenario, userAgent, tags } = this.props
    const { events } = this.state
    const result = await client.call("record", {
      scenarioId: scenario._id,
      events,
      userAgent,
      tags,
    })
    console.log(result)
  }

  setupReactEventProps() {
    this.reactEventProps = {}
    REACT_EVENTS.forEach(eventName => {
      this.reactEventProps[eventName] = this.recordReactEvent
    })
  }

  componentDidMount() {
    const el = document.getElementById("content")
    NATIVE_EVENTS.forEach(eventName => {
      el.addEventListener(eventName, this.recordNativeEvent)
    })
  }

  componentWillUnmount() {
    const el = document.getElementById("content")
    NATIVE_EVENTS.forEach(eventName => {
      el.removeEventListener(eventName, this.recordNativeEvent)
    })
  }

  pushLog(source, data) {
    const nowMs = new Date().getTime()
    const startMs = this.startedAt.getTime()
    const ms = nowMs - startMs
    const html = getHTML()
    const { events } = this.state
    const item = { source, ...data }
    if (html !== this.lastHTML) {
      this.lastHTML = html
      const htmlEvent = captureHTMLEvent(html)
      events.push({ ms, ...htmlEvent })
    }
    events.push({ ms, ...item })
    this.setState({ events })
  }

  pushEvent(source, event) {
    if (!this.startedAt) {
      this.startedAt = new Date()
    }
    if (!this.isFrame) {
      this.isFrame = true
      requestAnimationFrame(() => {
        this.endFrame()
      })
    }
    if (!this.isTimeout) {
      this.isTimeout = true
      setTimeout(() => {
        this.endTimeout()
      })
    }
    this.pushLog(source, event)
  }

  endFrame() {
    this.isFrame = false
    this.pushLog("TRANSACTION", { type: "requestAnimationFrame" })
  }

  endTimeout() {
    this.isTimeout = false
    this.pushLog("TRANSACTION", { type: "setTimeout" })
  }

  recordNativeEvent = e => {
    const event = captureNativeEvent(e)
    this.pushEvent("NATIVE", event)
  }

  recordReactEvent = e => {
    const event = captureReactEvent(e)
    this.pushEvent("REACT", event)
  }

  render() {
    const { userAgent, scenario, tags } = this.props
    const { events } = this.state
    return (
      <div className="container">
        <div className="row">
          <div className="col-md">
            <Back />
            <div style={{ whiteSpace: "pre-line" }}>
              <h5>{scenario.title}</h5>
              <code>
                <small>{userAgent}</small>
              </code>
              <div>{tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div>
              <div className="card card-body mt-3">
                <div
                  id="content"
                  className="form-control mb-4"
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: scenario.html }}
                  {...this.reactEventProps}
                />
                <div>{scenario.instructions}</div>
                <button className="btn btn-primary mt-4" onClick={this.submit}>
                  Submit Event Log
                </button>
              </div>
            </div>
          </div>
          <div className="col-md">
            <Events events={events} />
          </div>
        </div>
      </div>
    )
  }
}
