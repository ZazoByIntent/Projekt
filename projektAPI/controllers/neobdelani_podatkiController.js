var Neobdelani_podatkiModel = require('../models/neobdelani_podatkiModel.js');

/**
 * neobdelani_podatkiController.js
 *
 * @description :: Server-side logic for managing neobdelani_podatkis.
 */
module.exports = {

    /**
     * neobdelani_podatkiController.list()
     */
    list: function (req, res) {
        Neobdelani_podatkiModel.find(function (err, neobdelani_podatkis) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting neobdelani_podatki.',
                    error: err
                });
            }

            return res.json(neobdelani_podatkis);
        });
    },

    /**
     * neobdelani_podatkiController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        Neobdelani_podatkiModel.findOne({_id: id}, function (err, neobdelani_podatki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting neobdelani_podatki.',
                    error: err
                });
            }

            if (!neobdelani_podatki) {
                return res.status(404).json({
                    message: 'No such neobdelani_podatki'
                });
            }

            return res.json(neobdelani_podatki);
        });
    },

    /**
     * neobdelani_podatkiController.create()
     */
    create: function (req, res) {
        var neobdelani_podatki = new Neobdelani_podatkiModel({
			x_rotacija : req.body.x_rotacija,
			y_rotacija : req.body.y_rotacija,
			z_rotacija : req.body.z_rotacija,
			x_pospesek : req.body.x_pospesek,
			y_pospesek : req.body.y_pospesek,
			z_pospesek : req.body.z_pospesek,
			koordinate : req.body.koordinate,
            datum : new Date()
        });

        neobdelani_podatki.save(function (err, neobdelani_podatki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating neobdelani_podatki',
                    error: err
                });
            }

            return res.status(201).json(neobdelani_podatki);
        });
    },

    /**
     * neobdelani_podatkiController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        Neobdelani_podatkiModel.findOne({_id: id}, function (err, neobdelani_podatki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting neobdelani_podatki',
                    error: err
                });
            }

            if (!neobdelani_podatki) {
                return res.status(404).json({
                    message: 'No such neobdelani_podatki'
                });
            }

            neobdelani_podatki.x_rotacija = req.body.x_rotacija ? req.body.x_rotacija : neobdelani_podatki.x_rotacija;
			neobdelani_podatki.y_rotacija = req.body.y_rotacija ? req.body.y_rotacija : neobdelani_podatki.y_rotacija;
			neobdelani_podatki.z_rotacija = req.body.z_rotacija ? req.body.z_rotacija : neobdelani_podatki.z_rotacija;
			neobdelani_podatki.x_pospesek = req.body.x_pospesek ? req.body.x_pospesek : neobdelani_podatki.x_pospesek;
			neobdelani_podatki.y_pospesek = req.body.y_pospesek ? req.body.y_pospesek : neobdelani_podatki.y_pospesek;
			neobdelani_podatki.z_pospesek = req.body.z_pospesek ? req.body.z_pospesek : neobdelani_podatki.z_pospesek;
			neobdelani_podatki.koordinate = req.body.koordinate ? req.body.koordinate : neobdelani_podatki.koordinate;
			neobdelani_podatki.datum = req.body.datum ? req.body.datum : neobdelani_podatki.datum;
			
            neobdelani_podatki.save(function (err, neobdelani_podatki) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating neobdelani_podatki.',
                        error: err
                    });
                }

                return res.json(neobdelani_podatki);
            });
        });
    },

    /**
     * neobdelani_podatkiController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        Neobdelani_podatkiModel.findByIdAndRemove(id, function (err, neobdelani_podatki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the neobdelani_podatki.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
