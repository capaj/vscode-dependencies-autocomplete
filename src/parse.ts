import { parse } from '@babel/parser'
console.log('babelParser: ', parse)

export default (text) => {
  return parse(text, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  })
}
