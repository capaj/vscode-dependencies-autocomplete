import _ from 'lodash'

export const nodeBuiltInModules = [
  'assert',
  'buffer',
  'constants',
  'crypto',
  'cluster',
  'dgram',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'http2',
  'https',
  'inspector',
  'module',
  'net',
  'os',
  'path',
  'process',
  'punycode',
  'querystring',
  'readline',
  'repl',
  'stream',
  'timers',
  'tls',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'zlib'
]
// we'd use this ideally, but it doesn't work for some reason inside vscode
// _.without(
//   require('module').builtinModules.filter((moduleName) => {
//     return !moduleName.includes('_') && !moduleName.includes('/')
//   }),
//   'console',
//   'sys'
// )
