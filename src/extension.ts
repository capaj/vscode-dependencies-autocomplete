import path from 'path'
import vscode from 'vscode'
import fs from 'mz/fs'
import ExportersCompletionItemProvider from './exporters-completion-provider'
import { nodeBuiltInModules } from './built-in-modules'
const { workspace } = vscode
let editorChangeEvent
const config = workspace.getConfiguration('vscode-dependencies-autocomplete')

export interface IDependency {
  name: string
  type: 'dependency' | 'devDependency' | 'built-in'
  version?: string
}

export const allDependencies: IDependency[] = []

function addBuiltInModules() {
  nodeBuiltInModules.forEach((builtInModule) => {
    allDependencies.push({
      name: builtInModule,
      type: 'built-in'
    })
  })
}

function activate(context) {
  const readPackageJsonDeps = async () => {
    const pckgJsonString = await fs.readFile(
      path.join(workspace.rootPath, 'package.json'),
      'utf8'
    )

    const pckgJson = JSON.parse(pckgJsonString)
    if (
      config.get('vscode-dependencies-autocomplete.built-in-modules') ===
      'always'
    ) {
      addBuiltInModules()
    } else if (
      config.get('vscode-dependencies-autocomplete.built-in-modules') ===
      'when @types/node'
    ) {
      if (pckgJson.devDependencies && pckgJson.devDependencies['@types/node']) {
        addBuiltInModules()
      }
    }
    function addDependency(
      depName: string,
      type: 'dependency' | 'devDependency' | 'built-in'
    ) {
      if (depName.startsWith('@types')) {
        return
      }
      allDependencies.push({
        name: depName,
        type,
        version: pckgJson.dependencies[depName]
      })
    }
    if (pckgJson.dependencies) {
      Object.keys(pckgJson.dependencies).forEach((depName) => {
        addDependency(depName, 'dependency')
      })
    }
    if (pckgJson.devDependencies) {
      Object.keys(pckgJson.devDependencies).forEach((depName) => {
        addDependency(depName, 'devDependency')
      })
    }
  }
  if (workspace.rootPath) {
    readPackageJsonDeps()
  }

  const dispAutocomplete = vscode.languages.registerCompletionItemProvider(
    ['javascript', 'javascriptreact', 'typescript', 'typescriptreact'],
    new ExportersCompletionItemProvider()
  )

  // if (config.addImportsOnPaste) {
  //   editorChangeEvent = addImportsOnPaste()
  // }

  context.subscriptions.push(dispAutocomplete)
}

function deactivate() {
  if (editorChangeEvent) {
    editorChangeEvent.dispose()
  }
}

module.exports = {
  activate,
  deactivate
}
