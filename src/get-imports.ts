import { ImportDeclaration, File } from 'babel-types'

export function getImportDeclarations(tree: File): ImportDeclaration[] {
  const { body } = tree.program
  return body.filter(
    (node) => node.type === 'ImportDeclaration'
  ) as ImportDeclaration[]
}

export function getImportedTokens(importDeclarations) {
  const tokens = []
  importDeclarations.forEach((declaration) => {
    declaration.specifiers.forEach((specifier) => {
      if (specifier.imported) {
        tokens.push(specifier.imported.name)
      } else {
        tokens.push(specifier.local.name)
      }
    })
  })
  return tokens
}
