const photoModel = require('../models/photoModel.js');

module.exports = {
    avtentifikacija: function(req, res, path, user_id){
        photoModel.find(function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photos.',
                    error: err
                });
            }
            else{
                //photos list vse slike, path slika za authentication
                console.log("Authenticating user:" + user_id);
                const { spawn } = require("child_process");
                processPath = '../projektORV/testModule.py';
                const testModuleProcess = spawn('py', [processPath , path]);
                
                testModuleProcess.stdout.on('data', (data) => {
                    if(data.toString().trim() === "1"){
                        console.log(data.toString());
                        return res.status(201).json("Authenticated");
                    }
                    else{
                        console.log(data.toString());
                        return res.status(500).json({
                            message: 'Error when authenticating user',
                            error: data
                        });
                    }
                })


                
                testModuleProcess.stderr.on('data', (data) => {
                    // return res.json("Error: " + data);
                    console.log(data.toString().trim());
                });/* */
            }
        });
    },
    racunanjeZnacilk: function(req, res, path, user_id){
        photoModel.find(function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photos.',
                    error: err
                });
            }
            else{
                //photos list vse slike, path slika za authentication
                console.log(user_id);
                const { spawn } = require("child_process");
                const processPath = '../projektORV/createModule.py';
                const photosList = JSON.stringify(photos);
                const createModuleProcess = spawn('py', [processPath, photosList]);
                
                createModuleProcess.stdout.on('data', (data) => {
                    console.log(data.toString());
                });

                createModuleProcess.stderr.on('data', (data) => {
                    console.log(data.toString());
                });
            }
        });
    }
};