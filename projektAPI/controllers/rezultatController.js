var RezultatModel = require('../models/rezultatModel.js');

/**
 * rezultatController.js
 *
 * @description :: Server-side logic for managing rezultats.
 */
module.exports = {

    /**
     * rezultatController.list()
     */
    list: function (req, res) {
        RezultatModel.find(function (err, rezultats) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting rezultat.',
                    error: err
                });
            }

            return res.json(rezultats);
        });
    },

    /**
     * rezultatController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        RezultatModel.findOne({_id: id}, function (err, rezultat) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting rezultat.',
                    error: err
                });
            }

            if (!rezultat) {
                return res.status(404).json({
                    message: 'No such rezultat'
                });
            }

            return res.json(rezultat);
        });
    },

    /**
     * rezultatController.create()
     */
    create: function (req, res) {
        var rezultat = new RezultatModel({
			stanje_ceste : req.body.stanje_ceste,
			koordinate : req.body.koordinate,
            datum : req.body.datum
        });

        rezultat.save(function (err, rezultat) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating rezultat',
                    error: err
                });
            }

            return res.status(201).json(rezultat);
        });
    },

    /**
     * rezultatController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        RezultatModel.findOne({_id: id}, function (err, rezultat) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting rezultat',
                    error: err
                });
            }

            if (!rezultat) {
                return res.status(404).json({
                    message: 'No such rezultat'
                });
            }

            rezultat.stanje_ceste = req.body.stanje_ceste ? req.body.stanje_ceste : rezultat.stanje_ceste;
			rezultat.koordinate = req.body.koordinate ? req.body.koordinate : rezultat.koordinate;
            rezultat.datum = req.body.datum ? req.body.datum : rezultat.datum;
			
            rezultat.save(function (err, rezultat) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating rezultat.',
                        error: err
                    });
                }

                return res.json(rezultat);
            });
        });
    },

    /**
     * rezultatController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        RezultatModel.findByIdAndRemove(id, function (err, rezultat) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the rezultat.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
