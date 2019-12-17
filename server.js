const express    = require('express')
const path       = require('path') 
const bodyParser = require('body-parser')
const app        = express()

// MongoDB database
const dbConfig  = require('./config/database.config');
const mongoose  = require('mongoose');

mongoose.Promise = global.Promise;

// Parse jsons
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Test mongodb database
mongoose.connect(dbConfig.url, {useNewParser: true})
    .then(() => console.log('MongoDb ready to use!'))
    .catch((error) => {
        console.log(error)
        console.log('Algo ha pasado saliendo...')
        process.exit()
    })

// require puntuaciones routes
require('./app/routes/puntuaciones.routes.js')(app)

// Static pages 
app.use(express.static(path.join(__dirname, 'public')))

let port = process.env.port || 7000;
app.listen(port,() => console.log('Escuchando en el puerto ' + port))