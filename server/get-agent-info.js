// NOTE:
// Yuck! Redundant! This is a copy from `pages/util/get-agent-info`.
// But easiest way to get it to work without messing around with rollup or
// webpack.

import UAParser from "ua-parser-js"

const ANDROID_API_VERSIONS = [
  [/^4[.]4/, "API-20"],
  [/^5([.]0|[^.])/, "API-21"],
  [/^5[.]1/, "API-22"],
  [/^6([.]0|[^.])/, "API-23"],
  [/^7([.]0|[^.])/, "API-24"],
  [/^7[.]1/, "API-25"],
  [/^8([.]0|[^.])/, "API-26"],
  [/^8[.]1/, "API-27"],
  [/^9([.]0|[^.])/, "API-28"],
]

function getApiVersion(os) {
  if (os.name !== "Android") return null
  const { version } = os
  for (let tuple of ANDROID_API_VERSIONS) {
    const [regex, tag] = tuple
    if (version.match(regex)) return tag //tags.push(tag)
  }
  return null
}

export default function(userAgent) {
  const ua = UAParser(userAgent)
  const { os, browser, device } = ua
  const tags = [browser.name, os.name, device.type, device.vendor]
  const api = getApiVersion(os)
  return { api, tags, ua }
}
