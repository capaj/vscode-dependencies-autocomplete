import countOccurences from './count-occurences'

const tokens = ["'", '"', '`']

export default (str) => {
  const counts = tokens.map((token) => {
    return countOccurences(str, token)
  })
  return !!counts.find((count) => {
    if (count === 0) {
      return false
    }
    return !!(count % 2)
  })
}
