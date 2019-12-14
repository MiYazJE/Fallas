const mongoose = require('mongoose');

// Object puntuacion model
const PuntuacionSchema = mongoose.Schema({
    idFalla: String,
    ip: String,
    puntuacion: Number
},{
    timestamps: true
});

module.exports = mongoose.model('Puntuacion', PuntuacionSchema);