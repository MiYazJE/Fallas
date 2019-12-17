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

// update puntuacion
exports.updateOne = (req, res) => {

    let filter = { _id: req.params.puntuacionId }
    let change = { puntuacion: req.body.puntuacion } 

    console.log(filter)
    console.log(change)

    Puntuacion.updateOne(filter, change)
        .then(status => res.status(200).send(status))
        .catch(err => res.status(400).send({
            message: err.message || 'Problems ocurred'
        }))
}

// create and save
exports.create = (req, res) => {

    // validate body
    if (!req.body) {
        console.log(req.body);
        return res.status(400).send({
           message: "puntuacion Vacia..." 
        });
    }

    // Validate if the object is right
    if (!req.body.idFalla || !req.body.puntuacion || !req.body.ip) {
        return res.status(400).send({
            message: 'bad parameters'
        })
    }

    // Create the puntuation object
    const puntuacion = new Puntuacion({
        idFalla: req.body.idFalla,
        ip: req.body.ip,
        puntuacion: req.body.puntuacion
    })

    // Save the object
    puntuacion.save()
        .then(data => res.status(200).send(data))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Something was wrong creating puntuacion"
            });
        })
};

exports.findOne = (req, res) => {

    Puntuacion.findOne(req.params)
        .then(puntuacion => res.status(200).send(puntuacion))
        .catch(err => {
            res.status(500).send({
                message: err.message || "Problems produced..."
            })
        })

}

// Delete a puntuationId
exports.deleteOne = (req, res) => {

    let filter = {
        _id: req.params.puntuacionId
    }

    Puntuacion.deleteOne(filter)
        .then(status => res.status(200).send(status))
        .catch(err => res.status(500).send({
                message: err.message || "Problems produced..."
            }))

} 