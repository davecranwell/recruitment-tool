require('dotenv').config()
const express = require('express')
const compression = require('compression')
const morgan = require('morgan')
const { createRequestHandler } = require('@remix-run/express')

let app = express()

app.disable('x-powered-by')

app.use(compression())

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use('/build', express.static('public/build', { immutable: true, maxAge: '1y' }))

app.use(express.static('public', { maxAge: '1h' }))

const cache = {}

app.all(
  '*',
  createRequestHandler({
    build: require('./build'),
    getLoadContext() {
      // Whatever you return here will be passed as `context` to your loaders
      // and actions.
      return { cache }
    },
  })
)

let port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Express server started on http://localhost:${port}`)
})
