const Obdelani_podatkiModel = require('../models/obdelani_podatkiModel.js');
const Neobdelani_podatkiModel = require('../models/neobdelani_podatkiModel.js');
const rezultatModel = require('../models/rezultatModel.js');

module.exports = {
    obdelava: function(req, res) {
        Neobdelani_podatkiModel.find()
        .sort( { datum : -1} )
        .limit(2)
        .exec(
            function (err, neobdelana_podatka) {
                //console.log(neobdelana_podatka);
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating obdelani_podatki',
                    error: err
                });
            }

            var first = neobdelana_podatka[0]; // zadnji dobljen podatek
            var second = neobdelana_podatka[1]; // predzadnji dobljen podatek


            if(first == null || second == null){
                end_result = null;
                return res.status(500).json({
                    message: 'Error when creating obdelani_podatki2',
                    error: err
                });
            } else if (first.user_id != second.user_id) {
                end_result = null;
                return res.status(500).json({
                    message: 'Error when creating obdelani_podatki2',
                    error: err
                });
            }

            var end_result = new Obdelani_podatkiModel({
                pospesek : 0,
                rotacija : 0,
                longitude : first.longitude,
                latitude : first.latitude,
                user_id : first.user_id,
                datum : new Date()
            });
            // https://code.tutsplus.com/tutorials/using-the-accelerometer-on-android--mobile-22125
            var timeDiff = (new Date(first.datum).getTime() - new Date(second.datum).getTime());
            end_result.pospesek = Math.abs(first.x_pospesek + first.y_pospesek + first.z_pospesek - second.x_pospesek - second.y_pospesek - second.z_pospesek)/timeDiff * 10000;

            // Rotacija:
            // Vir: https://stackoverflow.com/questions/29255939/calculate-rotation-from-two-coordintes
            // Izracun rotacije za vsako os (x,y,z) -> vzames tisto rotacijo Tiste tocke (kot) katera se je najbolj zatresla
                // X-Y rotacija
            var degreesX = Math.atan2((first.x_rotacija - second.x_rotacija), (first.y_rotacija - second.y_rotacija)) * 180 / Math.PI;
                if (degreesX < 0.0) degreesX += 360.0;
                // X-Z rotacija
            var degreesY = Math.atan2((first.x_rotacija - second.x_rotacija), (first.z_rotacija - second.z_rotacija)) * 180 / Math.PI;
                if (degreesY < 0.0) degreesY += 360.0;
                // Y-Z rotacija
            var degreesZ = Math.atan2((first.y_rotacija - second.y_rotacija), (first.z_rotacija - second.z_rotacija)) * 180 / Math.PI;
                if (degreesZ < 0.0) degreesZ += 360.0;

            // Preverimo če smo kljub prištetju 360° še vseeno pri negativnih vrednostih
            // To pomeni da ne pridobivamo pravilnih podatkov za rotacijo
            if(degreesX < 0 || degreesY < 0 || degreesZ < 0)
            {
                return res.status(500).json({
                    message: 'Error when getting rotation ',
                    error: err
                });
            }
            end_result.rotacija = (degreesX+degreesY+degreesZ)/3;

            if(timeDiff > 10000)
            {
                // Če je časovna razlika med posnetimi podatki večja od 10 sekund, obdelavo zavržemo(ni natančnih izračunov hitrosti)
                end_result = null;
                return res.status(500).json({
                    message: 'Error: Too much time beetween recorded data ',
                    error: err
                });
            }
            console.log("End_Result",end_result);
            end_result.save(function (err, obdelani_podatki) {

                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating obdelani_podatki',
                        error: err
                    });
                }
    
                module.exports.koncnaObdelava(req, res);
            });
        });
    }, 
    
    koncnaObdelava: function(req, res) {
        Obdelani_podatkiModel.find()
        .sort( { datum : -1} )
        .limit(2)
        .exec(
            function (err, obdelana_podatka){
                if (err) {
                    return res.status(500).json({
                        message: 'Error when creating rezultat',
                        error: err
                    });
                }

                var first = obdelana_podatka[0];        
                var second = obdelana_podatka[1]; 
                
                if(first == null || second == null){
                    return res.status(500).json({
                        message: 'Error when creating rezultat2',
                        error: err
                    });
                } else if (first.user_id != second.user_id) {
                    end_result = null;
                    return res.status(500).json({
                        message: 'Error when creating obdelani_podatki2',
                        error: err
                    });
                }

                var end_result = new rezultatModel({
                    stanje_ceste : 0,
                    longitude : first.longitude,
                    latitude : first.latitude,
                    user_id : first.user_id,
                    datum : new Date()
                });


                var timeDiff = (new Date(first.datum).getTime() - new Date(second.datum).getTime());
                console.log(first.datum,second.datum);
                // Dodaj preverjanje za rotacijo, popravi preverjanje pospeska
                // https://hypertextbook.com/facts/2001/MeredithBarricella.shtml
                // Neki normalen povprecni pospesek avta je med 3 in 4 m/s^2,
                // tak da če predpostavimo, da je pospesek vecji od 3
                if(Math.abs(first.pospesek) > 2){
                    end_result.stanje_ceste += Math.abs(first.pospesek - second.pospesek);
                    // Faktor za stanje ceste -> Za koliko se je zgodila rotacija glede na pretecen cas
                    // Vecja vrednost je -> slabsa je cesta ( Vecji je kot rotacije) ... manjsa je vrednost boljsa je cesta (manjsi je kot)
                    end_result.stanje_ceste += timeDiff/Math.abs(first.rotacija - second.rotacija);
                    //console.log("timeDiff: ",timeDiff,"Rotacija -",first.rotacija-second.rotacija);
                    if(end_result.stanje_ceste > 300) end_result.stanje_ceste = 5; // Tresljaj za manj kot 10°
                    else if(end_result.stanje_ceste > 200) end_result.stanje_ceste = 4; // Tresljaj 10° < x < 20°
                    else if(end_result.stanje_ceste > 100) end_result.stanje_ceste = 3; // Tresljaj 20° < x < 40°
                    else if(end_result.stanje_ceste > 50) end_result.stanje_ceste = 2; // Tresljaj 40° < x < 80°
                    else if(end_result.stanje_ceste > 25) end_result.stanje_ceste = 1; // Tresljaj za več kot 80°
                    else end_result.stanje_ceste = 0;
                }
                else { //zavrzemo saj se predmet ni premikal oz. je biu premajhen pospesek
                    end_result = null;
                    return res.status(500).json({
                        message: 'Error when creating rezultat3',
                        error: err
                    });
                }
                console.log(end_result);
                end_result.save(function (err, rezultat) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when creating rezultat3',
                            error: err
                        });
                    }
                    return res.status(201).json(rezultat);
                });
            }
        );
    }
};