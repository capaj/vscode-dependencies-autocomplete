/** Function that count occurrences of a substring in a string;
 * @author Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
export default function occurrences(
  str: string,
  subString: string,
  allowOverlapping?: boolean
) {
  str += ''
  subString += ''
  if (subString.length <= 0) return str.length + 1

  let n = 0
  let pos = 0
  let step = allowOverlapping ? 1 : subString.length

  while (true) {
    pos = str.indexOf(subString, pos)
    if (pos >= 0) {
      ++n
      pos += step
    } else break
  }
  return n
}
