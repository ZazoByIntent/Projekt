const scrapper_podatkiModel = require('../models/scrapper_podatkiModel.js');
var Scrapper_podatkiModel = require('../models/scrapper_podatkiModel.js');

/**
 * scrapper_podatkiController.js
 *
 * @description :: Server-side logic for managing scrapper_podatkis.
 */
module.exports = {

    /**
     * scrapper_podatkiController.list()
     */
    list: function (req, res) {
        Scrapper_podatkiModel.find()
            .sort({steviloVozil: -1})
            .limit(6)
            .exec(
                function (err, scrapper_podatkis) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting scrapper_podatki.',
                    error: err
                });
            }

            return res.json(scrapper_podatkis);
        });
    },

    /**
     * scrapper_podatkiController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        Scrapper_podatkiModel.findOne({_id: id}, function (err, scrapper_podatki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting scrapper_podatki.',
                    error: err
                });
            }

            if (!scrapper_podatki) {
                return res.status(404).json({
                    message: 'No such scrapper_podatki'
                });
            }

            return res.json(scrapper_podatki);
        });
    },

    /**
     * scrapper_podatkiController.create()
     */
    create: function (req, res) {
        var scrapper_podatki = new Scrapper_podatkiModel({
			lokacija : req.body.lokacija,
			latitude : req.body.latitude,
			longitude : req.body.longitude,
			cas : req.body.cas,
			povprecnaHitrost : req.body.povprecnaHitrost,
			steviloVozil : req.body.steviloVozil,
			gostota : req.body.gostota
        });

        scrapper_podatki.save(function (err, scrapper_podatki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating scrapper_podatki',
                    error: err
                });
            }

            return res.status(201).json(scrapper_podatki);
        });
    },

    /**
     * scrapper_podatkiController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        Scrapper_podatkiModel.findOne({_id: id}, function (err, scrapper_podatki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting scrapper_podatki',
                    error: err
                });
            }

            if (!scrapper_podatki) {
                return res.status(404).json({
                    message: 'No such scrapper_podatki'
                });
            }

            scrapper_podatki.lokacija = req.body.lokacija ? req.body.lokacija : scrapper_podatki.lokacija;
			scrapper_podatki.latitude = req.body.latitude ? req.body.latitude : scrapper_podatki.latitude;
			scrapper_podatki.longitude = req.body.longitude ? req.body.longitude : scrapper_podatki.longitude;
			scrapper_podatki.cas = req.body.cas ? req.body.cas : scrapper_podatki.cas;
			scrapper_podatki.povprecnaHitrost = req.body.povprecnaHitrost ? req.body.povprecnaHitrost : scrapper_podatki.povprecnaHitrost;
			scrapper_podatki.steviloVozil = req.body.steviloVozil ? req.body.steviloVozil : scrapper_podatki.steviloVozil;
			scrapper_podatki.gostota = req.body.gostota ? req.body.gostota : scrapper_podatki.gostota;
			
            scrapper_podatki.save(function (err, scrapper_podatki) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating scrapper_podatki.',
                        error: err
                    });
                }

                return res.json(scrapper_podatki);
            });
        });
    },

    /**
     * scrapper_podatkiController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        Scrapper_podatkiModel.findByIdAndRemove(id, function (err, scrapper_podatki) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the scrapper_podatki.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    removeall: function (req, res) {
        scrapper_podatkiModel.deleteMany({}, function(err, numberRemoved){
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the scrapper_podatki.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
