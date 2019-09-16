import React, { useState } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import nightOwl from 'prism-react-renderer/themes/nightOwl'
import styled, { css } from 'styled-components'
import CopyIcon from './CopyIcon'
import DownloadIcon from './DownloadIcon'
import copy from 'copy-to-clipboard'
import { remote } from 'electron'
import { Tooltip, TooltipReference, useTooltipState } from 'reakit/Tooltip'

const { dialog } = remote
const fs = require('fs')

const Icon = styled(CopyIcon)`
  width: 20px;
  height: 20px;
  fill: white;
  position: absolute;
  right: 0;
  cursor: pointer;

  ${props => props.copied && css`
    fill: #7cc77c
  `}

  &:hover {
    fill: #7cc77c;
  }
`

const Download = styled(DownloadIcon)`
  width: 20px;
  height: 20px;
  fill: white;
  position: absolute;
  right: 40px;
  cursor: pointer;

  &:hover {
    fill: #7cc77c;
  }
`

export default ({ code, filename, jsx }) => {
  const copyTooltip = useTooltipState({ placement: 'top-end' })
  const downloadTooltip = useTooltipState({ placement: 'top-end' })
  const [copied, setCopied] = useState(false)

  const save = () => {
    dialog
      .showSaveDialog(null, {
        defaultPath: `${filename.split('.')[0]}.${jsx ? 'jsx' : 'js'}`
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

  return <Highlight {...defaultProps} theme={nightOwl} code={code} language='jsx'>
    {({ className, style, tokens, getLineProps, getTokenProps }) => (
      <pre
        className={className}
        style={{
          ...style,
          'white-space': 'pre-wrap',
          'word-wrap': 'break-word'
        }}
      >
        <TooltipReference {...copyTooltip}>
          <Icon
            copied={copied}
            onClick={() => {
              copy(code, { message: 'Click to copy to clipboard' })
              setCopied(true)

              window.setTimeout(() => { setCopied(false) }, 1000)
            }}
          />
        </TooltipReference>
        <Tooltip style={{ fontSize: 12 }}{...copyTooltip}>{copied ? 'Copied!' : 'Copy to Clipboard'}</Tooltip>
        <TooltipReference {...downloadTooltip}>
          <Download onClick={save} />
        </TooltipReference>
        <Tooltip style={{ fontSize: 12 }}{...downloadTooltip}>Download File</Tooltip>
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line, key: i })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token, key })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
}
