import pick from "lodash/pick"
import {
  captureNativeEvent,
  captureReactEvent,
  captureHTMLEvent,
} from "../util/captureEvent"
import LogItem from "../components/LogItem"

const __html = `<p>Hello little world</p>`

const EVENT_PROPS = [
  "type",
  "key",
  "code",
  "repeat",
  "isComposing",
  "inputType",
  "data",
]

const NATIVE_EVENTS = [
  "compositionstart",
  "compositionupdate",
  "compositionend",
  "keydown",
  "keypress",
  "keyup",
  "focus",
  "blur",
  "focusin",
  "focusout",
  "change",
  "beforeinput",
  "input",
  "mousedown",
  "mouseup",
  "click",
  "dblclick",
  "pointerdown",
  "pointerup",
  "pointercancel",
  "selectstart",
  "selectionchange",
  "touchstart",
  "touchend",
  "touchcancel",
]

const REACT_EVENTS = [
  "onCompositionStart",
  "onCompositionUpdate",
  "onCompositionEnd",
  "onKeyDown",
  "onKeyPress",
  "onKeyUp",
  "onFocus",
  "onBlur",
  "onChange",
  "onInput",
  "onClick",
  "onDoubleClick",
  "onMouseDown",
  "onMouseUp",
  "onPointerDown",
  "onPointerUp",
  "onPointerCancel",
  "onSelect",
  "onTouchCancel",
  "onTouchEnd",
  "onTouchStart",
]

function copyEvent(e) {
  return pick(e, EVENT_PROPS)
}

function getHTML() {
  const el = document.getElementById("content")
  return el.innerHTML
}

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

  componentDidMount() {
    const el = document.getElementById("content")
    NATIVE_EVENTS.forEach(eventName => {
      el.addEventListener(eventName, this.recordNativeEvent)
    })
  }

  setupReactEventProps() {
    this.reactEventProps = {}
    REACT_EVENTS.forEach(eventName => {
      this.reactEventProps[eventName] = this.recordReactEvent
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

  componentDidUpdate() {

  }

  render() {
    const { events } = this.state
    return (
      <div>
        <style jsx>{`
          .Content {
            position: absolute;
            top: 0;
            right: 60%;
            bottom: 0;
            left: 0;
            padding: 10px;
          }
          .Events {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 40%;
            overflow-y: scroll;
          }
        `}</style>
        <link
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"
          type="text/css"
          rel="stylesheet"
        />
        <div className="Content">
          <div
            id="content"
            className="form-control"
            contentEditable
            dangerouslySetInnerHTML={{ __html }}
            {...this.reactEventProps}
          />
        </div>
        <div className="Events">
          <table className="table table-sm">
            <tbody>
              {events.map((event, index) => {
                return <LogItem key={index} index={index} event={event} />
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
