'use strict'

const express = require('express')
const bodyparser = require('body-parser')
const app = express()
const api = require('./routes/routes')

app.use(bodyparser.urlencoded({ extended: false}))
app.use(bodyparser.json())
app.use('/api', api)

module.exports = app