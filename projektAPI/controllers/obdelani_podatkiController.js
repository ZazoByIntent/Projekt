var Obdelani_podatkiModel = require('../models/obdelani_podatkiModel.js');

/**
 * obdelani_podatkiController.js
 *
 * @description :: Server-side logic for managing obdelani_podatkis.
 */
module.exports = {

    /**
     * obdelani_podatkiController.list()
     */
    list: function (req, res) {
        Obdelani_podatkiModel.find(function (err, obdelani_podatkis) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting obdelani_podatki.',
                    error: err
                });
            }

            return res.json(obdelani_podatkis);
        });
    },

    /**
     * obdelani_podatkiController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        Obdelani_podatkiModel.findOne({_id: id}, function (err, obdelani_podatki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting obdelani_podatki.',
                    error: err
                });
            }

            if (!obdelani_podatki) {
                return res.status(404).json({
                    message: 'No such obdelani_podatki'
                });
            }

            return res.json(obdelani_podatki);
        });
    },

    /**
     * obdelani_podatkiController.create()
     */
    create: function (req, res) {
        var obdelani_podatki = new Obdelani_podatkiModel({
			pospesek : req.body.pospesek,
			rotacija : req.body.rotacija,
			koordinate : req.body.koordinate,
            datum : new Date()
        });

        obdelani_podatki.save(function (err, obdelani_podatki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating obdelani_podatki',
                    error: err
                });
            }

            return res.status(201).json(obdelani_podatki);
        });
    },

    /**
     * obdelani_podatkiController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        Obdelani_podatkiModel.findOne({_id: id}, function (err, obdelani_podatki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting obdelani_podatki',
                    error: err
                });
            }

            if (!obdelani_podatki) {
                return res.status(404).json({
                    message: 'No such obdelani_podatki'
                });
            }

            obdelani_podatki.pospesek = req.body.pospesek ? req.body.pospesek : obdelani_podatki.pospesek;
			obdelani_podatki.rotacija = req.body.rotacija ? req.body.rotacija : obdelani_podatki.rotacija;
			obdelani_podatki.koordinate = req.body.koordinate ? req.body.koordinate : obdelani_podatki.koordinate;
			obdelani_podatki.datum = req.body.datum ? req.body.datum : obdelani_podatki.datum;
			
            obdelani_podatki.save(function (err, obdelani_podatki) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating obdelani_podatki.',
                        error: err
                    });
                }

                return res.json(obdelani_podatki);
            });
        });
    },

    /**
     * obdelani_podatkiController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        Obdelani_podatkiModel.findByIdAndRemove(id, function (err, obdelani_podatki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the obdelani_podatki.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
