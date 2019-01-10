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

const TAG_REGEX = new RegExp(/(<).*(>)/i)
function jsonifyElement(el) {
  if (!el) return null
  if (el.nodeType === Node.TEXT_NODE) return el.textContent
  if (!el.outerHTML) return null
  return el.outerHTML
}

function jsonifyNodes(nodes) {
  return Array.from(nodes).map(el => {
    return jsonifyElement(el)
  })
}

function normalizeMutation(native) {
  const json = {
    type: native.type,
    target: jsonifyElement(native.target),
    nextSibling: jsonifyElement(native.nextSibling),
    previousSibling: jsonifyElement(native.previousSibling),
    addedNodes: jsonifyNodes(native.addedNodes),
    removedNodes: jsonifyNodes(native.removedNodes),
    attributeName: native.attributeName,
    attributeNamespace: native.attributeNamespace,
    oldValue: native.oldValue,
  }
  return json
}

export function captureMutationEvent(mutations) {
  const json = {
    source: "MUTATION",
    mutations: mutations.map(normalizeMutation),
  }
  return json
}
