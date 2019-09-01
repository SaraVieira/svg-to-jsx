const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const svgr = require('@svgr/core')
const port = 3000

const app = express()
app.use(helmet())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/', (req, res) => {
  console.log(req.body)
  const data = svgr.default.sync(req.body.svg)
  res.send({
    data
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
