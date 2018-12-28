import UAParser from "ua-parser-js"

const ANDROID_API_VERSIONS = [
  [/^9([.]0|)/, "API-28"],
  [/^8[.]1/, "API-27"],
  [/^8([.]0|)/, "API-26"],
  [/^7[.]1/, "API-25"],
  [/^7([.]0|)/, "API-24"],
  [/^6([.]0|)/, "API-23"],
  [/^5[.]1/, "API-22"],
  [/^5([.]0|)/, "API-21"],
  [/^4[.]4/, "API-20"],
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
  const badges = [api, ...tags]
  return { api, tags, ua, badges }
}
