const ANDROID_API_VERSIONS = [
  [/^4[.]4/, "api-20"],
  [/^5[.]0/, "api-21"],
  [/^5[.]1/, "api-22"],
  [/^6[.]0/, "api-23"],
  [/^7[.]0/, "api-24"],
  [/^7[.]1/, "api-25"],
  [/^8[.]0/, "api-26"],
  [/^8[.]1/, "api-27"],
  [/^9[.]0/, "api-28"],
]

export default function({ os, browser }) {
  const browserTag = browser.name.toLowerCase()
  const osTag = os.name.toLowerCase().replace(/\s+/g, "-")
  const tags = [browserTag, osTag]

  if (os.name === "Android") {
    const { version } = os
    ANDROID_API_VERSIONS.forEach(([regex, tag]) => {
      if (version.match(regex)) tags.push(tag)
    })
  }
  return tags
}
