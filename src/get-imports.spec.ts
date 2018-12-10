import test from 'ava'
import { getImportDeclarations, getImportedTokens } from './get-imports'

test('get imports', (t) => {
  t.truthy(getImportDeclarations)
  t.truthy(getImportedTokens)
})
