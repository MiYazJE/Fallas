const Puntuacion = require('../models/puntuacion.model.js');

// Get all data of puntuaciones
exports.findAll = (req, res) => {

    Puntuacion.find()
        .then(puntuaciones => res.status(200).send(puntuaciones))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Problems produced..."
            });
        });

};

// Get all puntuations from a ip
exports.findSome = (req, res) => {

    Puntuacion.find(req.params)
        .then(puntuaciones => res.status(200).send(puntuaciones))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Problems produced..."
            })
        })
    
}

// create and save
exports.create = (req, res) => {

    // validate puntuacion
    if (!req.body) {
        console.log(req.body);
        return res.status(400).send({
           message: "puntuacion Vacia..." 
        });
    }

    if (!req.body.idFalla || !req.body.puntuacion || !req.body.ip) {
        return res.send({
            message: 'bad parameters'
        })
    }

    // Create the object
    const puntuacion = new Puntuacion({
        idFalla: req.body.idFalla || "idFallaVacio",
        ip: req.body.ip || "127.0.0.1",
        puntuacion: req.body.puntuacion || 42
    })

    // Save the object
    puntuacion.save()
        .then(data => res.send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Something was wrong creating puntuacion"
            });
        })
};