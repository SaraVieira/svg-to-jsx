const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const svgr = require('@svgr/core')
const port = 3000
require('@svgr/plugin-svgo')
require('@svgr/plugin-prettier')
require('@svgr/plugin-jsx')

const app = express()
app.use(helmet())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', (req, res) => {
  const {
    name,
    svg,
    native,
    ext = 'js',
    icon,
    dimensions,
    expandProps = 'end',
    ref,
    replaceAttrValues,
    svgProps,
    titleProp
  } = req.body
  try {
    const data = svgr.default.sync(
      svg,
      {
        native,
        ext,
        icon,
        dimensions,
        expandProps,
        ref,
        replaceAttrValues,
        svgProps,
        titleProp,
        plugins: [
          '@svgr/plugin-svgo',
          '@svgr/plugin-jsx',
          '@svgr/plugin-prettier'
        ]
      },
      { componentName: name || 'Icon' }
    )
    res.send({
      data
    })
  } catch {
    res.status(500).send({
      error: "Couldn't parse SVG"
    })
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
