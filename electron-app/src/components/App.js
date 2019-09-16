import React from 'react'
import { useTabState, Tab, TabList, TabPanel } from 'reakit/Tab'
import CodePage from './CodePage'
import FilePage from './FilePage'
import styled, { createGlobalStyle } from 'styled-components'

const Styles = createGlobalStyle`
  html, body {
    padding: 0;
    margin: 0;
    background-color: rgb(1, 22, 39);
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  label {
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-transform: uppercase;
    white-space: nowrap;
    color: #888888;
    margin-bottom: 8px;
  }

  #root {
    max-width: 90%;
    position: relative;
    margin: auto;
    margin-top: 80px;
  }

  div[role="tabpanel"] {
    outline: none;
  }
`

const TabButton = styled(Tab)`
  padding: 8px 12px;
  background: transparent;
  color: #fff;
  border: 1px solid #444343;
  margin-right: 20px;
  font-size: 14px;
  transition: all 200ms ease;
  border-radius: 4px;

  &[aria-selected='true'] {
    background: #fff;
    color: rgb(1, 22, 39);
  }
`

const App = () => {
  const tab = useTabState({ selectedId: 'code' })
  return (
    <>
      <TabList {...tab} aria-label='My tabs'>
        <TabButton {...tab} stopId='code'>
          Import SVG Code
        </TabButton>
        <TabButton {...tab} stopId='file'>
          Import SVG File
        </TabButton>
      </TabList>
      <TabPanel {...tab} stopId='code'>
        <CodePage />
      </TabPanel>
      <TabPanel {...tab} stopId='file'>
        <FilePage />
      </TabPanel>
    </>
  )
}

export default () => (
  <>
    <Styles />
    <App />
  </>
)
