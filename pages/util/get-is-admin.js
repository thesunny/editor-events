export default function getIsAdmin() {
  if (!process.browser) return null
  if (localStorage.getItem("isAdmin")) {
    return true
  } else {
    return false
  }
}
