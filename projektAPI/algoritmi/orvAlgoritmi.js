
module.exports = {
    racunanjeZnacilk: function(req, res){
        const { spawn } = require("child_process");
        const variable = 'testData';
        const path = '../projektORV/test.py';
        const pythonProcess = spawn('py', [path , variable]);

        pythonProcess.stdout.on('data', (data) => {
            return res.json("stdOut: " + data);
        });
        
        pythonProcess.stderr.on('data', (data) => {
            return res.json("Error: " + data);
        });
    }
};