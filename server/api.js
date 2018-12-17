export default async function api(req, res, next) {
  try {
    next()
  } catch (e) {
    next(e)
  }
}
