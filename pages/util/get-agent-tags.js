const ANDROID_API_VERSIONS = [
  [/^4[.]4/, "android-20"],
  [/^5[.]0/, "android-21"],
  [/^5[.]1/, "android-22"],
  [/^6[.]0/, "android-23"],
  [/^7[.]0/, "android-24"],
  [/^7[.]1/, "android-25"],
  [/^8[.]0/, "android-26"],
  [/^8[.]1/, "android-27"],
  [/^9[.]0/, "android-28"],
]

export default function({ os, browser }) {
  const browserTag = browser.name.toLowerCase()
  const osTag = os.name.toLowerCase().replace(/\s+/g, "-")
  const tags = [browserTag, osTag]
  
  if (os.name !== "Android") return tags

  const { version } = os
  ANDROID_API_VERSIONS.forEach(([regex, tag]) => {
    if (version.match(regex)) tags.push(tag)
  })
  return tags
}
