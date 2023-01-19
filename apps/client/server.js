require('dotenv').config()
const { exit } = require('process')
const express = require('express')
const compression = require('compression')
const morgan = require('morgan')
const { createRequestHandler } = require('@remix-run/express')

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled promise rejection reason: ${err}`)
  exit(1)
})

process.on('uncaughtException', (err) => {
  console.error(`Uncaught exception: ${err}`)
  exit(1) // exit the process to avoid unknown state
})

process.on('SIGTERM', async () => {
  console.log('SIGTERM sent to process.')
  exit(0)
})

process.on('SIGHUP', async () => {
  console.log('SIGHUP sent to process.')
  exit(0)
})

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
    build: require('./dist'),
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
