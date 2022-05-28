const photoModel = require('../models/photoModel.js');

module.exports = {
    racunanjeZnacilk: function(req, res, path){
        photoModel.find(function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photos.',
                    error: err
                });
            }
            else{
                const { spawn } = require("child_process");
                const processPath = '../projektORV/test.py';
                const photosList = JSON.stringify(photos);
                const pythonProcess = spawn('py', [processPath , path, photosList]);
                pythonProcess.stdout.on('data', (data) => {
                    //return res.json("stdOut: " + data);
                    if(data.toString().trim() !== "auth"){
                        return res.status(201).json("Auth");
                    }
                    else{
                        console.log(data.toString());
                        return res.status(500).json({
                            message: 'Error when authenticating user',
                            error: data
                        });
                    }
                })
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