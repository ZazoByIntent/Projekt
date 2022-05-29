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
                console.log(user_id);
                const { spawn } = require("child_process");
                processPath = '../projektORV/testModule.py';
                const testModuleProcess = spawn('py', [processPath , path]);
                /*
                testModuleProcess.stdout.on('data', (data) => {
                    //return res.json("stdOut: " + data);
                    //preveri 
                    if(data.toString().trim() !== "auth"){
                        return res.status(201).json("Auth"); //tule vrnes da je good
                    }
                    else{
                        console.log(data.toString());
                        return res.status(500).json({
                            message: 'Error when authenticating user',
                            error: data
                        });
                    }
                })*/
                return res.status(201).json("Auth");
                /* 
                pythonProcess.stderr.on('data', (data) => {
                    // return res.json("Error: " + data);
                    return res.status(500).json({
                        message: 'Error when authenticating user',
                        error: data
                    });
                });*/
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
                console.log(photosList);
                /* 
                pythonProcess.stderr.on('data', (data) => {
                    // return res.json("Error: " + data);
                    return res.status(500).json({
                        message: 'Error when authenticating user',
                        error: data
                    });
                });*/
            }
        });
    }
};