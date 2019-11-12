'use strict'

const mongoose = require('mongoose')
const app = require('./app.js')
const config = require('./config')

// Conexion de la conexion con la BD
mongoose.connect(config.db, (err, res) => {
	if (err) {
		return console.log(`Error al conectar a la BD: ${err}`)
		console.log(res)
	}
	console.log(`Conexion a la BD: ${config.db} establecida`)

	app.listen(config.port, () => {
	console.log(`API REST corriendo en http://localhost:${config.port}/`)
	})
})
