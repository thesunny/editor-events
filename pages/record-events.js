import styled from "styled-components"
import pick from "lodash/pick"
import Link from "next/link"
import {
  captureNativeEvent,
  captureReactEvent,
  captureHTMLEvent,
} from "../util/captureEvent"
import LogItem from "../components/LogItem"
import { NATIVE_EVENTS, REACT_EVENTS } from "../util/events"
import Back from "./components/Back"

const __html = `<p>Hello little world</p>`

function getHTML() {
  const el = document.getElementById("content")
  return el.innerHTML
}

const ContentsDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 60%;
  bottom: 0;
  padding: 10px;
`

const EventsDiv = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 40%;
  overflow-y: scroll;
`

export default class RecordEvents extends React.Component {
  isFrame = false
  isTimeout = false
  lastHTML = ""
  state = {
    events: [],
  }

  constructor(props) {
    super(props)
    this.setupReactEventProps()
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
    const html = getHTML()
    const { events } = this.state
    const item = { source, html, ...data }
    if (html !== this.lastHTML) {
      this.lastHTML = html
      const htmlEvent = captureHTMLEvent(html)
      events.push(htmlEvent)
    }
    events.push(item)
    this.setState({ events })
  }

  pushEvent(source, event) {
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
    const { events } = this.state
    return (
      <div className="container">
        <ContentsDiv>
          <Back />
          <div
            id="content"
            className="form-control"
            contentEditable
            dangerouslySetInnerHTML={{ __html }}
            {...this.reactEventProps}
          />
        </ContentsDiv>
        <EventsDiv>
          <table className="table table-sm">
            <tbody>
              {events.map((event, index) => {
                return <LogItem key={index} index={index} event={event} />
              })}
            </tbody>
          </table>
        </EventsDiv>
      </div>
    )
  }
}
