import React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import nightOwl from 'prism-react-renderer/themes/nightOwl'
import styled from 'styled-components'
import CopyIcon from './CopyIcon'
import DownloadIcon from './DownloadIcon'
import copy from 'copy-to-clipboard'
import { remote, app } from 'electron'

const { dialog } = remote
const fs = require('fs')

const Icon = styled(CopyIcon)`
  width: 20px;
  height: 20px;
  fill: white;
  position: absolute;
  right: 0;
`

const Download = styled(DownloadIcon)`
  width: 20px;
  height: 20px;
  fill: white;
  position: absolute;
  right: 40px;
`

const save = (code, name, jsx) => {
  dialog
    .showSaveDialog(null, {
      defaultPath: `${name.split('.')[0]}.${jsx ? 'jsx' : 'js'}`
    })
    .then(({ filePath }) => {
      if (filePath === undefined) {
        return
      }

      fs.writeFile(filePath, code, err => {
        if (err) return console.error(err)
      })
    })
}

export default ({ code, filename, jsx }) => (
  <Highlight {...defaultProps} theme={nightOwl} code={code} language="jsx">
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <pre
        className={className}
        style={{
          ...style,
          'white-space': 'pre-wrap',
          'word-wrap': 'break-word'
        }}
      >
        <Icon
          onClick={() => copy(code, { message: 'Click to copy to clipboard' })}
        />
        <Download onClick={() => save(code, filename, jsx)} />
        {tokens.map((line, i) => (
          <div {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              <span {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
)
