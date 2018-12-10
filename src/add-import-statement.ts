import os from 'os'
import path from 'path'
import usesSemi from './uses-semi'
import { getImportDeclarations } from './get-imports'

import parse from './parse'
const getSubstringUntilLastImportStatement = require('./get-substring-until-last-import-statement')
const { Position, window, workspace } = require('vscode')

const config = workspace.getConfiguration('vscode-dependencies-autocomplete')
const platform = os.platform()

export const addImportStatement = (ex, filePath) => {
  const { activeTextEditor } = window
  const { document } = activeTextEditor
  let relPath = filePath
  if (path.isAbsolute(filePath)) {
    relPath = path.relative(path.dirname(document.uri.path), filePath)
    const lastDot = relPath.lastIndexOf('.')
    relPath = relPath.substr(0, lastDot)
    if (relPath.indexOf('.') === -1) {
      relPath = './' + relPath
    }
    if (platform === 'win32') {
      relPath = relPath.replace(/\\/g, '/') // we don't want windows style paths
    }
  }

  const editorText = document.getText()
  const quoteChar = config.quoteCharOverride || "'"
  let lineEnding = '\n'
  try {
    if (usesSemi(document.fileName)) {
      lineEnding = ';\n'
    }
  } catch (err) {
    // ignore these errors
  }
  const importStatementsText = getSubstringUntilLastImportStatement(editorText)
  let editorAST
  try {
    editorAST = parse(importStatementsText)
  } catch (err) {
    return // bail-we can't do anything if it's not parseable
  }
  let positionForNewImport = new Position(0, 0)

  const importASTNodes = getImportDeclarations(editorAST)
  const lastImportNode = importASTNodes[importASTNodes.length - 1]
  if (lastImportNode) {
    positionForNewImport = new Position(lastImportNode.loc.end.line, 0)
  }

  const existingImportNode = importASTNodes.find((node) => {
    return node.source.value === relPath
  })

  let importToken = ex.name
  if (ex.default !== true) {
    importToken = `{${ex.name}}`
  }
  if (existingImportNode) {
    console.log('nothing')
  } else {
    return activeTextEditor.edit((editBuilder) => {
      editBuilder.insert(
        positionForNewImport,
        `import ${importToken} from ${quoteChar}${relPath}${quoteChar}${lineEnding}`
      )
    })
  }
}
