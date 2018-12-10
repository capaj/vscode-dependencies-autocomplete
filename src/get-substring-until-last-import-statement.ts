const regX = /(}|) from ('(.*)'|"(.*)"|`(.*)`)/g

export default (string) => {
  const matches = string.match(regX)
  if (!matches || matches.length === 0) {
    return ''
  }
  const lastMatch = matches[matches.length - 1]
  const indexOfLastMatch = string.indexOf(lastMatch)

  return string.substring(0, indexOfLastMatch + lastMatch.length + 1)
}
