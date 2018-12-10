import lineHasOpenedStringLiteral from './line-has-opened-string-literal'
import vscode from 'vscode'

import usesSemi from './uses-semi'
import shouldCompleteIdentifiers from './should-complete-identifiers'
import parse from './parse'
import { getImportDeclarations, getImportedTokens } from './get-imports'
import { allDependencies, IDependency } from './extension'
import _ from 'lodash'
const { Position, Range, CompletionItem, TextEdit, workspace } = vscode
const config = workspace.getConfiguration('vscode-dependencies-autocomplete')

const makeCompletionItem = (dependency: IDependency) => {
  const camelizedName = _.camelCase(dependency.name)

  const ci = new CompletionItem(camelizedName)
  const { version } = dependency
  ci.documentation = `${dependency.type} ${version || ''}`
  ci.filterText = camelizedName
  ci.sortText = camelizedName
  ci.insertText = camelizedName
  return ci
}

function setTextEditWithJSXClosing(position, exportName, ci) {
  const closePosition = new Position(
    position.line,
    position.character + ci.insertText.length
  )
  const beginPosition = new Position(position.line, position.character - 1)
  ci.textEdit = TextEdit.replace(
    new Range(beginPosition, closePosition),
    `${exportName} />`
  )
}

class ExportersCompletionItemProvider {
  provideCompletionItems(document, position, token) {
    const quoteChar = config.quoteCharOverride || "'"
    const editorText = document.getText()
    const line = document.lineAt(position.line)
    const { text: lineText } = line
    console.log('lineText: ', lineText)
    const isWritingAPropName = lineText.match(/\.\w+$/)

    if (lineHasOpenedStringLiteral(line) || isWritingAPropName) {
      return null
    }
    let editorAST
    let closeJSX = false
    try {
      editorAST = parse(editorText)
    } catch (err) {
      if (err.message.startsWith('Unexpected token ')) {
        try {
          editorAST = parse(editorText.replace(lineText, lineText + '/>')) // jsx elements produce an error if not closed
          closeJSX = true
        } catch (err) {
          return null
        }
      } else {
        return null
      }
    }
    const documentOffset = document.offsetAt(position)
    if (!shouldCompleteIdentifiers(editorAST, documentOffset)) {
      return null
    }
    let positionForNewImport = new Position(0, 0)
    const importASTNodes = getImportDeclarations(editorAST)
    const lastImportNode = importASTNodes[importASTNodes.length - 1]
    if (lastImportNode) {
      positionForNewImport = new Position(lastImportNode.loc.end.line, 0)
    }
    const completions = []
    const thisDocumentFileName = document.fileName
    let lineEnding = '\n'
    try {
      if (usesSemi(thisDocumentFileName)) {
        lineEnding = ';\n'
      }
    } catch (err) {
      // ignore these errors
    }
    const importedTokens = getImportedTokens(importASTNodes)
    const addImportStatementToCompletionItem = (
      ci,
      name: string,
      importSource,
      importToken
    ) => {
      ci.additionalTextEdits = [
        TextEdit.insert(
          positionForNewImport,
          `import ${importToken} from ${quoteChar}${importSource}${quoteChar}${lineEnding}`
        )
      ]

      if (closeJSX) {
        setTextEditWithJSXClosing(position, name, ci)
      }
    }

    allDependencies.forEach((dep) => {
      if (importedTokens.includes(_.camelCase(dep.name))) {
        return null
      }
      const ci = makeCompletionItem(dep)
      const { name } = dep
      const camelizedName = _.camelCase(name)

      if (line.text.startsWith('import')) {
        const importStatement = `import ${camelizedName} from ${quoteChar}${name}${quoteChar}${lineEnding}`
        ci.textEdit = TextEdit.replace(line.range, importStatement)
        ci.label = name + ` from ${name}`
        ci.filterText = importStatement
        ci.sortText = importStatement
      } else {
        addImportStatementToCompletionItem(ci, name, name, camelizedName)
      }
      ci.kind = 8
      completions.push(ci)
    })

    return completions
  }
}

export default ExportersCompletionItemProvider
