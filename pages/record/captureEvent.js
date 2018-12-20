import pick from "lodash/pick"

const EVENT_PROPS = [
  "type",
  "key",
  "code",
  "repeat",
  "isComposing",
  "inputType",
  "data",
  "metaKey",
  "ctrlKey",
  "altKey",
]

export function captureNativeEvent(e) {
  return {
    source: "NATIVE",
    constructorName: e.constructor.name,
    type: e.type,
    ...pick(e, EVENT_PROPS),
  }
}

export function captureReactEvent(e) {
  return {
    source: "REACT",
    ...pick(e, EVENT_PROPS),
  }
}

export function captureHTMLEvent(html) {
  return {
    source: "HTML",
    html,
  }
}
