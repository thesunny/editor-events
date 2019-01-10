import styled from "styled-components"
import pick from "lodash/pick"
import Link from "next/link"
import UAParser from "ua-parser-js"
import Events from "../components/Events"
import Router from "next/router"

import client from "../util/client"
import {
  captureNativeEvent,
  captureReactEvent,
  captureHTMLEvent,
  captureMutationEvent,
} from "./captureEvent"
import { NATIVE_EVENTS, REACT_EVENTS } from "./events"
import Back from "../components/Back"
import getAgentInfo from "../util/get-agent-info"

const __html = `<p>Hello little world</p>`

function getHTML() {
  const el = document.getElementById("content")
  return el.innerHTML
}

const EditorDiv = styled.div`
  border: 1px solid #e0e0e0;
  padding: 10px;
  border-radius: 5px;
`

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
    comments: "",
  }

  static async getInitialProps({ req, query }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent
    const { scenarioId } = query
    const json = await client.call("get-scenario", { scenarioId })
    const { tags, api, ua } = getAgentInfo(userAgent)
    return { scenario: json.scenario, userAgent, ua, api, tags }
  }

  constructor(props) {
    super(props)
    this.setupReactEventProps()
  }

  submit = async () => {
    const { scenario, userAgent, tags } = this.props
    const { events, comments } = this.state
    const result = await client.call("record", {
      scenarioId: scenario._id,
      events,
      comments,
      userAgent,
      tags,
    })
    Router.push("/")
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

    const observer = new MutationObserver(this.recordMutationEvent)
    observer.observe(el, {
      childList: true,
      attriutes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true,
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

  recordMutationEvent = e => {
    const event = captureMutationEvent(e)
    this.pushEvent("MUTATION", event)
  }

  render() {
    const { userAgent, scenario, api, tags } = this.props
    const { events, comments } = this.state
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
              <div>
                {api ? <Tag>{api}</Tag> : null}
                {tags.filter(tag => tag).map(tag => {
                  return <Tag key={tag}>{tag}</Tag>
                })}
              </div>
              <div className="card card-body mt-3">
                <h5>Make edits in here...</h5>
                <EditorDiv
                  id="content"
                  className="mb-4"
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: scenario.html }}
                  {...this.reactEventProps}
                />
                <h5>Instructions</h5>
                <div>{scenario.instructions}</div>
                <h5 className="mt-4">Comments</h5>
                <textarea
                  className="form-control"
                  value={comments}
                  rows={3}
                  onChange={e => this.setState({ comments: e.target.value })}
                />
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
