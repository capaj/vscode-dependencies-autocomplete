import search from 'libnpmsearch'
import _ from 'lodash'

export async function searchOne(name: string) {
  const res = await search(_.kebabCase(name), { limit: 1 })
  return res[0]
}

searchOne('lodashKebabCase').then((r) => {
  console.log(r)
})
