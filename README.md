# vscode-dependencies-autocomplete

[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version/capaj.vscode-dependencies-autocomplete.svg)](https://marketplace.visualstudio.com/items?itemName=capaj.vscode-dependencies-autocomplete) [![Installs](https://vsmarketplacebadge.apphb.com/installs/capaj.vscode-dependencies-autocomplete.svg)](https://marketplace.visualstudio.com/items?itemName=capaj.vscode-dependencies-autocomplete) [![Rating](https://vsmarketplacebadge.apphb.com/rating/capaj.vscode-dependencies-autocomplete.svg)](https://marketplace.visualstudio.com/items?itemName=capaj.vscode-dependencies-autocomplete) [![Build Status](https://travis-ci.org/capaj/vscode-dependencies-autocomplete.svg?branch=master)](https://travis-ci.org/capaj/vscode-dependencies-autocomplete)

## Showcase

![showcase](images/showcase.gif)

## Features

Typescript does a great job at offering autocompletion for libraries which have typings, but unfortunatelly it fails to acknowledge any modules without them. Here's where this extension comes in-parses your package.json and adds those to your autocompletion provider.

## Extension Settings

This extension has the following settings:

- `vscode-dependencies-autocomplete.addImportsOnPaste`: set this to false when you're annoyed by import tokens being added on paste
- `vscode-dependencies-autocomplete.minimumWordLengthToImportOnPaste`: set this to a higher value if 'on paste' is too aggressive for you
- `vscode-dependencies-autocomplete.enableNpmDependencies`: set this to false when you're annoyed by the stuff you get from your npm modules\*
- `vscode-dependencies-autocomplete.addSpacingAroundCurlyBraces`: set this to true when you prefer spaces around curly braces
- `vscode-dependencies-autocomplete.indentationOverride`: string to be used when indenting, default is two spaces,
- `vscode-dependencies-autocomplete.quoteCharOverride`: string to be used when writing string literals, default is single quote, for doublequote use "\""

You need to restart VSCode for the changes to take effect.
